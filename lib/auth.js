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
  // Strictly one single administrator in the entire platform
  return cleanEmail === 'ceo@arventventures.online';
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
 * Generates URL-safe business slug from business name
 */
export function generateSlug(businessName) {
  if (!businessName) return 'biz-' + Math.random().toString(36).substring(2, 7);
  const base = businessName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'biz-' + Math.random().toString(36).substring(2, 7);
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

    return safeUser;
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME, ADMIN_IMPERSONATE_COOKIE };
