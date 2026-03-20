import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import TiktokAdApplication from '../../../../lib/models/TiktokAdApplication';
import TiktokAccount from '../../../../lib/models/TiktokAccount';
import User from '../../../../lib/models/User';

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
    const applications = await TiktokAdApplication.find().sort({ createdAt: -1 }).populate('user_id', 'username');

    const result = applications.map(a => ({
      ...a.toJSON(),
      username: a.user_id?.username,
      user_id: a.user_id?._id?.toString(),
    }));

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching TikTok ad applications:', error);
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

    if (!applicationId || !status) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const application = await TiktokAdApplication.findById(applicationId);
    if (!application) {
      return Response.json({ message: 'Application not found' }, { status: 404 });
    }

    if (status === 'approved') {
      const user = await User.findById(application.user_id);
      if (!user) {
        return Response.json({ message: 'User not found' }, { status: 404 });
      }

      if (user.balance < application.deposit_amount) {
        return Response.json({ message: 'User has insufficient balance' }, { status: 400 });
      }

      await User.findByIdAndUpdate(application.user_id, { $inc: { balance: -application.deposit_amount } });
      await TiktokAccount.create({
        user_id: application.user_id,
        application_id: application._id,
        account_name: `TikTok-${application.ad_name || 'Account'}`,
        email: null,
        timezone: application.timezone,
        balance: application.deposit_amount,
        status: 'active',
      });
    }

    const updated = await TiktokAdApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    return Response.json({ message: `Application ${status} successfully`, application: updated });

  } catch (error) {
    console.error('Error updating TikTok ad application:', error);
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
    const deleted = await TiktokAdApplication.findByIdAndDelete(appId);

    if (!deleted) {
      return Response.json({ message: 'Application not found' }, { status: 404 });
    }

    return Response.json({ message: 'Application deleted successfully' });

  } catch (error) {
    console.error('Error deleting TikTok ad application:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
