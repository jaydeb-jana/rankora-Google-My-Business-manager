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
