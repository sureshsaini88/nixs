import mongoose from 'mongoose';

const TiktokAdApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, default: 'tiktok' },
  ad_num: { type: Number, required: true },
  ad_name: { type: String, required: true },
  timezone: { type: String },
  business_category: { type: String },
  deposit_amount: { type: Number, required: true },
  has_domain: { type: Boolean, default: false },
  unlimited_domain: { type: Boolean, default: false },
  domain: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

TiktokAdApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.TiktokAdApplication || mongoose.model('TiktokAdApplication', TiktokAdApplicationSchema);
