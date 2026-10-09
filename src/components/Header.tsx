import React, { useState } from 'react';
import { 
  Calculator, 
  Menu, 
  X, 
  Search, 
  Sparkles, 
  TrendingUp, 
  FileText, 
  Tag, 
  ShieldAlert, 
  BookOpen, 
  HelpCircle, 
  ChevronDown
} from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsData';
import { PWAInstallButton } from './PWAInstallButton';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center text-left group hover:opacity-90 transition-opacity cursor-pointer"
              title="ProfitCalci Home"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('/')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              Home
            </button>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPath.startsWith('/tool') || currentPath === '/tools'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <span>Tools</span>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>

              {toolsDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Core Business Tools
                  </div>
                  <div className="space-y-0.5">
                    {TOOLS_LIST.slice(0, 5).map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleNav(`/tool/${tool.slug}`)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                      >
                        <div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 block">
                            {tool.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.shortName || tool.name}
                          </span>
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {tool.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleNav('/tools')}
                      className="w-full text-center py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      View All 20+ Business Tools →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/resources')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/resources'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              Resources
            </button>

            <button
              onClick={() => handleNav('/pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/pricing'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => handleNav('/faq')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/faq'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              FAQ
            </button>

            <button
              onClick={() => handleNav('/about')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/about'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              About
            </button>

            <button
              onClick={() => handleNav('/contact')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPath === '/contact'
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Global Theme Toggle */}
            <ThemeToggle />

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
              title="Search tools"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden sm:inline">Search Tools...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-150">
          {/* Quick theme toggle in drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Theme Mode
            </span>
            <ThemeToggle showLabel />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleNav('/')}
              className={`p-2.5 rounded-xl text-left text-sm font-bold cursor-pointer ${
                currentPath === '/'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/tools')}
              className={`p-2.5 rounded-xl text-left text-sm font-bold cursor-pointer ${
                currentPath === '/tools'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800'
              }`}
            >
              All Tools ({TOOLS_LIST.length})
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-1 mb-1">
              Popular Tools
            </span>
            {TOOLS_LIST.slice(0, 5).map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleNav(`/tool/${tool.slug}`)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 text-left font-medium cursor-pointer"
              >
                <span>{tool.name}</span>
                {tool.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tool.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => handleNav('/about')} className="py-2 hover:text-emerald-700 dark:hover:text-emerald-400">About</button>
            <button onClick={() => handleNav('/pricing')} className="py-2 hover:text-emerald-700 dark:hover:text-emerald-400">Pricing</button>
            <button onClick={() => handleNav('/faq')} className="py-2 hover:text-emerald-700 dark:hover:text-emerald-400">FAQ</button>
            <button onClick={() => handleNav('/resources')} className="py-2 hover:text-emerald-700 dark:hover:text-emerald-400">Guides</button>
            <button onClick={() => handleNav('/contact')} className="py-2 hover:text-emerald-700 dark:hover:text-emerald-400">Contact</button>
          </div>
        </div>
      )}
    </header>
  );
};
