import mongoose from 'mongoose';

const AdApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business_model: { type: String },
  license_name: { type: String },
  page_num: { type: Number },
  page_urls: { type: Array },
  domain_num: { type: Number },
  domains: { type: Array },
  ad_num: { type: Number },
  ad_accounts: { type: Array },
  total_cost: { type: Number, default: 0 },
  remarks: { type: String },
  need_unlimited_domain: { type: Boolean, default: false },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

AdApplicationSchema.set('toJSON', {
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

export default mongoose.models.AdApplication || mongoose.model('AdApplication', AdApplicationSchema);
