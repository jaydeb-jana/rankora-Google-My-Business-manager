import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  suggestedKeywords: { type: [String], default: [] },
  isDefault: { type: Boolean, default: false },
});

const CustomQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
});

const AiLanguageSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    ratio: { type: Number, default: 100 },
  },
  { _id: false }
);

const AiKnowledgeSchema = new mongoose.Schema(
  {
    shopDetails: { type: String, default: '' },
    reviewStyleRules: { type: String, default: '' },
    languages: {
      type: [AiLanguageSchema],
      default: [{ code: 'en', name: 'English', ratio: 100 }],
    },
    geminiApiKey: { type: String, default: '', trim: true },
    geminiModel: { type: String, default: 'gemini-3.5-flash' },
    isKeyVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    suspensionReason: {
      type: String,
      default: '',
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'starter', 'pro', 'enterprise'],
      default: 'free',
    },
    planUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    googleReviewUrl: {
      type: String,
      default: '',
      trim: true,
    },
    businessCategory: {
      type: String,
      default: 'Professional Services',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    welcomeHeadline: {
      type: String,
      default: 'How was your experience with us?',
    },
    instructions: {
      type: String,
      default: 'Select what we helped you with today. We will help you draft an authentic review you can easily copy and post on Google.',
    },
    services: {
      type: [ServiceSchema],
      default: [],
    },
    customQuestions: {
      type: [CustomQuestionSchema],
      default: [],
    },
    aiKnowledge: {
      type: AiKnowledgeSchema,
      default: () => ({
        shopDetails: '',
        reviewStyleRules: '',
        languages: [{ code: 'en', name: 'English', ratio: 100 }],
      }),
    },
    stats: {
      totalVisits: { type: Number, default: 0 },
      draftsGenerated: { type: Number, default: 0 },
      reviewsCopied: { type: Number, default: 0 },
      googleClicks: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Ensure schema changes (like logoUrl, aiKnowledge) are always refreshed
if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}
if (mongoose.modelSchemas && mongoose.modelSchemas.User) {
  delete mongoose.modelSchemas.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
