import React, { createContext, useContext, useState, useEffect } from 'react';
import { TOOLS_LIST } from '../data/toolsData';
import { FAQS_DATA } from '../data/faqData';
import { ToolItem, ToolCategory } from '../types';
import {
  AdminConfiguration,
  ManagedCalculator,
  EditablePageContent,
  EditableSeoItem,
} from '../types/admin';
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

const STORAGE_ADMIN_CONFIG_KEY = 'profitcalci_admin_config_v1';
const CONFIG_VERSION = 1;

/**
 * Builds default initial admin config seeded safely from existing website data
 */
export function buildDefaultConfig(): AdminConfiguration {
  const initialTools: ManagedCalculator[] = TOOLS_LIST.map((tool) => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    shortName: tool.shortName || tool.name,
    category: tool.category,
    description: tool.description,
    badge: tool.badge,
    iconName: tool.iconName,
    tags: [...tool.tags],
    isPopular: tool.isPopular,
    isFeatured: tool.isFeatured,
    published: true,
    isCustomCreated: false,
  }));

  const initialContent: EditablePageContent = {
    homepage: {
      heroBadge: '🇮🇳 India’s #1 Seller Toolkit • 100% Free Forever',
      heroHeading: 'Calculate Profits, Taxes & Invoices with Certainty',
      heroSubheading:
        'Free, private, and localized business calculators tailored for Meesho, Amazon, Flipkart, Shopify, and Indian small businesses.',
      ctaPrimaryText: 'Explore All Business Calculators',
      bannerNotice: '',
    },
    about: {
      title: 'Built for the Backbone of India: Independent Sellers & MSMEs',
      subtitle: 'ProfitCalci was founded with one clear mission: empower every Indian seller with transparent, accurate, and completely free financial calculation tools.',
      mission: 'Democratize access to enterprise-grade pricing and tax calculation tools without subscription walls or user tracking.',
      story: 'Indian e-commerce is booming, but sellers are often blind to hidden marketplace fees, high RTO return losses, and GST compliance errors. ProfitCalci levels the playing field.',
    },
    contact: {
      supportEmail: 'support@profitcalci.in',
      phone: '+91 98765 43210',
      address: 'Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051',
      responseTime: 'Within 24 business hours',
    },
    faq: FAQS_DATA.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  };

  const initialCategories: { id: ToolCategory; label: string; icon: string }[] = [
    { id: 'calculators', label: 'Calculators', icon: 'Calculator' },
    { id: 'ecommerce', label: 'E-commerce', icon: 'Store' },
    { id: 'invoicing', label: 'Invoicing & Retail', icon: 'FileText' },
    { id: 'ai-tools', label: 'AI & Copywriting', icon: 'Sparkles' },
  ];

  return {
    version: CONFIG_VERSION,
    lastUpdated: new Date().toISOString(),
    passcodeHash: '',
    passcodeSalt: '',
    passcodeConfigured: false,
    tools: initialTools,
    content: initialContent,
    seo: {},
    categories: initialCategories,
  };
}

interface AdminConfigContextType {
  config: AdminConfiguration;
  isAuthenticated: boolean;
  activeTools: ToolItem[];
  allManagedTools: ManagedCalculator[];
  content: EditablePageContent;
  // Auth
  authenticate: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setupNewPasscode: (newPasscode: string) => Promise<{ success: boolean; error?: string }>;
  // Tool Management
  toggleToolPublished: (slug: string) => void;
  updateTool: (slug: string, updates: Partial<ManagedCalculator>) => void;
  addCustomCalculator: (newTool: ManagedCalculator) => { success: boolean; error?: string };
  duplicateCalculator: (slug: string) => { success: boolean; newSlug?: string; error?: string };
  deleteCustomCalculator: (slug: string) => { success: boolean; error?: string };
  // Content Management
  updateHomepageContent: (updates: Partial<EditablePageContent['homepage']>) => void;
  updateAboutContent: (updates: Partial<EditablePageContent['about']>) => void;
  updateContactContent: (updates: Partial<EditablePageContent['contact']>) => void;
  updateFaqList: (faqs: { question: string; answer: string }[]) => void;
  // SEO Management
  updateSeoMetadata: (path: string, seoItem: EditableSeoItem) => void;
  // Backup & Restore
  exportConfigJson: () => string;
  importConfigJson: (jsonString: string) => { success: boolean; error?: string };
  resetToDefaults: () => void;
}

const AdminConfigContext = createContext<AdminConfigContextType | undefined>(undefined);

