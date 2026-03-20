import mongoose from 'mongoose';

const SnapchatAdApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, default: 'snapchat' },
  ad_num: { type: Number, required: true },
  gmail: { type: String, required: true },
  timezone: { type: String },
  deposit_amount: { type: Number, required: true },
  public_profile_name: { type: String },
  public_profile_id: { type: String },
  has_domain: { type: Boolean, default: false },
  unlimited_domain: { type: Boolean, default: false },
  domain: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

SnapchatAdApplicationSchema.set('toJSON', {
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

export default mongoose.models.SnapchatAdApplication || mongoose.model('SnapchatAdApplication', SnapchatAdApplicationSchema);
