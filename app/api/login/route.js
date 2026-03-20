import jwt from 'jsonwebtoken';
import connectDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import { comparePassword } from '../../../lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    await connectDB();
    const user = await User.findOne({ username });

    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, role: 'user' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const cookie = `userToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`;

    return Response.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        balance: user.balance
      }
    }, {
      headers: { 'Set-Cookie': cookie }
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
