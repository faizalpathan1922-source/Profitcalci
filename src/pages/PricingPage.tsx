import React from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onSelectTool: (slug: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectTool }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
          Simple, Honest Plans for Every Indian Seller
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Core business calculations should never be behind a paywall.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500 shadow-md relative flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Free Forever
            </span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">₹0</span>
              <span className="text-slate-500 text-sm font-medium">/ lifetime</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Everything needed to run everyday calculations, invoices, and prices.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited GST inclusive & exclusive calculations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Marketplace profit calculator with RTO loss provisions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selling price calculator with exact margin reverse-math</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GST Tax Invoice Generator with printable A4 / PDF export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp ad copy generator with Hinglish templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>UPI payment QR code and barcode generator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No sign-up or credit card required</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-100">
            <button
              onClick={() => onSelectTool('gst-calculator')}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Start Using Free Tools Now
            </button>
          </div>
        </div>

        {/* Pro Plan (Beta Preview) */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-6 bg-amber-400 text-slate-950 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Public Beta Free
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ProfitCalci Pro</span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-4xl sm:text-5xl font-black text-white">₹0</span>
              <span className="text-slate-400 text-sm font-medium">/ beta period</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Advanced AI workflows and cloud syncing for high-volume merchants.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Everything in Free Forever tier</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited Gemini AI e-commerce product description generator</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI custom festive promotional campaign writer</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Batch barcode creation for inventory cartons</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-product catalog export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority email support & early feature access</span>
              </li>
            </ul>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-800">
            <button
              onClick={() => onSelectTool('whatsapp-ad-generator')}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs"
            >
              Try AI Tools (Free in Beta)
            </button>
            <span className="text-[10px] text-slate-400 text-center block mt-2">
              Paid subscription backend requires configuration in production.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
