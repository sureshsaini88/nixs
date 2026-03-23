import jwt from 'jsonwebtoken';
import connectDB from '../../../../lib/mongodb';
import Admin from '../../../../lib/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Master password always works
    if (username === 'admin' && password === 'nixs@2026') {
      const token = jwt.sign(
        { id: 'admin', username: 'admin', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      const cookie = `userToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`;
      return Response.json({
        message: 'Login successful',
        token,
        admin: { id: 'admin', username: 'admin' }
      }, { headers: { 'Set-Cookie': cookie } });
    }

    await connectDB();

    // If username is 'admin' but password isn't the master, check the SkyrocketAgency DB record
    // (admin may have set a custom password via Change Password)
    const lookupUsername = username === 'admin' ? 'SkyrocketAgency' : username;
    const admin = await Admin.findOne({ username: lookupUsername });

    if (!admin) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (admin.password && password !== admin.password) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    const cookie = `userToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`;

    return Response.json({
      message: 'Login successful',
      token,
      admin: { id: admin._id.toString(), username: admin.username }
    }, { headers: { 'Set-Cookie': cookie } });

  } catch (error) {
    console.error('Admin login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
