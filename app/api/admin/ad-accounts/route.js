import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
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

export async function POST(request) {
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

    const { userId, license, ads_account_id, ads_account_name, ad_type, operate, platform } = await request.json();

    if (!userId) {
      return Response.json({ message: 'User ID is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const account = await UserAdsAccount.create({
      user_id: userId,
      license,
      ads_account_id,
      ads_account_name,
      ad_type: ad_type || 'New',
      operate: operate || 'bm share | ad deposit',
      platform: platform || 'facebook',
    });

    return Response.json({ message: 'Ad account created successfully', account });

  } catch (error) {
    console.error('Error creating ad account:', error);
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

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return Response.json({ message: 'Account ID required' }, { status: 400 });
    }

    await connectDB();
    await UserAdsAccount.findByIdAndDelete(accountId);

    return Response.json({ message: 'Ad account deleted successfully' });

  } catch (error) {
    console.error('Error deleting ad account:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
