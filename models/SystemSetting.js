import mongoose from 'mongoose';

const SystemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_config',
    },
    smtp: {
      provider: { type: String, default: 'gmail' },
      user: { type: String, default: '' },
      pass: { type: String, default: '' },
      host: { type: String, default: 'smtp.gmail.com' },
      port: { type: Number, default: 465 },
      secure: { type: Boolean, default: true },
      fromName: { type: String, default: 'Rankaro' },
    },
    ai: {
      provider: { type: String, default: 'gemini' },
      apiKey: { type: String, default: '' },
      model: { type: String, default: 'gemini-1.5-flash' },
    },
    general: {
      appName: { type: String, default: 'Rankaro' },
      appUrl: { type: String, default: 'http://localhost:3000' },
      supportEmail: { type: String, default: '' },
      allowPublicRegistration: { type: Boolean, default: true },
    },
    pricing: {
      currency: { type: String, default: '₹' },
      starter: {
        monthly: { type: Number, default: 499 },
        yearly: { type: Number, default: 399 },
        features: {
          type: [String],
          default: [
            'Single Business Profile connection',
            'Standard QR Code Stand generation',
            'AI Review Drafts (Powered by Gemini)',
            'Basic review analytics & activity log',
            'Direct link to Google review box',
          ],
        },
      },
      pro: {
        monthly: { type: Number, default: 999 },
        yearly: { type: Number, default: 849 },
        features: {
          type: [String],
          default: [
            'Everything in Starter, plus:',
            'Custom Branded QR Stands (Print Ready PDF)',
            'Unlimited AI Review Draft generations',
            'AI Knowledge Base customization with custom services',
            'WhatsApp instant inquiry desk priority',
            'Custom review landing page branding & colors',
            'Zero Google review link dropouts',
          ],
        },
      },
      enterprise: {
        monthly: { type: Number, default: 2499 },
        yearly: { type: Number, default: 1999 },
        features: {
          type: [String],
          default: [
            'Everything in Pro, plus:',
            'Multi-location dashboard (up to 10 locations)',
            'Dedicated Technical Account Manager at Arventa Ventures',
            'Custom REST API & Webhook integration',
            'Priority SLA support via direct WhatsApp & phone',
            'Automated monthly Google Business Profile local SEO audits',
            'Custom domain support for review pages',
          ],
        },
      },
    },
    famgateway: {
      enabled: { type: Boolean, default: false },
      apiKey: { type: String, default: '', trim: true },
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.SystemSetting) {
  delete mongoose.models.SystemSetting;
}
if (mongoose.modelSchemas && mongoose.modelSchemas.SystemSetting) {
  delete mongoose.modelSchemas.SystemSetting;
}

export default mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);
