import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import SnapchatAdApplication from '../../../../lib/models/SnapchatAdApplication';
import SnapchatAccount from '../../../../lib/models/SnapchatAccount';
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
    const applications = await SnapchatAdApplication.find().sort({ createdAt: -1 }).populate('user_id', 'username');

    const result = applications.map(a => ({
      ...a.toJSON(),
      username: a.user_id?.username,
      user_id: a.user_id?._id?.toString(),
    }));

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching Snapchat ad applications:', error);
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
    const application = await SnapchatAdApplication.findById(applicationId);
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
      await SnapchatAccount.create({
        user_id: application.user_id,
        application_id: application._id,
        account_name: `Snapchat-${application.public_profile_name || 'Account'}`,
        email: application.gmail,
        timezone: application.timezone,
        balance: application.deposit_amount,
        status: 'active',
      });
    }

    const updated = await SnapchatAdApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    return Response.json({ message: `Application ${status} successfully`, application: updated });

  } catch (error) {
    console.error('Error updating Snapchat ad application:', error);
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
    const deleted = await SnapchatAdApplication.findByIdAndDelete(appId);

    if (!deleted) {
      return Response.json({ message: 'Application not found' }, { status: 404 });
    }

    return Response.json({ message: 'Application deleted successfully' });

  } catch (error) {
    console.error('Error deleting Snapchat ad application:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
