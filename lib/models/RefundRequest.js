import mongoose from 'mongoose';

const RefundRequestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refund_amount: { type: Number },
  reason: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

RefundRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.RefundRequest || mongoose.model('RefundRequest', RefundRequestSchema);
