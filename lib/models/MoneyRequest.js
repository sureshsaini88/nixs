import mongoose from 'mongoose';

const MoneyRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payway: { type: String },
  charge_amount: { type: Number },
  transaction_id: { type: String },
  internal_note: { type: String },
  screenshot_url: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

MoneyRequestSchema.set('toJSON', {
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

export default mongoose.models.MoneyRequest || mongoose.model('MoneyRequest', MoneyRequestSchema);
