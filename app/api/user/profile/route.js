import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
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
    if (!decoded) {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select('username balance createdAt');

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json({
      id: user._id.toString(),
      username: user.username,
      balance: user.balance,
      created_at: user.createdAt,
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
