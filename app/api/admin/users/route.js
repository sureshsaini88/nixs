import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    const accounts = await UserAdsAccount.find();

    // Merge accounts into users (like a LEFT JOIN)
    const result = users.flatMap(user => {
      const userAccounts = accounts.filter(a => a.user_id.toString() === user._id.toString());
      if (userAccounts.length === 0) {
        return [{
          id: user._id.toString(),
          username: user.username,
          balance: user.balance,
          created_at: user.createdAt,
          license: null, ads_account_id: null, ads_account_name: null, ad_type: null, operate: null
        }];
      }
      return userAccounts.map(a => ({
        id: user._id.toString(),
        username: user.username,
        balance: user.balance,
        created_at: user.createdAt,
        license: a.license,
        ads_account_id: a.ads_account_id,
        ads_account_name: a.ads_account_name,
        ad_type: a.ad_type,
        operate: a.operate,
      }));
    });

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
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

    const { username, password, license, ads_account_id, ads_account_name, ad_type, operate } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    const user = await User.create({ username, password: hashedPassword, balance: 0 });

    if (license || ads_account_id || ads_account_name || ad_type || operate) {
      await UserAdsAccount.create({
        user_id: user._id,
        license,
        ads_account_id,
        ads_account_name,
        ad_type,
        operate,
      });
    }

    return Response.json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
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
    const userId = searchParams.get('id');

    if (!userId) {
      return Response.json({ message: 'User ID required' }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndDelete(userId);
    await UserAdsAccount.deleteMany({ user_id: userId });

    return Response.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
