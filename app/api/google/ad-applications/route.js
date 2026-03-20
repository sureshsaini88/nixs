import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import GoogleAdApplication from '../../../../lib/models/GoogleAdApplication';

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
    const { adType, adNum, timezone, gmail, depositAmount, totalCost } = body;

    if (!adType || !adNum || !gmail || !depositAmount) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const application = await GoogleAdApplication.create({
      user_id: decoded.id,
      ad_type: adType,
      ad_num: adNum,
      timezone: timezone || 'UTC+00:00',
      gmail,
      deposit_amount: depositAmount,
      total_cost: totalCost || (adNum * depositAmount),
      status: 'pending',
    });

    return Response.json({ message: 'Google ad application submitted successfully', application });

  } catch (error) {
    console.error('Error creating Google ad application:', error);
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
    const applications = await GoogleAdApplication.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(applications);

  } catch (error) {
    console.error('Error fetching Google ad applications:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
