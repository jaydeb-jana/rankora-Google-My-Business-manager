import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['VERIFY_EMAIL', 'RESET_PASSWORD'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    registrationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 900, // MongoDB automatically deletes after 15 minutes
    },
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
