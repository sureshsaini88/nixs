import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import TiktokAdApplication from '../../../../lib/models/TiktokAdApplication';
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
    if (!decoded) {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const applications = await TiktokAdApplication.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(applications);

  } catch (error) {
    console.error('Error fetching TikTok ad applications:', error);
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

    const body = await request.json();
    const { ad_num, ad_name, timezone, business_category, deposit_amount, has_domain, unlimited_domain, domain } = body;

    if (!ad_num || !ad_name || !timezone || !business_category || !deposit_amount) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.balance < deposit_amount) {
      return Response.json({
        message: `Insufficient balance. You need $${deposit_amount} but have $${user.balance}. Please add money first.`
      }, { status: 400 });
    }

    const application = await TiktokAdApplication.create({
      user_id: decoded.id,
      ad_num,
      ad_name,
      timezone,
      business_category,
      deposit_amount,
      has_domain,
      unlimited_domain,
      domain,
      status: 'pending',
    });

    return Response.json({ message: 'Application submitted successfully', application });

  } catch (error) {
    console.error('Error creating TikTok ad application:', error);
    return Response.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
