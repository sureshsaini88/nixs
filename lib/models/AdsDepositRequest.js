import mongoose from 'mongoose';

const AdsDepositRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ads_account_id: { type: String },
  ads_account_name: { type: String },
  deposit_amount: { type: Number },
  cost_amount: { type: Number },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

AdsDepositRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.AdsDepositRequest || mongoose.model('AdsDepositRequest', AdsDepositRequestSchema);
