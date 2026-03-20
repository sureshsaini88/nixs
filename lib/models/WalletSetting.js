import mongoose from 'mongoose';

const WalletSettingSchema = new mongoose.Schema({
  coin_type: { type: String, unique: true, required: true },
  wallet_address: { type: String, required: true },
  qr_code_url: { type: String },
}, { timestamps: true });

WalletSettingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.WalletSetting || mongoose.model('WalletSetting', WalletSettingSchema);
