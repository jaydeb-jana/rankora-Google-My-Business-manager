import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { userRepo } from './repositories';

const JWT_SECRET = process.env.JWT_SECRET || 'rankaro-secret-key-fallback-32-chars-long';
const COOKIE_NAME = 'rankaro_session';
const ADMIN_IMPERSONATE_COOKIE = 'rankaro_admin_impersonator';

export function isAdmin(user) {
  if (!user || !user.email) return false;
  const cleanEmail = user.email.toLowerCase().trim();
  const envAdminEmails = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return (
    user.role === 'admin' ||
    cleanEmail === 'ceo@arventventures.online' ||
    cleanEmail === 'ceo@arventaventures.online' ||
    envAdminEmails.includes(cleanEmail)
  );
}

export async function hashPassword(plainTextPassword) {
  // Passwords are stored in plain text without encryption as requested
  return String(plainTextPassword ?? '');
}

export async function verifyPassword(plainTextPassword, storedPassword) {
  if (!plainTextPassword || !storedPassword) return false;
  // If stored password in DB is a legacy bcrypt hash, compare via bcrypt for backward compatibility
  if (
    typeof storedPassword === 'string' &&
    (storedPassword.startsWith('$2a$') ||
      storedPassword.startsWith('$2b$') ||
      storedPassword.startsWith('$2y$'))
  ) {
    try {
      const isMatch = await bcrypt.compare(plainTextPassword, storedPassword);
      if (isMatch) return true;
    } catch {
      // fallback
    }
  }
  return String(plainTextPassword) === String(storedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Generates URL-safe business slug from business name:
 * 1. Convert all capital letters to lowercase
 * 2. Remove all symbols and special characters
 * 3. Convert spaces/dashes to single hyphen
 */
export function generateSlug(businessName) {
  if (!businessName || typeof businessName !== 'string') {
    return 'biz-' + Math.floor(100 + Math.random() * 900);
  }
  const clean = businessName
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters and digits, strip all symbols
    .replace(/[\s_-]+/g, '-')          // Replace spaces/underscores with single '-'
    .replace(/^-+|-+$/g, '');          // Strip leading/trailing hyphens

  return clean || 'biz-' + Math.floor(100 + Math.random() * 900);
}

/**
 * Ensures a slug is completely unique in the database.
 * If the slug is already taken, appends a random number (e.g. -123 or -459).
 */
export async function getUniqueSlug(businessName, excludeUserId = null) {
  const baseSlug = generateSlug(businessName);
  let candidate = baseSlug;

  let existing = await userRepo.findBySlug(candidate);
  if (!existing || (excludeUserId && existing._id?.toString() === excludeUserId.toString())) {
    return candidate;
  }

  // If already taken by someone else, append a random number until unique
  while (existing && (!excludeUserId || existing._id?.toString() !== excludeUserId.toString())) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    candidate = `${baseSlug}-${randomSuffix}`;
    existing = await userRepo.findBySlug(candidate);
  }

  return candidate;
}

/**
 * Retrieves the currently authenticated user from httpOnly session cookie
 */
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore?.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const user = await userRepo.findById(decoded.userId);
    if (!user) return null;

    // Remove sensitive fields
    const { password, ...safeUser } = user;

    const impersonatorCookie = cookieStore?.get(ADMIN_IMPERSONATE_COOKIE)?.value;
    safeUser.isImpersonated = Boolean(impersonatorCookie);
    safeUser.isAdmin = isAdmin(safeUser);

    // Compute subscription status
    const nowMs = Date.now();
    const isPlanExpired =
      !safeUser.isAdmin &&
      safeUser.plan !== 'free' &&
      safeUser.planExpiresAt &&
      new Date(safeUser.planExpiresAt).getTime() <= nowMs;
    safeUser.isPlanExpired = Boolean(isPlanExpired);

    return safeUser;
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME, ADMIN_IMPERSONATE_COOKIE };
