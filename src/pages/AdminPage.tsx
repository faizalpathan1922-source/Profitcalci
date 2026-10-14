import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calculator,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Save,
  Download,
  Upload,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Home,
  Mail,
  HelpCircle,
  Globe,
  Settings,
} from 'lucide-react';
import { useAdminConfig } from '../context/AdminConfigContext';
import { useAdminPasscode } from '../context/AdminPasscodeContext';
import { ManagedCalculator, CalculatorInputField, CalculatorFormulaStep, CalculatorFaqItem } from '../types/admin';
import { ToolCategory } from '../types';
import { validateFormulaSyntax } from '../utils/formulaEngine';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

type AdminTab =
  | 'overview'
  | 'calculators'
  | 'builder'
  | 'content'
  | 'seo'
  | 'backup'
  | 'security';

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    isAuthenticated,
    hasEnvSecret,
    isLocked,
    lockoutRemainingSeconds,
    authenticate,
    logout,
    updatePasscode,
  } = useAdminPasscode();

  const {
    config,
    allManagedTools,
    content,
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
  } = useAdminConfig();

  // Auth form state
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search in tools
  const [toolSearch, setToolSearch] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Delete modal confirmation
  const [deleteTargetSlug, setDeleteTargetSlug] = useState<string | null>(null);

  // Reset defaults modal confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Change Passcode state
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Builder state
  const [builderTool, setBuilderTool] = useState<Partial<ManagedCalculator>>({
    name: '',
    shortName: '',
    slug: '',
    category: 'calculators',
    description: '',
    badge: 'Custom Tool',
    inputFields: [
      { id: 'sellingPrice', label: 'Selling Price (₹)', defaultValue: 1000, min: 0, unit: '₹' },
      { id: 'costPrice', label: 'Product Cost (₹)', defaultValue: 600, min: 0, unit: '₹' },
      { id: 'shippingCost', label: 'Shipping Fee (₹)', defaultValue: 70, min: 0, unit: '₹' },
    ],
    formulaSteps: [
      {
        outputFieldId: 'totalCost',
        label: 'Total Deductions',
        expression: 'costPrice + shippingCost',
        unit: '₹',
        color: 'rose',
      },
      {
        outputFieldId: 'netProfit',
        label: 'Net Profit',
        expression: 'sellingPrice - totalCost',
        unit: '₹',
        isPrimaryResult: true,
        color: 'emerald',
      },
    ],
    faqs: [
      {
        question: 'How is the calculation performed?',
        answer: 'Values are calculated live using your entered cost and selling metrics.',
      },
    ],
    formulaNotes: 'Net Profit = Selling Price - (Product Cost + Shipping Fee)',
  });
  const [builderError, setBuilderError] = useState<string | null>(null);

  // Edit existing tool modal
  const [editingTool, setEditingTool] = useState<ManagedCalculator | null>(null);

  // Content editing state
  const [homeHeroBadge, setHomeHeroBadge] = useState(content.homepage.heroBadge);
  const [homeHeroHeading, setHomeHeroHeading] = useState(content.homepage.heroHeading);
  const [homeHeroSubheading, setHomeHeroSubheading] = useState(content.homepage.heroSubheading);
  const [homeCtaText, setHomeCtaText] = useState(content.homepage.ctaPrimaryText);

  // Contact editing state
  const [contactEmail, setContactEmail] = useState(content.contact.supportEmail);
  const [contactPhone, setContactPhone] = useState(content.contact.phone);
  const [contactAddress, setContactAddress] = useState(content.contact.address);

  // JSON import input state
  const [importJsonText, setImportJsonText] = useState('');

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    const res = await authenticate(passcode);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || 'Login failed.');
    } else {
      setPasscode('');
      showToast('Admin session authenticated successfully.');
    }
  };

  // Handle Update Passcode
  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg(null);
    if (newPasscode !== confirmNewPasscode) {
      setSecurityMsg({ type: 'error', text: 'New passcodes do not match.' });
      return;
    }
    if (newPasscode.length < 6) {
      setSecurityMsg({ type: 'error', text: 'Passcode must be at least 6 characters long.' });
      return;
    }

    const res = await updatePasscode(newPasscode);
    if (res.success) {
      setNewPasscode('');
      setConfirmNewPasscode('');
      setSecurityMsg({ type: 'success', text: 'Passcode updated successfully.' });
      showToast('New passcode saved.');
    } else {
      setSecurityMsg({ type: 'error', text: res.error || 'Failed to update passcode.' });
    }
  };

  // Handle Save Builder Calculator
  const handleSaveBuilderTool = (e: React.FormEvent) => {
    e.preventDefault();
    setBuilderError(null);

    if (!builderTool.name?.trim()) {
      setBuilderError('Please enter a tool title/name.');
      return;
    }
    if (!builderTool.slug?.trim()) {
      setBuilderError('Please enter a URL slug.');
      return;
    }

    // Validate formula steps
    const availableVars = (builderTool.inputFields || []).map((f) => f.id);
    for (const step of builderTool.formulaSteps || []) {
      const vResult = validateFormulaSyntax(step.expression, availableVars);
      if (!vResult.valid) {
        setBuilderError(`Formula error in "${step.label}": ${vResult.error}`);
        return;
      }
      availableVars.push(step.outputFieldId);
    }

    const res = addCustomCalculator(builderTool as ManagedCalculator);
    if (res.success) {
      showToast(`Calculator "${builderTool.name}" created successfully!`);
      setActiveTab('calculators');
      // Reset builder
      setBuilderTool({
        name: '',
        shortName: '',
        slug: '',
        category: 'calculators',
        description: '',
        badge: 'Custom Tool',
        inputFields: [
          { id: 'price', label: 'Price', defaultValue: 500, min: 0, unit: '₹' },
          { id: 'rate', label: 'Rate (%)', defaultValue: 10, min: 0, unit: '%' },
        ],
        formulaSteps: [
          {
            outputFieldId: 'result',
            label: 'Result',
            expression: 'price * (rate / 100)',
            unit: '₹',
            isPrimaryResult: true,
          },
        ],
      });
    } else {
      setBuilderError(res.error || 'Failed to save calculator.');
    }
  };

  // Handle Delete Confirmation
  const confirmDeleteTool = () => {
    if (!deleteTargetSlug) return;
    const res = deleteCustomCalculator(deleteTargetSlug);
    if (res.success) {
      showToast('Calculator deleted successfully.');
    } else {
      showToast(res.error || 'Could not delete.');
    }
    setDeleteTargetSlug(null);
  };

  // Handle Export Download
  const handleDownloadBackup = () => {
    const jsonStr = exportConfigJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profitcalci-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded successfully.');
  };

  // Handle Import
  const handleImportBackup = () => {
    if (!importJsonText.trim()) {
      showToast('Please paste valid JSON backup content.');
      return;
    }
    const res = importConfigJson(importJsonText);
    if (res.success) {
      setImportJsonText('');
      showToast('Configuration restored successfully!');
    } else {
      showToast(`Import error: ${res.error}`);
    }
  };

  // If not logged in, render the secure authentication gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ProfitCalci Admin Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hasEnvSecret
                ? 'Protected by VITE_ADMIN_PASSCODE_HASH environment secret. Enter your admin passcode.'
                : 'Enter your secure admin passcode to access site management.'}
            </p>
          </div>

          {isLocked && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Account is temporarily locked. Try again in {Math.ceil(lockoutRemainingSeconds / 60)} minutes ({lockoutRemainingSeconds}s).
              </span>
            </div>
          )}

          {authError && !isLocked && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                disabled={isLocked}
                value={passcode}
                placeholder="••••••••"
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading || isLocked}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              <span>{isLocked ? 'Locked Out' : 'Authenticate & Enter'}</span>
            </button>
          </form>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Security Guarantee:
            </span>
            <p>
              Passcodes are hashed client-side with salted SHA-256. Plaintext credentials are never saved or sent over the network.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const publishedCount = allManagedTools.filter((t) => t.published).length;
  const customCount = allManagedTools.filter((t) => t.isCustomCreated).length;

  const filteredTools = allManagedTools.filter(
    (t) =>
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.slug.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(toolSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-emerald-950 dark:text-emerald-100 rounded-2xl shadow-2xl border border-slate-700 dark:border-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Authenticated Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            ProfitCalci Control Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage calculators, formulas, content pages, and SEO metadata with draft/live controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'calculators', label: `Calculators (${allManagedTools.length})`, icon: Calculator },
          { id: 'builder', label: 'Add New Calculator', icon: Plus },
          { id: 'content', label: 'Website Content', icon: FileText },
          { id: 'seo', label: 'SEO Metadata', icon: Globe },
          { id: 'backup', label: 'Backup & Restore', icon: Download },
          { id: 'security', label: 'Passcode & Security', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Calculators</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {allManagedTools.length}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {publishedCount} live & active
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Built Tools</span>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{customCount}</div>
              <p className="text-[11px] text-slate-500 mt-1">Created via Form Builder</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unpublished Drafts</span>
              <div className="text-3xl font-extrabold text-amber-500 mt-1">
                {allManagedTools.length - publishedCount}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Hidden from public view</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Hosting</span>
              <div className="text-3xl font-extrabold text-teal-600 mt-1">Netlify</div>
              <p className="text-[11px] text-slate-500 mt-1">Static SPA + Client Router</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab('builder')}
              className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl shadow-md text-left space-y-2 hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              <h3 className="font-bold text-base">Create New Calculator</h3>
              <p className="text-xs text-emerald-100">
                Design custom inputs, formulas, and FAQs using the visual formula builder without touching code.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-2 hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <FileText className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Edit Website Text</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update homepage headline, hero badges, About us mission, and Contact email & phone.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-2 hover:border-emerald-500 transition-colors cursor-pointer"
            >
              <Download className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Export & Backup JSON</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download a full backup of all your configured tools and content for safekeeping.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Manage All Calculators */}
      {activeTab === 'calculators' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search calculators..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              onClick={() => setActiveTab('builder')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Calculator</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {filteredTools.map((tool) => (
              <div
                key={tool.slug}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      /tool/{tool.slug}
                    </span>
                    {tool.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {tool.badge}
                      </span>
                    )}
                    {tool.isCustomCreated && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        Custom Built
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tool.published
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {tool.published ? 'Live' : 'Draft / Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  {/* View/Preview Link */}
                  <button
                    onClick={() => onNavigate(`/tool/${tool.slug}`)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Preview calculator page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Duplicate Tool */}
                  <button
                    onClick={() => {
                      const res = duplicateCalculator(tool.slug);
                      if (res.success) {
                        showToast(`Duplicated into draft: ${res.newSlug}`);
                      } else {
                        showToast(res.error || 'Duplicate failed');
                      }
                    }}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Duplicate as new draft"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Toggle Live / Draft */}
                  <button
                    onClick={() => {
                      toggleToolPublished(tool.slug);
                      showToast(
                        tool.published
                          ? `Unpublished "${tool.name}". Now hidden from live site.`
                          : `Published "${tool.name}". Now visible to all visitors!`
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      tool.published
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {tool.published ? 'Unpublish' : 'Publish Live'}
                  </button>

                  {/* Edit metadata */}
                  <button
                    onClick={() => setEditingTool(tool)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit name, badge, and description"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete (custom tools only) */}
                  {tool.isCustomCreated && (
                    <button
                      onClick={() => setDeleteTargetSlug(tool.slug)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      title="Delete calculator"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Form-Based Calculator Builder */}
      {activeTab === 'builder' && (
        <form onSubmit={handleSaveBuilderTool} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Form-Based Calculator Creator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a fully interactive business calculator using validated mathematical formulas. Zero code required.
              </p>
            </div>

            {builderError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{builderError}</span>
              </div>
            )}

            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Calculator Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Freight Calculator"
                  value={builderTool.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setBuilderTool({
                      ...builderTool,
                      name,
                      shortName: builderTool.shortName || name.slice(0, 14),
                      slug: builderTool.slug || autoSlug,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL Slug (/tool/slug) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. export-freight-calculator"
                  value={builderTool.slug || ''}
                  onChange={(e) => setBuilderTool({ ...builderTool, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={builderTool.category || 'calculators'}
                  onChange={(e) =>
                    setBuilderTool({ ...builderTool, category: e.target.value as ToolCategory })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="calculators">Calculators</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="invoicing">Invoicing & Retail</option>
                  <option value="ai-tools">AI & Marketing</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Summarize what this calculator does..."
                  value={builderTool.description || ''}
                  onChange={(e) =>
                    setBuilderTool({ ...builderTool, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. New, Popular, Logistics"
                  value={builderTool.badge || ''}
                  onChange={(e) => setBuilderTool({ ...builderTool, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Input Fields Configurator */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Input Parameters (User Inputs)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define variable names to use in your formula (e.g. <code>costPrice</code>, <code>qty</code>).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const count = (builderTool.inputFields || []).length + 1;
                    const newField: CalculatorInputField = {
                      id: `field${count}`,
                      label: `Parameter ${count}`,
                      defaultValue: 100,
                      min: 0,
                      unit: '₹',
                    };
                    setBuilderTool({
                      ...builderTool,
                      inputFields: [...(builderTool.inputFields || []), newField],
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Input</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(builderTool.inputFields || []).map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-400 block">Variable ID</label>
                      <input
                        type="text"
                        required
                        value={field.id}
                        onChange={(e) => {
                          const updated = [...(builderTool.inputFields || [])];
                          updated[idx].id = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                          setBuilderTool({ ...builderTool, inputFields: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-bold text-slate-400 block">Label</label>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={(e) => {
                          const updated = [...(builderTool.inputFields || [])];
                          updated[idx].label = e.target.value;
                          setBuilderTool({ ...builderTool, inputFields: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block">Default</label>
                      <input
                        type="number"
                        value={field.defaultValue}
                        onChange={(e) => {
                          const updated = [...(builderTool.inputFields || [])];
                          updated[idx].defaultValue = parseFloat(e.target.value) || 0;
                          setBuilderTool({ ...builderTool, inputFields: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block">Unit</label>
                      <input
                        type="text"
                        placeholder="₹, %, units"
                        value={field.unit || ''}
                        onChange={(e) => {
                          const updated = [...(builderTool.inputFields || [])];
                          updated[idx].unit = e.target.value;
                          setBuilderTool({ ...builderTool, inputFields: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (builderTool.inputFields || []).filter((_, i) => i !== idx);
                          setBuilderTool({ ...builderTool, inputFields: updated });
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="Remove input"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formula Steps Configurator */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Formula Outputs & Steps
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Safe math operations supported: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>, <code>( )</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const count = (builderTool.formulaSteps || []).length + 1;
                    const newStep: CalculatorFormulaStep = {
                      outputFieldId: `step${count}`,
                      label: `Step ${count}`,
                      expression: (builderTool.inputFields || [])[0]?.id || '10',
                      unit: '₹',
                    };
                    setBuilderTool({
                      ...builderTool,
                      formulaSteps: [...(builderTool.formulaSteps || []), newStep],
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Formula Step</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {(builderTool.formulaSteps || []).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-400 block">Step Label</label>
                      <input
                        type="text"
                        required
                        value={step.label}
                        onChange={(e) => {
                          const updated = [...(builderTool.formulaSteps || [])];
                          updated[idx].label = e.target.value;
                          setBuilderTool({ ...builderTool, formulaSteps: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-bold text-slate-400 block">
                        Formula Expression (e.g. <code>sellingPrice - costPrice</code>)
                      </label>
                      <input
                        type="text"
                        required
                        value={step.expression}
                        onChange={(e) => {
                          const updated = [...(builderTool.formulaSteps || [])];
                          updated[idx].expression = e.target.value;
                          setBuilderTool({ ...builderTool, formulaSteps: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 block">Unit</label>
                      <input
                        type="text"
                        placeholder="₹, %"
                        value={step.unit || ''}
                        onChange={(e) => {
                          const updated = [...(builderTool.formulaSteps || [])];
                          updated[idx].unit = e.target.value;
                          setBuilderTool({ ...builderTool, formulaSteps: updated });
                        }}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-end gap-2">
                      <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(step.isPrimaryResult)}
                          onChange={(e) => {
                            const updated = (builderTool.formulaSteps || []).map((s, i) => ({
                              ...s,
                              isPrimaryResult: i === idx ? e.target.checked : false,
                            }));
                            setBuilderTool({ ...builderTool, formulaSteps: updated });
                          }}
                        />
                        <span>Primary</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (builderTool.formulaSteps || []).filter((_, i) => i !== idx);
                          setBuilderTool({ ...builderTool, formulaSteps: updated });
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="Remove step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('calculators')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Publish Calculator</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Content Management */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Homepage Text Editor */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Homepage Hero & Headings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={homeHeroBadge}
                  onChange={(e) => setHomeHeroBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={homeHeroHeading}
                  onChange={(e) => setHomeHeroHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-heading / Description
                </label>
                <textarea
                  rows={2}
                  value={homeHeroSubheading}
                  onChange={(e) => setHomeHeroSubheading(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={homeCtaText}
                  onChange={(e) => setHomeCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="text-right pt-2">
                <button
                  type="button"
                  onClick={() => {
                    updateHomepageContent({
                      heroBadge: homeHeroBadge,
                      heroHeading: homeHeroHeading,
                      heroSubheading: homeHeroSubheading,
                      ctaPrimaryText: homeCtaText,
                    });
                    showToast('Homepage text updated successfully.');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Homepage Text</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Details Editor */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Contact & Support Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Support Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Office / Business Address
                </label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => {
                  updateContactContent({
                    supportEmail: contactEmail,
                    phone: contactPhone,
                    address: contactAddress,
                  });
                  showToast('Contact details updated.');
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Contact Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO Metadata */}
      {activeTab === 'seo' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Search Engine Optimization (SEO) & Sitelinks
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize search snippets, titles, and meta descriptions for individual calculators and content pages.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allManagedTools.slice(0, 10).map((tool) => (
              <div key={tool.slug} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {tool.name}
                  </span>
                  <code className="text-[10px] text-slate-400 font-mono">
                    https://profitcalci.in/tool/{tool.slug}
                  </code>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {tool.name} India - Free Business Calculator | ProfitCalci
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    https://profitcalci.in/tool/{tool.slug}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    {tool.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Export JSON Backup
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your complete configuration file containing all calculator definitions, custom formulas, content edits, and SEO metadata. Passcodes are safely excluded.
            </p>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup JSON File</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Restore Configuration from JSON
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste previously exported JSON configuration text below to restore your tools and settings.
            </p>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste backup JSON content here..."
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              type="button"
              onClick={handleImportBackup}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Validate & Restore Config</span>
            </button>
          </div>

          {/* Reset to Factory Defaults */}
          <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Reset All Content to Initial Defaults</span>
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              This will restore the 23 default calculators and standard text content. Your admin passcode will remain unchanged.
            </p>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset to Factory Defaults
            </button>
          </div>
        </div>
      )}

      {/* Tab 7: Passcode & Security */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Change Admin Passcode
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Update the passcode required to access this control center. Passcodes are hashed with a unique cryptographic salt.
            </p>
          </div>

          {securityMsg && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                securityMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{securityMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePasscode} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Passcode (min. 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Passcode
              </label>
              <input
                type="password"
                required
                value={confirmNewPasscode}
                onChange={(e) => setConfirmNewPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Update Passcode
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Delete Calculator?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete{' '}
                <code className="font-mono font-bold text-rose-600">/tool/{deleteTargetSlug}</code>? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetSlug(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTool}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Defaults Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Reset All Tools?</h3>
              <p className="text-xs text-slate-500">
                This will reset your calculator catalog and homepage text back to factory state. Make sure you downloaded a JSON backup first.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                  showToast('Configuration reset to factory defaults.');
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tool Metadata Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Edit Calculator: {editingTool.name}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingTool.name}
                  onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={editingTool.badge || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTool(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTool(editingTool.slug, {
                    name: editingTool.name,
                    badge: editingTool.badge,
                    description: editingTool.description,
                  });
                  setEditingTool(null);
                  showToast('Calculator updated successfully.');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
