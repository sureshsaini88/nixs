import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import BmShareRequest from '../../../lib/models/BmShareRequest';
import User from '../../../lib/models/User';

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
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { ads_account_id, ads_account_name, bm_id } = await request.json();

    if (!bm_id || !ads_account_id) {
      return Response.json({ message: 'BM ID and account are required' }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    const bmRequest = await BmShareRequest.create({
      user_id: decoded.id,
      username: user?.username || decoded.username,
      ads_account_id,
      ads_account_name,
      bm_id,
    });

    return Response.json(bmRequest, { status: 201 });
  } catch (error) {
    console.error('BM share error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return Response.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const requests = await BmShareRequest.find({ user_id: decoded.id }).sort({ createdAt: -1 });
    return Response.json(requests);
  } catch (error) {
    console.error('BM share fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
