import connectDB from '../../../lib/mongodb';
import WalletSetting from '../../../lib/models/WalletSetting';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const coinType = url.searchParams.get('coin');

    await connectDB();

    if (coinType) {
      const wallet = await WalletSetting.findOne({ coin_type: coinType.toUpperCase() });
      if (!wallet) {
        return Response.json({ message: 'Wallet not found' }, { status: 404 });
      }
      return Response.json(wallet);
    } else {
      const wallets = await WalletSetting.find().sort({ coin_type: 1 });
      return Response.json(wallets);
    }

  } catch (error) {
    console.error('Error fetching wallet settings:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
