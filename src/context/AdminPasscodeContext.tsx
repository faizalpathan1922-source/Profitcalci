import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  hashPasscode,
  generateSalt,
  isSessionValid,
  saveAdminSession,
  clearAdminSession,
  recordFailedAttempt,
  resetFailedAttempts,
  getLockoutStatus,
} from '../utils/security';

interface AdminPasscodeContextType {
  isAuthenticated: boolean;
  hasEnvSecret: boolean;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  authenticate: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePasscode: (newPasscode: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminPasscodeContext = createContext<AdminPasscodeContextType | undefined>(undefined);

// Storage key for user-configured hash fallback when no env secret is set
const LOCAL_ADMIN_HASH_KEY = 'profitcalci_admin_passcode_hash';
const LOCAL_ADMIN_SALT_KEY = 'profitcalci_admin_passcode_salt';

// Environment variables
const ENV_PASSCODE_HASH = (import.meta.env.VITE_ADMIN_PASSCODE_HASH || '').trim();
const ENV_SALT = (import.meta.env.VITE_ADMIN_SALT || '').trim();

export const AdminPasscodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionValid());
  const [lockoutState, setLockoutState] = useState(() => getLockoutStatus());

  // Periodically refresh lockout timer if locked
  useEffect(() => {
    if (!lockoutState.isLocked) return;

    const timer = setInterval(() => {
      const status = getLockoutStatus();
      setLockoutState(status);
      if (!status.isLocked) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutState.isLocked]);

  const hasEnvSecret = Boolean(ENV_PASSCODE_HASH);

  /**
   * Authenticates user passcode against environment-injected secret (or local salted hash)
   */
  const authenticate = async (passcode: string): Promise<{ success: boolean; error?: string }> => {
    const status = getLockoutStatus();
    if (status.isLocked) {
      setLockoutState(status);
      return {
        success: false,
        error: `Account is temporarily locked. Try again in ${Math.ceil(status.remainingSeconds / 60)} minutes.`,
      };
    }

    if (!passcode || passcode.trim().length === 0) {
      return { success: false, error: 'Please enter your admin passcode.' };
    }

    // 1. Environment-Injected Secret Verification
    if (hasEnvSecret) {
      const saltToUse = ENV_SALT || 'PROFITCALCI_STATIC_SALT';
      const computedHash = await hashPasscode(passcode, saltToUse);

      // Verify computed hash against environment secret
      if (computedHash.toLowerCase() === ENV_PASSCODE_HASH.toLowerCase()) {
        saveAdminSession(computedHash);
        setIsAuthenticated(true);
        resetFailedAttempts();
        setLockoutState({ isLocked: false, remainingSeconds: 0 });
        return { success: true };
      } else {
        const attempt = recordFailedAttempt();
        setLockoutState({ isLocked: attempt.isLockedNow, remainingSeconds: attempt.remainingSeconds });
        if (attempt.isLockedNow) {
          return {
            success: false,
            error: 'Maximum login attempts exceeded. Access locked for 15 minutes.',
          };
        }
        return { success: false, error: 'Invalid admin passcode. Access denied.' };
      }
    }

    // 2. Local Fallback Verification (Salted SHA-256 in local storage)
    const storedHash = localStorage.getItem(LOCAL_ADMIN_HASH_KEY);
    const storedSalt = localStorage.getItem(LOCAL_ADMIN_SALT_KEY);

    if (!storedHash || !storedSalt) {
      // First-time setup: establish new passcode
      if (passcode.length < 6) {
        return { success: false, error: 'Passcode must be at least 6 characters long.' };
      }

      const salt = generateSalt();
      const hash = await hashPasscode(passcode, salt);
      localStorage.setItem(LOCAL_ADMIN_HASH_KEY, hash);
      localStorage.setItem(LOCAL_ADMIN_SALT_KEY, salt);

      saveAdminSession(hash);
      setIsAuthenticated(true);
      resetFailedAttempts();
      setLockoutState({ isLocked: false, remainingSeconds: 0 });
      return { success: true };
    }

    // Verify against stored salted hash
    const computedHash = await hashPasscode(passcode, storedSalt);
    if (computedHash === storedHash) {
      saveAdminSession(computedHash);
      setIsAuthenticated(true);
      resetFailedAttempts();
      setLockoutState({ isLocked: false, remainingSeconds: 0 });
      return { success: true };
    } else {
      const attempt = recordFailedAttempt();
      setLockoutState({ isLocked: attempt.isLockedNow, remainingSeconds: attempt.remainingSeconds });
      if (attempt.isLockedNow) {
        return {
          success: false,
          error: 'Maximum login attempts exceeded. Access locked for 15 minutes.',
        };
      }
      return { success: false, error: 'Invalid admin passcode. Access denied.' };
    }
  };

  /**
   * Updates local passcode (only possible if not locked into an immutable env secret)
   */
  const updatePasscode = async (newPasscode: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Unauthorized: Session expired.' };
    }
    if (hasEnvSecret) {
      return {
        success: false,
        error: 'Passcode is locked to the VITE_ADMIN_PASSCODE_HASH environment secret. Update your deployment environment variable to change it.',
      };
    }
    if (newPasscode.length < 6) {
      return { success: false, error: 'Passcode must be at least 6 characters long.' };
    }

    const salt = generateSalt();
    const hash = await hashPasscode(newPasscode, salt);
    localStorage.setItem(LOCAL_ADMIN_HASH_KEY, hash);
    localStorage.setItem(LOCAL_ADMIN_SALT_KEY, salt);
    saveAdminSession(hash);
    return { success: true };
  };

  const logout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  return (
    <AdminPasscodeContext.Provider
      value={{
        isAuthenticated,
        hasEnvSecret,
        isLocked: lockoutState.isLocked,
        lockoutRemainingSeconds: lockoutState.remainingSeconds,
        authenticate,
        logout,
        updatePasscode,
      }}
    >
      {children}
    </AdminPasscodeContext.Provider>
  );
};

export const useAdminPasscode = () => {
  const context = useContext(AdminPasscodeContext);
  if (!context) {
    throw new Error('useAdminPasscode must be used within an AdminPasscodeProvider');
  }
  return context;
};
