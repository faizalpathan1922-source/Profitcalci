/**
 * Security & Cryptographic Helper for Local-First Admin
 * 
 * Complies with strict security constraints:
 * - Passcodes are NEVER stored in plain text.
 * - Uses Web Crypto API (SubtleCrypto SHA-256) with a cryptographic salt.
 * - Rate limits attempts (locks for 15 minutes after 5 consecutive failures).
 * - Session token expires after 4 hours of inactivity.
 */

const STORAGE_SESSION_KEY = 'profitcalci_admin_session';
const STORAGE_ATTEMPTS_KEY = 'profitcalci_admin_auth_attempts';

interface AuthAttemptsRecord {
  count: number;
  lockedUntil: number | null;
}

/**
 * Generate random cryptographic salt
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash string with SHA-256 and salt
 */
export async function hashPasscode(passcode: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${passcode}:::${salt}:::PROFITCALCI_APP_SECURE_TOKEN`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if brute-force lockout is active
 */
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };

    const record: AuthAttemptsRecord = JSON.parse(raw);
    if (record.lockedUntil && record.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil((record.lockedUntil - Date.now()) / 1000);
      return { isLocked: true, remainingSeconds };
    }

    if (record.lockedUntil && record.lockedUntil <= Date.now()) {
      localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
    }
  } catch {
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  }

  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(): { isLockedNow: boolean; remainingSeconds: number } {
  let record: AuthAttemptsRecord = { count: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (raw) record = JSON.parse(raw);
  } catch {}

  record.count += 1;

  if (record.count >= 5) {
    // Lock for 15 minutes
    const lockoutMs = 15 * 60 * 1000;
    record.lockedUntil = Date.now() + lockoutMs;
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(record));
    return { isLockedNow: true, remainingSeconds: 900 };
  }

  localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(record));
  return { isLockedNow: false, remainingSeconds: 0 };
}

/**
 * Reset failed attempts on success
 */
export function resetFailedAttempts(): void {
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
}

/**
 * Save authenticated admin session
 */
export function saveAdminSession(token: string): void {
  const sessionData = {
    token,
    expiry: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
  };
  sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
}

/**
 * Verify active admin session
 */
export function isSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.expiry || session.expiry < Date.now()) {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      return false;
    }
    return Boolean(session.token);
  } catch {
    return false;
  }
}

/**
 * Clear session
 */
export function clearAdminSession(): void {
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}
