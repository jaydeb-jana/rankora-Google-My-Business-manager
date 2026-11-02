import connectDB, { isFallbackStorage, fallbackStore } from './db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import ReviewActivity from '@/models/ReviewActivity';
import SystemSetting from '@/models/SystemSetting';

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
  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
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
    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (p - 1) * l;

    if (await isOffline()) {
      let all = fallbackStore.getCollection('users') || [];

      if (status && status !== 'all') {
        all = all.filter((u) => (u.status || 'active') === status);
      }
      if (plan && plan !== 'all') {
        all = all.filter((u) => (u.plan || 'free') === plan);
      }
      if (isVerified !== '' && isVerified !== 'all') {
        const v = String(isVerified) === 'true';
        all = all.filter((u) => Boolean(u.isVerified) === v);
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
        const { password, ...safe } = u;
        return {
          ...safe,
          role: safe.role || 'user',
          status: safe.status || 'active',
          plan: safe.plan || 'free',
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

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (plan && plan !== 'all') {
      filter.plan = plan;
    }
    if (isVerified !== '' && isVerified !== 'all') {
      filter.isVerified = String(isVerified) === 'true';
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
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .lean();

    return {
      users: toPlain(users).map((u) => ({
        ...u,
        role: u.role || 'user',
        status: u.status || 'active',
        plan: u.plan || 'free',
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

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: { $ne: 'suspended' } });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    const agg = await User.aggregate([
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
      free: await User.countDocuments({ $or: [{ plan: 'free' }, { plan: { $exists: false } }, { plan: null }] }),
      starter: await User.countDocuments({ plan: 'starter' }),
      pro: await User.countDocuments({ plan: 'pro' }),
      enterprise: await User.countDocuments({ plan: 'enterprise' }),
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
      }
      let acts = fallbackStore.getCollection('activities') || [];
      acts = acts.filter((a) => String(a.businessId) !== String(userId));
      fallbackStore.saveCollection('activities', acts);
      return true;
    }

    await User.findByIdAndDelete(userId);
    await ReviewActivity.deleteMany({ businessId: userId });
    return true;
  },
};

export const otpRepo = {
  async createOtp({ email, code, purpose, expiresAt }) {
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
      });
    }

    await Otp.updateMany({ email: cleanEmail, purpose, used: false }, { used: true });
    const created = await Otp.create({ email: cleanEmail, code, purpose, expiresAt, used: false });
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

    settings.general = {
      appName: settings.general?.appName || 'Rankaro',
      appUrl: settings.general?.appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      supportEmail: settings.general?.supportEmail || process.env.GMAIL_USER || '',
      allowPublicRegistration: settings.general?.allowPublicRegistration !== false,
    };

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
