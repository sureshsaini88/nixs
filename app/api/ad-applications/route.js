import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import AdApplication from '../../../lib/models/AdApplication';

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
      businessModel, licenseName, pageNum, pageUrls,
      domainNum, domains, adNum, adAccounts, remarks, needUnlimitedDomain
    } = body;

    let totalCost = 0;
    if (adAccounts && Array.isArray(adAccounts)) {
      totalCost = adAccounts.reduce((sum, account) => sum + (parseFloat(account.deposit) || 0), 0);
    }

    await connectDB();
    const application = await AdApplication.create({
      user_id: decoded.id,
      business_model: businessModel,
      license_name: licenseName,
      page_num: pageNum,
      page_urls: pageUrls,
      domain_num: domainNum,
      domains,
      ad_num: adNum,
      ad_accounts: adAccounts,
      total_cost: totalCost,
      remarks,
      need_unlimited_domain: needUnlimitedDomain,
      status: 'pending',
    });

    return Response.json({ message: 'Application submitted successfully', application });

  } catch (error) {
    console.error('Error creating ad application:', error);
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
    const applications = await AdApplication.find({ user_id: decoded.id }).sort({ createdAt: -1 });

    return Response.json(applications);

  } catch (error) {
    console.error('Error fetching ad applications:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
