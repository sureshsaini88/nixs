import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import RefundRequest from '../../../lib/models/RefundRequest';

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
    if (!decoded) {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { refundAmount, reason } = await request.json();

    if (!refundAmount || !reason) {
      return Response.json({ message: 'Refund amount and reason are required' }, { status: 400 });
    }

    await connectDB();
    const refundRequest = await RefundRequest.create({
      user_id: decoded.id,
      refund_amount: refundAmount,
      reason,
      status: 'pending',
    });

    return Response.json({ message: 'Refund request submitted successfully', request: refundRequest });

  } catch (error) {
    console.error('Error creating refund request:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
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
    const requests = await RefundRequest.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(requests);

  } catch (error) {
    console.error('Error fetching refund requests:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
