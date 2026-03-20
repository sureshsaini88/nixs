import mongoose from 'mongoose';

const BmShareRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String },
  ads_account_id: { type: String, required: true },
  ads_account_name: { type: String },
  bm_id: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

BmShareRequestSchema.set('toJSON', {
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

export default mongoose.models.BmShareRequest || mongoose.model('BmShareRequest', BmShareRequestSchema);
