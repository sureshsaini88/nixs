import mongoose from 'mongoose';

const UserAdsAccountSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  license: { type: String },
  ads_account_id: { type: String },
  ads_account_name: { type: String },
  ad_type: { type: String },
  operate: { type: String },
  platform: { type: String, default: 'facebook' },
}, { timestamps: true });

UserAdsAccountSchema.set('toJSON', {
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

export default mongoose.models.UserAdsAccount || mongoose.model('UserAdsAccount', UserAdsAccountSchema);
