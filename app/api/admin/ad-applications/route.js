import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import AdApplication from '../../../../lib/models/AdApplication';
import User from '../../../../lib/models/User';
import UserAdsAccount from '../../../../lib/models/UserAdsAccount';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const applications = await AdApplication.find().sort({ createdAt: -1 }).populate('user_id', 'username');

    const result = applications.map(a => ({
      ...a.toJSON(),
      username: a.user_id?.username,
      user_id: a.user_id?._id?.toString(),
    }));

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching ad applications:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { applicationId, status } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return Response.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    const application = await AdApplication.findByIdAndUpdate(
      applicationId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return Response.json({ message: 'Application not found' }, { status: 404 });
    }

    if (status === 'approved') {
      const user = await User.findById(application.user_id);
      if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
      }

      const totalCost = application.total_cost || 0;
      if (user.balance < totalCost) {
        return Response.json({ message: 'Insufficient balance' }, { status: 400 });
      }

      await User.findByIdAndUpdate(application.user_id, { $inc: { balance: -totalCost } });

      const adAccounts = application.ad_accounts || [];
      for (let i = 0; i < adAccounts.length; i++) {
        const account = adAccounts[i];
        await UserAdsAccount.create({
          user_id: application.user_id,
          license: application.license_name,
          ads_account_id: `FB-${Date.now()}-${i}`,
          ads_account_name: `DN1910-${account.name}`,
          ad_type: 'New',
          operate: 'bm share | ad deposit',
          platform: 'facebook',
        });
      }
    }

    return Response.json({ message: `Application ${status}`, application });

  } catch (error) {
    console.error('Error updating ad application:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const url = new URL(request.url);
    const appId = url.searchParams.get('id');

    if (!appId) {
      return Response.json({ message: 'Missing application ID' }, { status: 400 });
    }

    await connectDB();
    const deleted = await AdApplication.findByIdAndDelete(appId);

    if (!deleted) {
      return Response.json({ message: 'Application not found' }, { status: 404 });
    }

    return Response.json({ message: 'Application deleted successfully' });

  } catch (error) {
    console.error('Error deleting ad application:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
