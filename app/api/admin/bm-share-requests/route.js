import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import BmShareRequest from '../../../../lib/models/BmShareRequest';

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
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const requests = await BmShareRequest.find().sort({ createdAt: -1 });
    return Response.json(requests);
  } catch (error) {
    console.error('Admin BM share fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { requestId, status } = await request.json();
    await BmShareRequest.findByIdAndUpdate(requestId, { status });
    return Response.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('Admin BM share update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
