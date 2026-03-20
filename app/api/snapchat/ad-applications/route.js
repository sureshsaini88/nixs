import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import SnapchatAdApplication from '../../../../lib/models/SnapchatAdApplication';
import User from '../../../../lib/models/User';

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

    const body = await request.json();
    const {
      platform, ad_num, gmail, timezone, deposit_amount,
      public_profile_name, public_profile_id, has_domain, unlimited_domain, domain
    } = body;

    if (!ad_num || !gmail || !timezone || !deposit_amount) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.balance < deposit_amount) {
      return Response.json({ message: 'Insufficient balance' }, { status: 400 });
    }

    const application = await SnapchatAdApplication.create({
      user_id: decoded.id,
      platform: platform || 'snapchat',
      ad_num,
      gmail,
      timezone,
      deposit_amount,
      public_profile_name: public_profile_name || null,
      public_profile_id: public_profile_id || null,
      has_domain: has_domain || false,
      unlimited_domain: unlimited_domain || false,
      domain: domain || null,
      status: 'pending',
    });

    return Response.json({ message: 'Snapchat ad application submitted successfully', application });

  } catch (error) {
    console.error('Error creating Snapchat ad application:', error);
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
    const applications = await SnapchatAdApplication.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(applications);

  } catch (error) {
    console.error('Error fetching Snapchat ad applications:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
