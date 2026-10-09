import React, { useState } from 'react';
import { GitCompare, Copy, Check, ArrowRight, ShieldCheck, Zap, Share2, Printer, Sliders, Info, RotateCcw } from 'lucide-react';
import { formatINR, parseSafeNumber } from '../../utils/formatters';

interface PlatformFeeSlab {
  referral: number;
  closing: number;
  shipping: number;
}

const CATEGORY_DEFAULT_SLABS: Record<string, { meesho: PlatformFeeSlab; amazon: PlatformFeeSlab; flipkart: PlatformFeeSlab }> = {
  apparel: {
    meesho: { referral: 0, closing: 0, shipping: 75 },
    amazon: { referral: 12.5, closing: 20, shipping: 85 },
    flipkart: { referral: 13.0, closing: 18, shipping: 75 },
  },
  footwear: {
    meesho: { referral: 0, closing: 0, shipping: 80 },
    amazon: { referral: 13.0, closing: 20, shipping: 85 },
    flipkart: { referral: 12.0, closing: 18, shipping: 80 },
  },
  electronics: {
    meesho: { referral: 0, closing: 0, shipping: 70 },
    amazon: { referral: 9.5, closing: 25, shipping: 85 },
    flipkart: { referral: 9.0, closing: 20, shipping: 70 },
  },
  home: {
    meesho: { referral: 0, closing: 0, shipping: 85 },
    amazon: { referral: 11.0, closing: 20, shipping: 90 },
    flipkart: { referral: 11.5, closing: 18, shipping: 80 },
  },
};

