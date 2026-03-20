import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import SnapchatAccount from '../../../../lib/models/SnapchatAccount';
import SnapchatDepositRecord from '../../../../lib/models/SnapchatDepositRecord';

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

    const { account_id, amount } = await request.json();

    if (!account_id || !amount || amount < 1) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.balance < amount) {
      return Response.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    const account = await SnapchatAccount.findOne({ _id: account_id, user_id: decoded.id });
    if (!account) {
      return Response.json({ message: 'Account not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(decoded.id, { $inc: { balance: -amount } });
    await SnapchatAccount.findByIdAndUpdate(account_id, { $inc: { balance: amount } });
    await SnapchatDepositRecord.create({
      user_id: decoded.id,
      account_id,
      account_name: account.account_name,
      amount,
      type: 'deposit',
      status: 'completed',
    });

    return Response.json({ message: 'Deposit successful', amount });

  } catch (error) {
    console.error('Error processing deposit:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
