import React from 'react';
import { ShieldCheck, HeartHandshake, Zap, Award, Sparkles, Building2, Store } from 'lucide-react';
import { Logo } from '../components/Logo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title & Official Logo */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="flex justify-center pt-2">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm inline-flex">
            <Logo size="lg" />
          </div>
        </div>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Empowering Indian merchants, wholesalers, retailers, and e-commerce entrepreneurs with clean, accessible digital tools.
        </p>
      </div>

      {/* Primary Mission Card with the required quote */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 border border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Our Purpose
        </span>
        <p className="text-xl sm:text-2xl font-bold leading-relaxed text-slate-100">
          "ProfitCalci is a free business calculator and tools platform designed for Indian sellers, entrepreneurs, retailers and small businesses."
        </p>
        <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-700/80">
          From figuring out your actual net profit after Meesho or Amazon commissions to drafting an intra-state GST invoice or crafting high-converting WhatsApp promotional messages, ProfitCalci removes calculation friction so you can focus on growing your trade.
        </p>
      </div>

      {/* Independence & Non-affiliation Clarification */}
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-6 text-sm text-amber-950 dark:text-amber-200 space-y-2">
        <h3 className="font-bold text-base text-amber-900 dark:text-amber-300 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Independent Platform Declaration</span>
        </h3>
        <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          ProfitCalci is a completely independent, privately managed utility project. ProfitCalci does not claim, nor does it have, any government affiliation or official endorsement from the Goods and Services Tax Network (GSTN), Central Board of Indirect Taxes and Customs (CBIC), Ministry of Finance, or any official government agency. Furthermore, we are not affiliated with, sponsored by, or endorsed by commercial marketplaces such as Meesho, Amazon India, or Flipkart.
        </p>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Guiding Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Built for Bharat</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every formula and tool accounts for Indian market realities: standard Indian numbering (Lakhs/Crores), COD return rates (RTO), and intra-state vs inter-state GST breakdowns.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Paywall Friction</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              All core calculators and invoice generators are free to use without requiring user accounts, mandatory phone OTPs, or credit card authorizations.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Client-Side Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your sensitive invoice line items, purchase costs, and customer lists run in your own browser tab. We never harvest or sell your business pricing data.
            </p>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Who is ProfitCalci for?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2.5">
            <Store className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">E-commerce Marketplace Sellers</strong>
              Merchants selling on Meesho, Amazon India, Flipkart, and JioMart who need accurate net margin and payout calculations.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">Local Retailers & Kirana Stores</strong>
              Shopkeepers who need quick GST bill calculations, instant UPI payment counter QR stands, and price markups.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">Boutique & Reseller Networks</strong>
              Social sellers and resellers operating through WhatsApp groups and Instagram shops who need quick billing and professional ad copies.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">D2C Brand Founders & Wholesalers</strong>
              Entrepreneurs who require accurate unit economics, COD break-even modeling, and commercial proforma quotations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
