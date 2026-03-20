import connectDB from '../../../lib/mongodb';
import Admin from '../../../lib/models/Admin';
import WalletSetting from '../../../lib/models/WalletSetting';

export async function GET(request) {
  try {
    await connectDB();

    // Seed default admin
    await Admin.findOneAndUpdate(
      { username: 'nixs_adyvibe.in' },
      { username: 'nixs_adyvibe.in', password: 'nixs@2026' },
      { upsert: true }
    );

    // Seed default wallet settings
    const defaultWallets = [
      { coin_type: 'USDT', wallet_address: '0x1234567890abcdef1234567890abcdef12345678' },
      { coin_type: 'BTC', wallet_address: 'bc1q1234567890abcdef1234567890abcdef1234' },
      { coin_type: 'ETH', wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12' },
    ];

    for (const wallet of defaultWallets) {
      await WalletSetting.findOneAndUpdate(
        { coin_type: wallet.coin_type },
        wallet,
        { upsert: true }
      );
    }

    return Response.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return Response.json({ message: 'Failed to initialize database', error: error.message }, { status: 500 });
  }
}
