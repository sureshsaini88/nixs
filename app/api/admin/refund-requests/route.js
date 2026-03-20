import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import RefundRequest from '../../../../lib/models/RefundRequest';
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
    const requests = await RefundRequest.find().sort({ createdAt: -1 }).populate('user_id', 'username');

    const result = requests.map(r => ({
      ...r.toJSON(),
      username: r.user_id?.username,
      user_id: r.user_id?._id?.toString(),
    }));

    return Response.json(result);

  } catch (error) {
    console.error('Error fetching refund requests:', error);
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

    const { requestId, status } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return Response.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectDB();
    const refundRequest = await RefundRequest.findById(requestId);
    if (!refundRequest) {
      return Response.json({ message: 'Refund request not found' }, { status: 404 });
    }

    if (status === 'approved') {
      await User.findByIdAndUpdate(refundRequest.user_id, { $inc: { balance: refundRequest.refund_amount } });
    }

    const updated = await RefundRequest.findByIdAndUpdate(
      requestId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    return Response.json({ message: `Refund request ${status}`, request: updated });

  } catch (error) {
    console.error('Error updating refund request:', error);
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
    const requestId = url.searchParams.get('id');

    if (!requestId) {
      return Response.json({ message: 'Missing request ID' }, { status: 400 });
    }

    await connectDB();
    const deleted = await RefundRequest.findByIdAndDelete(requestId);

    if (!deleted) {
      return Response.json({ message: 'Request not found' }, { status: 404 });
    }

    return Response.json({ message: 'Request deleted successfully' });

  } catch (error) {
    console.error('Error deleting refund request:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
