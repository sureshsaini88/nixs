import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../lib/models/Admin';

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
    if (!decoded || decoded.role !== 'admin') {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json({ message: 'Current and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ message: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Allow master password change
    if (currentPassword === 'nixs@2026') {
      await connectDB();
      await Admin.findOneAndUpdate(
        { username: 'SkyrocketAgency' },
        { password: newPassword },
        { upsert: true }
      );
      return Response.json({ message: 'Password changed successfully' });
    }

    await connectDB();
    const admin = await Admin.findOne({ username: decoded.username });

    if (!admin || admin.password !== currentPassword) {
      return Response.json({ message: 'Current password is incorrect' }, { status: 400 });
    }

    admin.password = newPassword;
    await admin.save();

    return Response.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
