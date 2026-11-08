import connectDB, { isFallbackStorage, fallbackStore } from './db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import ReviewActivity from '@/models/ReviewActivity';
import SystemSetting from '@/models/SystemSetting';
import PaymentOrder from '@/models/PaymentOrder';

/**
 * Converts Mongoose/BSON documents (ObjectId, Date, etc.) into plain JSON objects
 * so they can be safely passed from Server Components to Client Components.
 */
function toPlain(doc) {
  if (doc === null || doc === undefined) return null;
  return JSON.parse(JSON.stringify(doc));
}

const AFTER = { returnDocument: 'after' };

async function isOffline() {
  const conn = await connectDB();
  return !conn || isFallbackStorage();
}

export const userRepo = {
  async ensureDefaultAdmin() {
    const adminEmails = ['ceo@arventaventures.online', 'ceo@arventventures.online'];
    const defaultPass = 'Jaydeb@123';

    try {
      if (await isOffline()) {
        for (const defaultEmail of adminEmails) {
          const existing = fallbackStore.findOne('users', { email: defaultEmail });
          if (!existing) {
            fallbackStore.create('users', {
              email: defaultEmail,
              password: defaultPass,
              businessName: 'Arvent Ventures',
              ownerName: 'Jaydeb Jana',
              phone: '+91 9876543210',
              slug: defaultEmail.includes('arventaventures') ? 'admin-master' : 'admin-console',
              isVerified: true,
              role: 'admin',
              status: 'active',
              plan: 'enterprise',
              planUpdatedAt: new Date().toISOString(),
              services: [],
              welcomeHeadline: '',
              instructions: '',
              googleReviewUrl: '',
              stats: { totalVisits: 0, draftsGenerated: 0, reviewsCopied: 0, googleClicks: 0 },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            console.log('[System] Default admin created in fallback storage:', defaultEmail);
          } else {
            fallbackStore.update('users', existing._id, { password: defaultPass, role: 'admin', isVerified: true, status: 'active' });
          }
        }
        return;
      }

      for (const defaultEmail of adminEmails) {
        const existing = await User.findOne({ email: defaultEmail });
        if (!existing) {
          await User.create({
            email: defaultEmail,
            password: defaultPass,
            businessName: 'Arvent Ventures',
            ownerName: 'Jaydeb Jana',
            phone: '+91 9876543210',
            slug: defaultEmail.includes('arventaventures') ? 'admin-master' : 'admin-console',
            isVerified: true,
            role: 'admin',
            status: 'active',
            plan: 'enterprise',
            planUpdatedAt: new Date(),
            services: [],
            welcomeHeadline: '',
            instructions: '',
            googleReviewUrl: '',
            stats: { totalVisits: 0, draftsGenerated: 0, reviewsCopied: 0, googleClicks: 0 },
          });
          console.log('[System] Default admin initialized in MongoDB:', defaultEmail);
        } else {
          await User.updateOne(
            { email: defaultEmail },
            {
              $set: {
                password: defaultPass,
                role: 'admin',
                isVerified: true,
                status: 'active',
                plan: 'enterprise',
                businessName: 'Arvent Ventures',
                ownerName: 'Jaydeb Jana',
              },
            }
          );
        }
      }

      // Ensure all other accounts are normal users
      await User.updateMany(
        { email: { $ne: defaultEmail }, role: 'admin' },
        { $set: { role: 'user' } }
      );
    } catch (err) {
      console.warn('[System] Warning initializing default admin:', err.message);
    }
  },

  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'ceo@arventventures.online') {
      await this.ensureDefaultAdmin();
    }
    if (await isOffline()) {
      return fallbackStore.findOne('users', { email: cleanEmail });
    }
    return toPlain(await User.findOne({ email: cleanEmail }).lean());
  },

  async findById(id) {
    if (!id) return null;
    if (await isOffline()) {
      return fallbackStore.findOne('users', { _id: String(id) });
    }
    if (!/^[0-9a-fA-F]{24}$/.test(String(id))) return null;
    return toPlain(await User.findById(id).lean());
  },

  async findBySlug(slug) {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase().trim();
    if (await isOffline()) {
      return fallbackStore.findOne('users', { slug: cleanSlug });
    }
    return toPlain(await User.findOne({ slug: cleanSlug }).lean());
  },

  async create(userData) {
    if (await isOffline()) {
      return fallbackStore.create('users', userData);
    }
    const created = await User.create(userData);
    return toPlain(created.toObject());
  },

  async updateById(id, updateData) {
    if (await isOffline()) {
      return fallbackStore.updateOne('users', { _id: String(id) }, updateData);
    }
    return toPlain(await User.findByIdAndUpdate(id, updateData, AFTER).lean());
  },

  async updateByEmail(email, updateData) {
    const cleanEmail = email.toLowerCase().trim();
    if (await isOffline()) {
      return fallbackStore.updateOne('users', { email: cleanEmail }, updateData);
    }
    return toPlain(await User.findOneAndUpdate({ email: cleanEmail }, updateData, AFTER).lean());
  },

  async incrementStats(idOrSlug, statKey) {
    if (await isOffline()) {
      const user =
        fallbackStore.findOne('users', { slug: idOrSlug }) ||
        fallbackStore.findOne('users', { _id: idOrSlug });
      if (user) {
        return fallbackStore.updateOne('users', { _id: user._id }, { $inc: { [`stats.${statKey}`]: 1 } });
      }
      return null;
    }
    const query = /^[0-9a-fA-F]{24}$/.test(String(idOrSlug)) ? { _id: idOrSlug } : { slug: idOrSlug };
    return toPlain(
      await User.findOneAndUpdate(query, { $inc: { [`stats.${statKey}`]: 1 } }, AFTER).lean()
    );
  },

  async findAll({ search = '', status = '', plan = '', isVerified = '', page = 1, limit = 50 } = {}) {
    await this.ensureDefaultAdmin();
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (p - 1) * l;

    if (await isOffline()) {
      let all = (fallbackStore.getCollection('users') || []).filter(
        (u) => u.role !== 'admin' && u.email !== 'ceo@arventventures.online'
      );

      if (status && status !== 'all') {
        all = all.filter((u) => (u.status || 'active') === status);
      }
      if (plan && plan !== 'all') {
        all = all.filter((u) => (u.plan || 'free') === plan);
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        all = all.filter(
          (u) =>
            (u.businessName && u.businessName.toLowerCase().includes(q)) ||
            (u.ownerName && u.ownerName.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.phone && u.phone.toLowerCase().includes(q)) ||
            (u.slug && u.slug.toLowerCase().includes(q))
        );
      }

      all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      const total = all.length;
      const paginated = all.slice(skip, skip + l).map((u) => {
        return {
          ...u,
          password: u.password || '',
          role: u.role || 'user',
          status: u.status || 'active',
          plan: u.plan || 'free',
          planUpdatedAt: u.planUpdatedAt || u.createdAt,
          planExpiresAt: u.planExpiresAt || null,
          profileScore: u.profileScore !== undefined ? u.profileScore : 94,
          totalReplies: u.totalReplies !== undefined ? u.totalReplies : 0,
          replyTime: u.replyTime || 'Under 2 Hours',
        };
      });

      return {
        users: paginated,
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l) || 1,
      };
    }

    // Exclude administrators from user management directory
    const filter = {
      role: { $ne: 'admin' },
      email: { $nin: ['ceo@arventventures.online', 'ceo@arventaventures.online'] },
    };

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (plan && plan !== 'all') {
      filter.plan = plan;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { businessName: { $regex: q, $options: 'i' } },
        { ownerName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();

    return {
      users: toPlain(users).map((u) => ({
        ...u,
        password: u.password || '',
        role: u.role || 'user',
        status: u.status || 'active',
        plan: u.plan || 'free',
        planUpdatedAt: u.planUpdatedAt || u.createdAt,
        planExpiresAt: u.planExpiresAt || null,
        profileScore: u.profileScore !== undefined ? u.profileScore : 94,
        totalReplies: u.totalReplies !== undefined ? u.totalReplies : 0,
        replyTime: u.replyTime || 'Under 2 Hours',
      })),
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l) || 1,
    };
  },

  async getStatsSummary() {
    if (await isOffline()) {
      const all = fallbackStore.getCollection('users') || [];
      const totalUsers = all.length;
      const activeUsers = all.filter((u) => (u.status || 'active') === 'active').length;
      const suspendedUsers = all.filter((u) => u.status === 'suspended').length;
      const verifiedUsers = all.filter((u) => Boolean(u.isVerified)).length;
      const totalVisits = all.reduce((sum, u) => sum + (u.stats?.totalVisits || 0), 0);
      const draftsGenerated = all.reduce((sum, u) => sum + (u.stats?.draftsGenerated || 0), 0);
      const reviewsCopied = all.reduce((sum, u) => sum + (u.stats?.reviewsCopied || 0), 0);
      const planCounts = {
        free: all.filter((u) => !u.plan || u.plan === 'free').length,
        starter: all.filter((u) => u.plan === 'starter').length,
        pro: all.filter((u) => u.plan === 'pro').length,
        enterprise: all.filter((u) => u.plan === 'enterprise').length,
      };

      return {
        totalUsers,
        activeUsers,
        suspendedUsers,
        verifiedUsers,
        totalVisits,
        draftsGenerated,
        reviewsCopied,
        planCounts,
      };
    }

    const clientBase = {
      role: { $ne: 'admin' },
      email: { $ne: 'ceo@arventventures.online' },
    };

    const totalUsers = await User.countDocuments(clientBase);
    const activeUsers = await User.countDocuments({ ...clientBase, status: { $ne: 'suspended' } });
    const suspendedUsers = await User.countDocuments({ ...clientBase, status: 'suspended' });
    const verifiedUsers = await User.countDocuments({ ...clientBase, isVerified: true });

    const agg = await User.aggregate([
      { $match: clientBase },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: '$stats.totalVisits' },
          draftsGenerated: { $sum: '$stats.draftsGenerated' },
          reviewsCopied: { $sum: '$stats.reviewsCopied' },
        },
      },
    ]);

    const statsAgg = agg[0] || { totalVisits: 0, draftsGenerated: 0, reviewsCopied: 0 };

    const planCounts = {
      starter: await User.countDocuments({
        ...clientBase,
        $or: [{ plan: 'starter' }, { plan: 'free' }, { plan: { $exists: false } }, { plan: null }],
      }),
      pro: await User.countDocuments({ ...clientBase, plan: 'pro' }),
      enterprise: await User.countDocuments({ ...clientBase, plan: 'enterprise' }),
    };

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      verifiedUsers,
      totalVisits: statsAgg.totalVisits || 0,
      draftsGenerated: statsAgg.draftsGenerated || 0,
      reviewsCopied: statsAgg.reviewsCopied || 0,
      planCounts,
    };
  },

  async deleteUserAndData(userId) {
    if (!userId) return false;
    if (await isOffline()) {
      const user = fallbackStore.findOne('users', { _id: String(userId) });
      fallbackStore.deleteOne('users', { _id: String(userId) });
      if (user?.email) {
        let otps = fallbackStore.getCollection('otps') || [];
        otps = otps.filter((o) => o.email !== user.email);
        fallbackStore.saveCollection('otps', otps);

        let orders = fallbackStore.getCollection('payment_orders') || [];
        orders = orders.filter(
          (o) => String(o.userId) !== String(userId) && o.customerEmail !== user.email
        );
        fallbackStore.saveCollection('payment_orders', orders);
      }
      let acts = fallbackStore.getCollection('activities') || [];
      acts = acts.filter(
        (a) => String(a.businessId) !== String(userId) && (user?.slug ? a.slug !== user.slug : true)
      );
      fallbackStore.saveCollection('activities', acts);
      return true;
    }

    const user = await User.findById(userId).lean();
    if (!user) return false;

    // 1. Delete all review activities by businessId or slug
    const actQuery = [{ businessId: userId }];
    if (user.slug) actQuery.push({ slug: user.slug });
    await ReviewActivity.deleteMany({ $or: actQuery }).catch(() => {});

    // 2. Delete all payment orders by userId or customerEmail
    const orderQuery = [{ userId }];
    if (user.email) orderQuery.push({ customerEmail: user.email.toLowerCase().trim() });
    await PaymentOrder.deleteMany({ $or: orderQuery }).catch(() => {});

    // 3. Delete all Otp entries for this user's email
    if (user.email) {
      await Otp.deleteMany({ email: user.email.toLowerCase().trim() }).catch(() => {});
    }

    // 4. If logoUrl was saved as a local server file in /uploads/, safely remove from disk
    if (user.logoUrl && user.logoUrl.startsWith('/uploads/')) {
      try {
        const path = await import('path');
        const fs = await import('fs/promises');
        const filePath = path.join(process.cwd(), 'public', user.logoUrl.replace(/^\//, ''));
        await fs.unlink(filePath).catch(() => {});
      } catch {
        // Ignore file system errors
      }
    }

    // 5. Delete the User record
    await User.findByIdAndDelete(userId);
    return true;
  },
};

export const otpRepo = {
  async createOtp({ email, code, purpose, expiresAt, registrationData = null }) {
    const cleanEmail = email.toLowerCase().trim();
    if (await isOffline()) {
      const existing = fallbackStore.find('otps', { email: cleanEmail, purpose, used: false });
      for (const item of existing) {
        fallbackStore.updateOne('otps', { _id: item._id }, { used: true });
      }
      return fallbackStore.create('otps', {
        email: cleanEmail,
        code,
        purpose,
        expiresAt: expiresAt.toISOString(),
        used: false,
        registrationData,
      });
    }

    await Otp.updateMany({ email: cleanEmail, purpose, used: false }, { used: true });
    const created = await Otp.create({
      email: cleanEmail,
      code,
      purpose,
      expiresAt,
      used: false,
      registrationData,
    });
    return toPlain(created.toObject());
  },

  async findValidOtp({ email, code, purpose }) {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date();

    if (await isOffline()) {
      const otps = fallbackStore.find('otps', { email: cleanEmail, purpose, used: false });
      return otps.find((o) => o.code === code && new Date(o.expiresAt) > now) || null;
    }

    return toPlain(
      await Otp.findOne({
        email: cleanEmail,
        code,
        purpose,
        used: false,
        expiresAt: { $gt: now },
      }).lean()
    );
  },

  async findLatestOtp(email, purpose) {
    const cleanEmail = email.toLowerCase().trim();
    const now = new Date();

    if (await isOffline()) {
      const otps = fallbackStore.find('otps', { email: cleanEmail, purpose, used: false });
      const sorted = otps.sort((a, b) => new Date(b.createdAt || b.expiresAt) - new Date(a.createdAt || a.expiresAt));
      return sorted[0] || null;
    }

    return toPlain(
      await Otp.findOne({
        email: cleanEmail,
        purpose,
        used: false,
        expiresAt: { $gt: now },
      })
        .sort({ createdAt: -1 })
        .lean()
    );
  },

  async markUsed(otpId) {
    if (await isOffline()) {
      return fallbackStore.updateOne('otps', { _id: String(otpId) }, { used: true });
    }
    return toPlain(await Otp.findByIdAndUpdate(otpId, { used: true }, AFTER).lean());
  },
};

export const activityRepo = {
  async recordActivity({ businessId, slug, type, servicesSelected = [], sentiment = '' }) {
    if (await isOffline()) {
      return fallbackStore.create('activities', {
        businessId: String(businessId || ''),
        slug,
        type,
        servicesSelected,
        sentiment,
        createdAt: new Date().toISOString(),
      });
    }

    const created = await ReviewActivity.create({
      businessId,
      slug,
      type,
      servicesSelected,
      sentiment,
    });
    return toPlain(created.toObject());
  },

  async getRecentByBusiness(businessId, limit = 20) {
    if (await isOffline()) {
      const all = fallbackStore.find('activities', { businessId: String(businessId) });
      return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
    }
    const rows = await ReviewActivity.find({ businessId }).sort({ createdAt: -1 }).limit(limit).lean();
    return toPlain(rows) || [];
  },
};

const DEFAULT_STARTER_FEATURES = [
  'Single Business Profile connection',
  'Standard QR Code Stand generation',
  'AI Review Drafts (Powered by Gemini)',
  'Basic review analytics & activity log',
  'Direct link to Google review box',
];

const DEFAULT_PRO_FEATURES = [
  'Everything in Starter, plus:',
  'Custom Branded QR Stands (Print Ready PDF)',
  'Unlimited AI Review Draft generations',
  'AI Knowledge Base customization with custom services',
  'WhatsApp instant inquiry desk priority',
  'Custom review landing page branding & colors',
  'Zero Google review link dropouts',
];

const DEFAULT_ENTERPRISE_FEATURES = [
  'Everything in Pro, plus:',
  'Multi-location dashboard (up to 10 locations)',
  'Dedicated Technical Account Manager at Arventa Ventures',
  'Custom REST API & Webhook integration',
  'Priority SLA support via direct WhatsApp & phone',
  'Automated monthly Google Business Profile local SEO audits',
  'Custom domain support for review pages',
];

export const settingsRepo = {
  async getSettings() {
    let settings = null;
    if (await isOffline()) {
      settings = fallbackStore.findOne('settings', { key: 'global_config' });
    } else {
      settings = toPlain(await SystemSetting.findOne({ key: 'global_config' }).lean());
    }

    if (!settings) {
      return {
        key: 'global_config',
        smtp: {
          provider: 'gmail',
          user: process.env.GMAIL_USER || '',
          pass: process.env.GMAIL_APP_PASSWORD || '',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          fromName: 'Rankaro',
        },
        ai: {
          provider: 'gemini',
          apiKey: process.env.GEMINI_API_KEY || '',
          model: 'gemini-1.5-flash',
        },
        general: {
          appName: 'Rankaro',
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          supportEmail: process.env.GMAIL_USER || '',
          allowPublicRegistration: true,
        },
        pricing: {
          currency: '₹',
          starter: { monthly: 0, yearly: 0 },
          pro: { monthly: 999, yearly: 849 },
          enterprise: { monthly: 2499, yearly: 1999 },
        },
        famgateway: {
          enabled: Boolean(process.env.FAMGATEWAY_API_KEY),
          apiKey: process.env.FAMGATEWAY_API_KEY || '',
        },
        notepad: [],
        adminNotes: '',
      };
    }

    // Default fallbacks for missing nested properties
    settings.smtp = {
      provider: settings.smtp?.provider || 'gmail',
      user: settings.smtp?.user || process.env.GMAIL_USER || '',
      pass: settings.smtp?.pass || process.env.GMAIL_APP_PASSWORD || '',
      host: settings.smtp?.host || 'smtp.gmail.com',
      port: Number(settings.smtp?.port) || 465,
      secure: settings.smtp?.secure !== false,
      fromName: settings.smtp?.fromName || 'Rankaro',
    };

    settings.ai = {
      provider: settings.ai?.provider || 'gemini',
      apiKey: settings.ai?.apiKey || process.env.GEMINI_API_KEY || '',
      model: settings.ai?.model || 'gemini-1.5-flash',
    };

    settings.famgateway = {
      enabled: settings.famgateway?.enabled ?? Boolean(settings.famgateway?.apiKey || process.env.FAMGATEWAY_API_KEY),
      apiKey: settings.famgateway?.apiKey || process.env.FAMGATEWAY_API_KEY || '',
    };

    settings.general = {
      appName: settings.general?.appName || 'Rankaro',
      appUrl: settings.general?.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      supportEmail: settings.general?.supportEmail || process.env.GMAIL_USER || '',
      allowPublicRegistration: settings.general?.allowPublicRegistration !== false,
    };

    settings.pricing = {
      currency: settings.pricing?.currency || '₹',
      starter: {
        monthly: Number(settings.pricing?.starter?.monthly) || 499,
        yearly: Number(settings.pricing?.starter?.yearly) || 399,
        features: Array.isArray(settings.pricing?.starter?.features) && settings.pricing.starter.features.length > 0
          ? settings.pricing.starter.features
          : DEFAULT_STARTER_FEATURES,
      },
      pro: {
        monthly: Number(settings.pricing?.pro?.monthly) || 999,
        yearly: Number(settings.pricing?.pro?.yearly) || 849,
        features: Array.isArray(settings.pricing?.pro?.features) && settings.pricing.pro.features.length > 0
          ? settings.pricing.pro.features
          : DEFAULT_PRO_FEATURES,
      },
      enterprise: {
        monthly: Number(settings.pricing?.enterprise?.monthly) || 2499,
        yearly: Number(settings.pricing?.enterprise?.yearly) || 1999,
        features: Array.isArray(settings.pricing?.enterprise?.features) && settings.pricing.enterprise.features.length > 0
          ? settings.pricing.enterprise.features
          : DEFAULT_ENTERPRISE_FEATURES,
      },
    };

    settings.notepad = Array.isArray(settings.notepad) ? settings.notepad : [];
    settings.adminNotes = typeof settings.adminNotes === 'string' ? settings.adminNotes : '';

    return settings;
  },

  async saveSettings(updates = {}) {
    if (await isOffline()) {
      const existing = fallbackStore.findOne('settings', { key: 'global_config' });
      if (existing) {
        return fallbackStore.updateOne('settings', { key: 'global_config' }, updates);
      }
      return fallbackStore.create('settings', { key: 'global_config', ...updates });
    }

    const updated = await SystemSetting.findOneAndUpdate(
      { key: 'global_config' },
      { $set: updates },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    // Mirror to fallback storage file for dual safety
    try {
      const existing = fallbackStore.findOne('settings', { key: 'global_config' });
      if (existing) {
        fallbackStore.updateOne('settings', { key: 'global_config' }, updates);
      } else {
        fallbackStore.create('settings', { key: 'global_config', ...updates });
      }
    } catch (err) {
      // ignore
    }

    return toPlain(updated);
  },
};

export const orderRepo = {
  async create(orderData) {
    if (await isOffline()) {
      return fallbackStore.create('orders', orderData);
    }
    const order = await PaymentOrder.create(orderData);
    return toPlain(order);
  },

  async findByOrderId(orderId) {
    if (!orderId) return null;
    if (await isOffline()) {
      return fallbackStore.findOne('orders', { orderId });
    }
    const order = await PaymentOrder.findOne({ orderId }).lean();
    return toPlain(order);
  },

  async findByUser(userId, limit = 20, userEmail = null) {
    if (!userId && !userEmail) return [];
    if (await isOffline()) {
      const all = fallbackStore.find('orders', {});
      return (all || [])
        .filter(
          (o) =>
            (userId && String(o.userId) === String(userId)) ||
            (userEmail && o.userEmail?.toLowerCase() === String(userEmail).toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    }
    const orConditions = [];
    if (userId) {
      orConditions.push({ userId });
      orConditions.push({ userId: String(userId) });
    }
    if (userEmail) {
      orConditions.push({ userEmail: String(userEmail).toLowerCase().trim() });
    }
    const filter = orConditions.length > 0 ? { $or: orConditions } : {};
    const orders = await PaymentOrder.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    return toPlain(orders) || [];
  },

  async updateByOrderId(orderId, updates = {}) {
    if (!orderId) return null;
    if (await isOffline()) {
      return fallbackStore.updateOne('orders', { orderId }, updates);
    }
    const updated = await PaymentOrder.findOneAndUpdate(
      { orderId },
      { $set: updates },
      { new: true }
    ).lean();
    return toPlain(updated);
  },

  async markSuccess({ orderId, utr, transactionId, senderName, amount, paidAt }) {
    const existing = await this.findByOrderId(orderId);
    if (!existing) return null;

    if (existing.status === 'success') {
      return existing;
    }

    const updates = {
      status: 'success',
      utr: utr || existing.utr || '',
      transactionId: transactionId || existing.transactionId || '',
      senderName: senderName || existing.senderName || '',
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      receiptUrl: `https://famgateway.in/transaction-details.php?id=${orderId}&download=pdf`,
    };

    if (amount) {
      updates.payableAmount = Number(amount);
    }

    const updatedOrder = await this.updateByOrderId(orderId, updates);

    // Atomically upgrade or renew the user's plan by id and email with expiration
    if (existing.planId) {
      const cycleDays = existing.billingCycle === 'yearly' ? 365 : 30;
      const nowMs = Date.now();
      let targetUser = null;

      try {
        if (existing.userId) {
          targetUser = await userRepo.findById(existing.userId);
        }
        if (!targetUser && existing.userEmail) {
          targetUser = await userRepo.findByEmail(existing.userEmail);
        }
      } catch (findErr) {
        console.warn('[orderRepo] targetUser lookup warning:', findErr?.message);
      }

      // If user is renewing the SAME plan and has active validity remaining, extend from current expiry.
      // Otherwise (new plan, tier upgrade, or expired plan), start fresh from now.
      let planExpiresAt;
      if (
        targetUser &&
        targetUser.plan === existing.planId &&
        targetUser.planExpiresAt &&
        new Date(targetUser.planExpiresAt).getTime() > nowMs
      ) {
        planExpiresAt = new Date(new Date(targetUser.planExpiresAt).getTime() + cycleDays * 24 * 60 * 60 * 1000);
      } else {
        planExpiresAt = new Date(nowMs + cycleDays * 24 * 60 * 60 * 1000);
      }

      if (existing.userId) {
        try {
          await userRepo.updateById(existing.userId, {
            plan: existing.planId,
            planUpdatedAt: new Date(),
            planExpiresAt,
          });
        } catch (err) {
          console.warn('[orderRepo] updateById error:', err?.message);
        }
      }
      if (existing.userEmail) {
        try {
          await userRepo.updateByEmail(existing.userEmail, {
            plan: existing.planId,
            planUpdatedAt: new Date(),
            planExpiresAt,
          });
        } catch (err) {
          console.warn('[orderRepo] updateByEmail error:', err?.message);
        }
      }

      // Expire any prior pending orders for this user to keep a single clean active state
      if (existing.userId || existing.userEmail) {
        try {
          if (await isOffline()) {
            const allOrders = fallbackStore.getCollection('orders') || [];
            allOrders.forEach((o) => {
              const matchesUser =
                (existing.userId && String(o.userId) === String(existing.userId)) ||
                (existing.userEmail && o.userEmail?.toLowerCase() === existing.userEmail?.toLowerCase());
              if (o.orderId !== orderId && o.status === 'pending' && matchesUser) {
                fallbackStore.updateOne('orders', { _id: o._id }, { status: 'expired' });
              }
            });
          } else {
            const filter = {
              orderId: { $ne: orderId },
              status: 'pending',
            };
            const orConditions = [];
            if (existing.userId) {
              orConditions.push({ userId: existing.userId });
              orConditions.push({ userId: String(existing.userId) });
            }
            if (existing.userEmail) {
              orConditions.push({ userEmail: existing.userEmail.toLowerCase().trim() });
            }
            if (orConditions.length > 0) {
              filter.$or = orConditions;
            }
            await PaymentOrder.updateMany(filter, { $set: { status: 'expired' } });
          }
        } catch (expireErr) {
          console.warn('[orderRepo] expiring pending orders warning:', expireErr?.message);
        }
      }
    }

    return updatedOrder || { ...existing, ...updates };
  },
};

export const systemRepo = settingsRepo;