export const MarketplaceComparison: React.FC = () => {
  const [sellingPrice, setSellingPrice] = useState<number>(799);
  const [productCost, setProductCost] = useState<number>(280);
  const [category, setCategory] = useState<'apparel' | 'footwear' | 'electronics' | 'home'>('apparel');
  const [copied, setCopied] = useState<boolean>(false);
  const [showOverrides, setShowOverrides] = useState<boolean>(false);

  // Custom manual overrides for referral %, closing fee, and shipping charges
  const [customRates, setCustomRates] = useState<{
    meesho: PlatformFeeSlab;
    amazon: PlatformFeeSlab;
    flipkart: PlatformFeeSlab;
  }>(CATEGORY_DEFAULT_SLABS.apparel);

  const safePrice = Math.max(0, parseSafeNumber(sellingPrice, 0));
  const safeCost = Math.max(0, parseSafeNumber(productCost, 0));

  const handleCategoryChange = (newCat: 'apparel' | 'footwear' | 'electronics' | 'home') => {
    setCategory(newCat);
    setCustomRates(CATEGORY_DEFAULT_SLABS[newCat]);
  };

  const handleResetSlabs = () => {
    setCustomRates(CATEGORY_DEFAULT_SLABS[category]);
  };

  // 1. Meesho calculation
  const meeshoCommission = (safePrice * customRates.meesho.referral) / 100;
  const meeshoClosing = customRates.meesho.closing;
  const meeshoShipping = customRates.meesho.shipping;
  const meeshoGstOnFees = (meeshoCommission + meeshoClosing) * 0.18;
  const meeshoTotalFees = meeshoCommission + meeshoClosing + meeshoGstOnFees + meeshoShipping;
  const meeshoPayout = Math.max(0, safePrice - meeshoTotalFees);
  const meeshoProfit = meeshoPayout - safeCost;
  const meeshoMargin = safePrice > 0 ? (meeshoProfit / safePrice) * 100 : 0;

  // 2. Amazon calculation (Referral + Closing fee + Easy Ship + 18% GST on services)
  const amazonCommission = (safePrice * customRates.amazon.referral) / 100;
  const amazonClosing = customRates.amazon.closing;
  const amazonShipping = customRates.amazon.shipping;
  const amazonGstOnFees = (amazonCommission + amazonClosing) * 0.18;
  const amazonTotalFees = amazonCommission + amazonClosing + amazonGstOnFees + amazonShipping;
  const amazonPayout = Math.max(0, safePrice - amazonTotalFees);
  const amazonProfit = amazonPayout - safeCost;
  const amazonMargin = safePrice > 0 ? (amazonProfit / safePrice) * 100 : 0;

  // 3. Flipkart calculation
  const flipkartCommission = (safePrice * customRates.flipkart.referral) / 100;
  const flipkartClosing = customRates.flipkart.closing;
  const flipkartShipping = customRates.flipkart.shipping;
  const flipkartGstOnFees = (flipkartCommission + flipkartClosing) * 0.18;
  const flipkartTotalFees = flipkartCommission + flipkartClosing + flipkartGstOnFees + flipkartShipping;
  const flipkartPayout = Math.max(0, safePrice - flipkartTotalFees);
  const flipkartProfit = flipkartPayout - safeCost;
  const flipkartMargin = safePrice > 0 ? (flipkartProfit / safePrice) * 100 : 0;

  const platforms = [
    {
      name: 'Meesho',
      tagline: '0% Referral Commission Base',
      badge: 'Highest Payout',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      commissionRate: customRates.meesho.referral,
      commissionAmount: meeshoCommission,
      closingFee: meeshoClosing,
      shipping: meeshoShipping,
      gstOnFees: meeshoGstOnFees,
      totalFees: meeshoTotalFees,
      bankPayout: meeshoPayout,
      netProfit: meeshoProfit,
      marginPercent: meeshoMargin,
      pros: '0% commission on catalog, direct supplier payouts, high tier 2/3 volume',
    },
    {
      name: 'Amazon India',
      tagline: 'Prime Delivery & High Ticket Orders',
      badge: 'Largest Buyer Base',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
      commissionRate: customRates.amazon.referral,
      commissionAmount: amazonCommission,
      closingFee: amazonClosing,
      shipping: amazonShipping,
      gstOnFees: amazonGstOnFees,
      totalFees: amazonTotalFees,
      bankPayout: amazonPayout,
      netProfit: amazonProfit,
      marginPercent: amazonMargin,
      pros: 'Massive organic traffic, Prime badge reliability, higher average basket size',
    },
    {
      name: 'Flipkart',
      tagline: 'High Indian Festive Traction',
      badge: 'Big Billion Days',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
      commissionRate: customRates.flipkart.referral,
      commissionAmount: flipkartCommission,
      closingFee: flipkartClosing,
      shipping: flipkartShipping,
      gstOnFees: flipkartGstOnFees,
      totalFees: flipkartTotalFees,
      bankPayout: flipkartPayout,
      netProfit: flipkartProfit,
      marginPercent: flipkartMargin,
      pros: 'Strong category dominance in fashion & electronics, wide logistics network',
    },
  ];

  const handleCopy = () => {
    const summary = `📊 ProfitCalci Marketplace Comparison for ${formatINR(safePrice)} Selling Price:
Cost Price: ${formatINR(safeCost)}
- Meesho: Payout ${formatINR(meeshoPayout)} | Net Profit ${formatINR(meeshoProfit)} (${meeshoMargin.toFixed(1)}%)
- Amazon: Payout ${formatINR(amazonPayout)} | Net Profit ${formatINR(amazonProfit)} (${amazonMargin.toFixed(1)}%)
- Flipkart: Payout ${formatINR(flipkartPayout)} | Net Profit ${formatINR(flipkartProfit)} (${flipkartMargin.toFixed(1)}%)
Calculated on ProfitCalci (https://profitcalci.in/tool/marketplace-comparison)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const text = `📊 *Marketplace Fee & Profit Comparison* (ProfitCalci)
💰 Selling Price: ${formatINR(safePrice)} | Cost: ${formatINR(safeCost)}
---------------------------------------------
1️⃣ *Meesho (0% Commission)*
• Bank Payout: *${formatINR(meeshoPayout)}*
• Net Profit: *${formatINR(meeshoProfit)}* (${meeshoMargin.toFixed(1)}% margin)

2️⃣ *Amazon India (Easy Ship)*
• Bank Payout: *${formatINR(amazonPayout)}*
• Net Profit: *${formatINR(amazonProfit)}* (${amazonMargin.toFixed(1)}% margin)

3️⃣ *Flipkart*
• Bank Payout: *${formatINR(flipkartPayout)}*
• Net Profit: *${formatINR(flipkartProfit)}* (${flipkartMargin.toFixed(1)}% margin)
---------------------------------------------
Compare your listing margins: https://profitcalci.in/tool/marketplace-comparison`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              E-commerce Comparison
            </span>
            <span className="text-xs text-slate-500">Meesho vs Amazon vs Flipkart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Marketplace Fee Comparison
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Compare referral fees, closing charges, shipping, and actual bank payout side by side.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Comparison' : 'Copy Table'}</span>
          </button>
          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share on WhatsApp</span>
          </a>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Note about commission presets */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Updated with standard seller fee slabs (Amazon Easy Ship, Flipkart, Meesho 0% base commission).</span>
        </span>
        <button
          type="button"
          onClick={() => setShowOverrides(!showOverrides)}
          className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showOverrides ? 'Hide Fee Overrides' : 'Customize Fee Slabs'}</span>
        </button>
      </div>

      {/* Input bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="cmp-selling-price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Selling Price (₹)
          </label>
          <input
            id="cmp-selling-price"
            type="number"
            value={sellingPrice || ''}
            onChange={(e) => setSellingPrice(Number(e.target.value))}
            placeholder="799"
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="cmp-product-cost" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Purchase Cost (₹)
          </label>
          <input
            id="cmp-product-cost"
            type="number"
            value={productCost || ''}
            onChange={(e) => setProductCost(Number(e.target.value))}
            placeholder="280"
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label htmlFor="cmp-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Product Category
          </label>
          <select
            id="cmp-category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="apparel">Apparel & Ethnic Wear (Kurtis, Sarees)</option>
            <option value="footwear">Footwear & Shoes</option>
            <option value="electronics">Electronics & Mobile Accessories</option>
            <option value="home">Home & Kitchen Utensils</option>
          </select>
        </div>
      </div>

      {/* Manual Fee Slab Overrides Panel */}
      {showOverrides && (
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Custom Platform Fee Overrides
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Adjust referral fee %, fixed closing fee (₹), and courier shipping (₹) for each marketplace.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetSlabs}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Meesho Overrides */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block">Meesho Slabs</span>
              <div>
                <label className="text-[11px] text-slate-500 block">Referral Fee (%)</label>
                <input
                  type="number"
                  value={customRates.meesho.referral}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      meesho: { ...customRates.meesho, referral: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Closing Fee (₹)</label>
                <input
                  type="number"
                  value={customRates.meesho.closing}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      meesho: { ...customRates.meesho, closing: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Shipping Charge (₹)</label>
                <input
                  type="number"
                  value={customRates.meesho.shipping}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      meesho: { ...customRates.meesho, shipping: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Amazon Overrides */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 block">Amazon India Slabs</span>
              <div>
                <label className="text-[11px] text-slate-500 block">Referral Fee (%)</label>
                <input
                  type="number"
                  value={customRates.amazon.referral}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      amazon: { ...customRates.amazon, referral: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Closing Fee (₹)</label>
                <input
                  type="number"
                  value={customRates.amazon.closing}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      amazon: { ...customRates.amazon, closing: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Shipping Charge (₹)</label>
                <input
                  type="number"
                  value={customRates.amazon.shipping}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      amazon: { ...customRates.amazon, shipping: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Flipkart Overrides */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-800 dark:text-blue-400 block">Flipkart Slabs</span>
              <div>
                <label className="text-[11px] text-slate-500 block">Referral Fee (%)</label>
                <input
                  type="number"
                  value={customRates.flipkart.referral}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      flipkart: { ...customRates.flipkart, referral: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Closing Fee (₹)</label>
                <input
                  type="number"
                  value={customRates.flipkart.closing}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      flipkart: { ...customRates.flipkart, closing: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 block">Shipping Charge (₹)</label>
                <input
                  type="number"
                  value={customRates.flipkart.shipping}
                  onChange={(e) =>
                    setCustomRates({
                      ...customRates,
                      flipkart: { ...customRates.flipkart, shipping: Number(e.target.value) },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side by side comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.tagline}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>

              {/* Profit banner */}
              <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Your Net Profit</span>
                <span className={`text-2xl font-black ${p.netProfit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {formatINR(p.netProfit)}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mt-0.5">
                  {p.marginPercent.toFixed(1)}% margin
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Commission Rate</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{p.commissionRate}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Commission Amount</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatINR(p.commissionAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Closing & Fixed Fee</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatINR(p.closingFee)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Courier Shipping Est.</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatINR(p.shipping)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">18% GST on Fees</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatINR(p.gstOnFees)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                  <span>Net Payout Deposited</span>
                  <span className="text-emerald-700 dark:text-emerald-400">{formatINR(p.bankPayout)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              💡 {p.pros}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
