import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import SnapchatAccount from '../../../../lib/models/SnapchatAccount';

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
    const accounts = await SnapchatAccount.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(accounts);

  } catch (error) {
    console.error('Error fetching Snapchat accounts:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
