import mongoose from 'mongoose';

const PaymentOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    businessName: {
      type: String,
      default: '',
    },
    planId: {
      type: String,
      required: true,
      enum: ['starter', 'pro', 'enterprise'],
    },
    planName: {
      type: String,
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amount: {
      type: Number,
      required: true,
    },
    payableAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    upiId: {
      type: String,
      default: '',
    },
    qrUrl: {
      type: String,
      default: '',
    },
    checkoutUrl: {
      type: String,
      default: '',
    },
    upiIntent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'expired', 'failed'],
      default: 'pending',
      index: true,
    },
    utr: {
      type: String,
      default: '',
    },
    transactionId: {
      type: String,
      default: '',
    },
    senderName: {
      type: String,
      default: '',
    },
    receiptUrl: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.PaymentOrder) {
  delete mongoose.models.PaymentOrder;
}
if (mongoose.modelSchemas && mongoose.modelSchemas.PaymentOrder) {
  delete mongoose.modelSchemas.PaymentOrder;
}

export default mongoose.models.PaymentOrder || mongoose.model('PaymentOrder', PaymentOrderSchema);
