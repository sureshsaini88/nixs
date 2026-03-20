import mongoose from 'mongoose';

const GoogleAdApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ad_type: { type: String },
  ad_num: { type: Number },
  timezone: { type: String },
  gmail: { type: String },
  deposit_amount: { type: Number },
  total_cost: { type: Number },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

GoogleAdApplicationSchema.set('toJSON', {
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

export default mongoose.models.GoogleAdApplication || mongoose.model('GoogleAdApplication', GoogleAdApplicationSchema);
