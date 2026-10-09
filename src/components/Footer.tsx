import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center mb-4 group text-left cursor-pointer hover:opacity-90 transition-opacity"
              title="ProfitCalci Home"
            >
              <Logo size="md" theme="dark" />
            </button>
            <p className="text-emerald-400 font-semibold text-sm mb-3">
              Free Business Tools for Indian Sellers
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              ProfitCalci is a free business calculator and tools platform designed for Indian sellers, entrepreneurs, retailers and small businesses.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Built for Bharat Merchants, D2C & MSMEs</span>
            </div>
          </div>

          {/* Column 1: Core Tools */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Tools & Calculators
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('/tools')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tool/gst-calculator')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Calculators
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tool/whatsapp-ad-generator')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  AI Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/tool/profit-calculator')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  E-commerce
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Pricing */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('/resources')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Resources
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/pricing')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/faq')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('/privacy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/terms')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/disclaimer')}
                  className="hover:text-emerald-400 transition-colors font-medium text-amber-400/90"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/cookie-policy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Specific Footer Disclaimer */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 leading-relaxed space-y-3">
          <p className="font-medium text-slate-400">
            ProfitCalci is an independent platform and is not affiliated with Meesho, Amazon, Flipkart, GST authorities or any government organization.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-600">
            <span>© {new Date().getFullYear()} ProfitCalci. All calculations are provided for informational convenience.</span>
            <span>Independent Indian Merchant Toolkit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
