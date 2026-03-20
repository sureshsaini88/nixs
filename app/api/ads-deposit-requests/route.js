import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import AdsDepositRequest from '../../../lib/models/AdsDepositRequest';

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

    const { deposits } = await request.json();

    await connectDB();
    const results = [];
    for (const deposit of deposits) {
      const record = await AdsDepositRequest.create({
        user_id: decoded.id,
        ads_account_id: deposit.accountId,
        ads_account_name: deposit.account,
        deposit_amount: deposit.amount,
        cost_amount: deposit.cost,
        status: 'pending',
      });
      results.push(record);
    }

    return Response.json({ message: 'Deposit requests submitted successfully', requests: results });

  } catch (error) {
    console.error('Error creating deposit request:', error);
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
    const requests = await AdsDepositRequest.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(requests);

  } catch (error) {
    console.error('Error fetching deposit requests:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
