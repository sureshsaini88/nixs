import mongoose from 'mongoose';

const SnapchatDepositRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SnapchatAccount' },
  account_name: { type: String },
  amount: { type: Number, required: true },
  type: { type: String, default: 'deposit' },
  status: { type: String, default: 'completed' },
}, { timestamps: true });

SnapchatDepositRecordSchema.set('toJSON', {
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

export default mongoose.models.SnapchatDepositRecord || mongoose.model('SnapchatDepositRecord', SnapchatDepositRecordSchema);
