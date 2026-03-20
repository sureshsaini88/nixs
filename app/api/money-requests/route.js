import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import MoneyRequest from '../../../lib/models/MoneyRequest';

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
    const requests = await MoneyRequest.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(requests);

  } catch (error) {
    console.error('Error fetching money requests:', error);
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
    if (!decoded) {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const payway = formData.get('payway');
    const charge = formData.get('charge');
    const transactionId = formData.get('transactionId');
    const internalNote = formData.get('internalNote');
    const picture = formData.get('picture');

    let screenshotData = null;
    if (picture && picture.size > 0) {
      const bytes = await picture.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      screenshotData = `data:${picture.type || 'image/jpeg'};base64,${base64}`;
    }

    await connectDB();
    const moneyRequest = await MoneyRequest.create({
      user_id: decoded.id,
      payway,
      charge_amount: charge,
      transaction_id: transactionId,
      internal_note: internalNote,
      screenshot_url: screenshotData,
      status: 'pending',
    });

    return Response.json({ message: 'Request submitted', request: moneyRequest });

  } catch (error) {
    console.error('Error creating money request:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
