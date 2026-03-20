import mongoose from 'mongoose';

const SnapchatAccountSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SnapchatAdApplication' },
  account_name: { type: String },
  email: { type: String },
  timezone: { type: String },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
}, { timestamps: true });

SnapchatAccountSchema.set('toJSON', {
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

export default mongoose.models.SnapchatAccount || mongoose.model('SnapchatAccount', SnapchatAccountSchema);