export const AdminConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfiguration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ADMIN_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === CONFIG_VERSION) {
          return parsed;
        }
      }
    } catch {}
    return buildDefaultConfig();
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionValid());

  // Keep storage in sync whenever config updates
  const persistConfig = (updated: AdminConfiguration) => {
    setConfig(updated);
    try {
      localStorage.setItem(STORAGE_ADMIN_CONFIG_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Convert managed tools to standard ToolItem for active site rendering
  const activeTools: ToolItem[] = config.tools
    .filter((t) => t.published)
    .map((t) => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      slug: t.slug,
      category: t.category,
      description: t.description,
      iconName: t.iconName,
      badge: t.badge,
      tags: t.tags,
      isPopular: t.isPopular,
      isFeatured: t.isFeatured,
    }));

  const allManagedTools = config.tools;

  // Authentication logic
  const authenticate = async (passcode: string): Promise<{ success: boolean; error?: string }> => {
    const lockout = getLockoutStatus();
    if (lockout.isLocked) {
      return {
        success: false,
        error: `Too many failed attempts. Try again in ${Math.ceil(lockout.remainingSeconds / 60)} minutes.`,
      };
    }

    if (!config.passcodeConfigured) {
      // First time initialization: automatically set the provided passcode
      if (passcode.length < 6) {
        return { success: false, error: 'Passcode must be at least 6 characters long.' };
      }
      const salt = generateSalt();
      const hash = await hashPasscode(passcode, salt);
      const updated: AdminConfiguration = {
        ...config,
        passcodeHash: hash,
        passcodeSalt: salt,
        passcodeConfigured: true,
        lastUpdated: new Date().toISOString(),
      };
      persistConfig(updated);
      saveAdminSession(hash);
      setIsAuthenticated(true);
      resetFailedAttempts();
      return { success: true };
    }

    // Verify against salted hash
    const computedHash = await hashPasscode(passcode, config.passcodeSalt);
    if (computedHash === config.passcodeHash) {
      saveAdminSession(computedHash);
      setIsAuthenticated(true);
      resetFailedAttempts();
      return { success: true };
    } else {
      const attempt = recordFailedAttempt();
      if (attempt.isLockedNow) {
        return {
          success: false,
          error: 'Maximum login attempts exceeded. Account locked for 15 minutes.',
        };
      }
      return { success: false, error: 'Invalid admin passcode. Please try again.' };
    }
  };

  const logout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  const setupNewPasscode = async (newPasscode: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAuthenticated) {
      return { success: false, error: 'Unauthorized: Session expired.' };
    }
    if (newPasscode.length < 6) {
      return { success: false, error: 'Passcode must be at least 6 characters long.' };
    }

    const salt = generateSalt();
    const hash = await hashPasscode(newPasscode, salt);
    const updated: AdminConfiguration = {
      ...config,
      passcodeHash: hash,
      passcodeSalt: salt,
      passcodeConfigured: true,
      lastUpdated: new Date().toISOString(),
    };
    persistConfig(updated);
    saveAdminSession(hash);
    return { success: true };
  };

  // Tool actions
  const toggleToolPublished = (slug: string) => {
    if (!isAuthenticated) return;
    const updatedTools = config.tools.map((t) =>
      t.slug === slug ? { ...t, published: !t.published } : t
    );
    persistConfig({
      ...config,
      tools: updatedTools,
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateTool = (slug: string, updates: Partial<ManagedCalculator>) => {
    if (!isAuthenticated) return;
    const updatedTools = config.tools.map((t) =>
      t.slug === slug ? { ...t, ...updates } : t
    );
    persistConfig({
      ...config,
      tools: updatedTools,
      lastUpdated: new Date().toISOString(),
    });
  };

  const addCustomCalculator = (newTool: ManagedCalculator): { success: boolean; error?: string } => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized.' };
    const cleanSlug = newTool.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug) return { success: false, error: 'Please enter a valid URL slug.' };

    if (config.tools.some((t) => t.slug === cleanSlug)) {
      return { success: false, error: `A calculator with slug "${cleanSlug}" already exists.` };
    }

    const toolToAdd: ManagedCalculator = {
      ...newTool,
      id: cleanSlug,
      slug: cleanSlug,
      published: true,
      isCustomCreated: true,
    };

    persistConfig({
      ...config,
      tools: [toolToAdd, ...config.tools],
      lastUpdated: new Date().toISOString(),
    });

    return { success: true };
  };

  const duplicateCalculator = (slug: string): { success: boolean; newSlug?: string; error?: string } => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized.' };
    const original = config.tools.find((t) => t.slug === slug);
    if (!original) return { success: false, error: 'Original calculator not found.' };

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const cloned: ManagedCalculator = {
      ...original,
      id: newSlug,
      slug: newSlug,
      name: `${original.name} (Copy)`,
      shortName: `${original.shortName} (Copy)`,
      isPopular: false,
      isFeatured: false,
      published: false, // Default to unpublished draft for safety
      isCustomCreated: true,
    };

    persistConfig({
      ...config,
      tools: [cloned, ...config.tools],
      lastUpdated: new Date().toISOString(),
    });

    return { success: true, newSlug };
  };

  const deleteCustomCalculator = (slug: string): { success: boolean; error?: string } => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized.' };
    const tool = config.tools.find((t) => t.slug === slug);
    if (!tool) return { success: false, error: 'Tool not found.' };

    // Prevent deleting core built-in tools (only allowed to unpublish them)
    if (!tool.isCustomCreated) {
      return {
        success: false,
        error: 'Built-in core tools cannot be deleted permanently. You can unpublish them instead.',
      };
    }

    const filtered = config.tools.filter((t) => t.slug !== slug);
    persistConfig({
      ...config,
      tools: filtered,
      lastUpdated: new Date().toISOString(),
    });

    return { success: true };
  };

  // Content actions
  const updateHomepageContent = (updates: Partial<EditablePageContent['homepage']>) => {
    if (!isAuthenticated) return;
    persistConfig({
      ...config,
      content: {
        ...config.content,
        homepage: { ...config.content.homepage, ...updates },
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateAboutContent = (updates: Partial<EditablePageContent['about']>) => {
    if (!isAuthenticated) return;
    persistConfig({
      ...config,
      content: {
        ...config.content,
        about: { ...config.content.about, ...updates },
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateContactContent = (updates: Partial<EditablePageContent['contact']>) => {
    if (!isAuthenticated) return;
    persistConfig({
      ...config,
      content: {
        ...config.content,
        contact: { ...config.content.contact, ...updates },
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateFaqList = (faqs: { question: string; answer: string }[]) => {
    if (!isAuthenticated) return;
    persistConfig({
      ...config,
      content: {
        ...config.content,
        faq: faqs,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const updateSeoMetadata = (path: string, seoItem: EditableSeoItem) => {
    if (!isAuthenticated) return;
    persistConfig({
      ...config,
      seo: {
        ...config.seo,
        [path]: seoItem,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  // Backup & Restore
  const exportConfigJson = (): string => {
    // Sanitize sensitive auth hashes from export
    const safeExport = {
      ...config,
      passcodeHash: '',
      passcodeSalt: '',
      passcodeConfigured: false,
    };
    return JSON.stringify(safeExport, null, 2);
  };

  const importConfigJson = (jsonString: string): { success: boolean; error?: string } => {
    if (!isAuthenticated) return { success: false, error: 'Unauthorized.' };
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.tools) || !parsed.content) {
        return { success: false, error: 'Invalid JSON format: missing tools or content structure.' };
      }

      // Preserve current auth credentials
      const merged: AdminConfiguration = {
        ...parsed,
        version: CONFIG_VERSION,
        lastUpdated: new Date().toISOString(),
        passcodeHash: config.passcodeHash,
        passcodeSalt: config.passcodeSalt,
        passcodeConfigured: config.passcodeConfigured,
      };

      persistConfig(merged);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `Invalid JSON syntax: ${err.message}` };
    }
  };

  const resetToDefaults = () => {
    if (!isAuthenticated) return;
    const fresh = buildDefaultConfig();
    fresh.passcodeHash = config.passcodeHash;
    fresh.passcodeSalt = config.passcodeSalt;
    fresh.passcodeConfigured = config.passcodeConfigured;
    persistConfig(fresh);
  };

  return (
    <AdminConfigContext.Provider
      value={{
        config,
        isAuthenticated,
        activeTools,
        allManagedTools,
        content: config.content,
        authenticate,
        logout,
        setupNewPasscode,
        toggleToolPublished,
        updateTool,
        addCustomCalculator,
        duplicateCalculator,
        deleteCustomCalculator,
        updateHomepageContent,
        updateAboutContent,
        updateContactContent,
        updateFaqList,
        updateSeoMetadata,
        exportConfigJson,
        importConfigJson,
        resetToDefaults,
      }}
    >
      {children}
    </AdminConfigContext.Provider>
  );
};

export const useAdminConfig = () => {
  const context = useContext(AdminConfigContext);
  if (!context) {
    throw new Error('useAdminConfig must be used within an AdminConfigProvider');
  }
  return context;
};
