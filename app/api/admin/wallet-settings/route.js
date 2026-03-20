import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import WalletSetting from '../../../../lib/models/WalletSetting';

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
    const wallets = await WalletSetting.find().sort({ coin_type: 1 });

    return Response.json(wallets);

  } catch (error) {
    console.error('Error fetching wallet settings:', error);
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

    const { coin_type, wallet_address } = await request.json();

    if (!coin_type || !wallet_address) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const qr_code_url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(wallet_address)}`;

    await connectDB();
    const wallet = await WalletSetting.findOneAndUpdate(
      { coin_type: coin_type.toUpperCase() },
      { wallet_address, qr_code_url, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return Response.json({ message: 'Wallet settings updated', wallet });

  } catch (error) {
    console.error('Error updating wallet settings:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
