import React, { useState } from 'react';
import { Store, Copy, Check, Info, AlertTriangle, ShieldCheck, RefreshCw, HelpCircle, ExternalLink, Share2, Printer } from 'lucide-react';
import { formatINR, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

interface MarketplacePreset {
  id: 'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom';
  name: string;
  referral: number;
  closing: number;
  shipping: number;
  rtoRate: number;
  rtoLoss: number;
  description: string;
}

const MARKETPLACE_PRESETS: MarketplacePreset[] = [
  {
    id: 'shopify',
    name: 'Shopify / D2C Brand',
    referral: 2,
    closing: 0,
    shipping: 65,
    rtoRate: 12,
    rtoLoss: 75,
    description: 'Shopify D2C store with payment gateway charges (2%), private courier shipping, and RTO risk provision.',
  },
  {
    id: 'meesho',
    name: 'Meesho (0% Commission)',
    referral: 0,
    closing: 0,
    shipping: 75,
    rtoRate: 18,
    rtoLoss: 75,
    description: '0% referral commission. Profit depends strictly on supplier price, courier shipping, and customer RTO returns.',
  },
  {
    id: 'amazon',
    name: 'Amazon India (Easy Ship)',
    referral: 12, // typical apparel/lifestyle referral
    closing: 20,
    shipping: 85,
    rtoRate: 15,
    rtoLoss: 90,
    description: 'Referral fee (8-15%) + fixed closing fee (₹5-25) + Easy Ship national delivery + 18% GST on fees.',
  },
  {
    id: 'flipkart',
    name: 'Flipkart (Marketplace)',
    referral: 10,
    closing: 15,
    shipping: 70,
    rtoRate: 16,
    rtoLoss: 80,
    description: 'Commission fee + fixed closing fee + collection payment gateway fee (2%) + courier logistics.',
  },
  {
    id: 'custom',
    name: 'Custom Marketplace',
    referral: 10,
    closing: 10,
    shipping: 60,
    rtoRate: 12,
    rtoLoss: 70,
    description: 'Custom fee configuration for Nykaa, Myntra, JioMart, or specialized niche marketplaces.',
  },
];

export const MarketplaceProfitCalculator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom'>('amazon');
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('999');
  const [costPriceInput, setCostPriceInput] = useState<string>('400');
  const [referralPercentInput, setReferralPercentInput] = useState<string>('12');
  const [closingFeeInput, setClosingFeeInput] = useState<string>('20');
  const [shippingFeeInput, setShippingFeeInput] = useState<string>('85');
  const [packagingFeeInput, setPackagingFeeInput] = useState<string>('20');
  const [otherExpensesInput, setOtherExpensesInput] = useState<string>('15');
  const [rtoRateInput, setRtoRateInput] = useState<string>('15');
  const [rtoLossPerUnitInput, setRtoLossPerUnitInput] = useState<string>('90');
  const [adSpendInput, setAdSpendInput] = useState<string>('50');
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (id: 'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom') => {
    setSelectedPreset(id);
    const p = MARKETPLACE_PRESETS.find((m) => m.id === id);
    if (p) {
      setReferralPercentInput(p.referral.toString());
      setClosingFeeInput(p.closing.toString());
      setShippingFeeInput(p.shipping.toString());
      setRtoRateInput(p.rtoRate.toString());
      setRtoLossPerUnitInput(p.rtoLoss.toString());
    }
  };

  const safeSelling = parsePositiveNumber(sellingPriceInput, 0);
  const safeCost = parsePositiveNumber(costPriceInput, 0);
  const safeRef = Math.max(0, Math.min(60, parsePositiveNumber(referralPercentInput, 0)));
  const safeClose = parsePositiveNumber(closingFeeInput, 0);
  const safeShip = parsePositiveNumber(shippingFeeInput, 0);
  const safePack = parsePositiveNumber(packagingFeeInput, 0);
  const safeOther = parsePositiveNumber(otherExpensesInput, 0);
  const safeRtoRate = Math.max(0, Math.min(100, parsePositiveNumber(rtoRateInput, 0)));
  const safeRtoLoss = parsePositiveNumber(rtoLossPerUnitInput, 0);
  const safeAd = parsePositiveNumber(adSpendInput, 0);

  // Exact Indian marketplace taxation & deduction math
  const referralCommission = (safeSelling * safeRef) / 100;
  // 18% GST applies to marketplace commission and closing fee services
  const gstOnServices = (referralCommission + safeClose) * 0.18;
  const totalMarketplaceDeductions = referralCommission + safeClose + gstOnServices;

  // Expected RTO buffer loss absorbed per successfully delivered unit
  const rtoBufferPerUnit = (safeRtoRate / 100) * safeRtoLoss;

  // Payout deposited by marketplace into seller bank before product cost
  const netBankPayout = Math.max(0, safeSelling - totalMarketplaceDeductions - safeShip);

  // Net Profit
  const totalSellerOperatingCosts = safeCost + safePack + safeOther + rtoBufferPerUnit + safeAd;
  const netProfit = safeSelling - totalMarketplaceDeductions - safeShip - totalSellerOperatingCosts;
  const netMarginPercent = safeSelling > 0 ? (netProfit / safeSelling) * 100 : 0;
  const roiOnCost = safeCost > 0 ? (netProfit / safeCost) * 100 : 0;

  const handleCopy = () => {
    const summary = `ProfitCalci Marketplace Payout & Profit Analysis
Marketplace: ${MARKETPLACE_PRESETS.find((m) => m.id === selectedPreset)?.name}
Listing Selling Price: ${formatINR(safeSelling)}
Product Purchase Cost: ${formatINR(safeCost)}
---------------------------------------------
Marketplace Deductions:
- Referral Commission (${safeRef}%): ${formatINR(referralCommission)}
- Fixed Closing Fee: ${formatINR(safeClose)}
- 18% GST on Marketplace Services: ${formatINR(gstOnServices)}
- Forward Courier Shipping: ${formatINR(safeShip)}
---------------------------------------------
NET BANK PAYOUT DEPOSITED: ${formatINR(netBankPayout)}
Seller Operating Deductions:
- Packaging & Labels: ${formatINR(safePack)}
- Other Overhead Expenses: ${formatINR(safeOther)}
- RTO Return Risk Buffer (${safeRtoRate}%): ${formatINR(rtoBufferPerUnit)}
- Ad Spend per Order: ${formatINR(safeAd)}
=============================================
FINAL NET PROFIT IN HAND: ${formatINR(netProfit)}
NET MARGIN: ${netMarginPercent.toFixed(2)}% | ROI ON COST: ${roiOnCost.toFixed(2)}%
Calculated via ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const text = `📊 *ProfitCalci Marketplace Payout & Profit Analysis*
Marketplace: *${MARKETPLACE_PRESETS.find((m) => m.id === selectedPreset)?.name}*
💰 Selling Price: ${formatINR(safeSelling)}
📦 Product Cost: ${formatINR(safeCost)}
🏛️ Referral Fee (${safeRef}%): ${formatINR(referralCommission)}
📌 Closing Fee: ${formatINR(safeClose)}
🚚 Forward Shipping: ${formatINR(safeShip)}
---------------------------------------------
💵 *Net Bank Payout: ${formatINR(netBankPayout)}*
🎉 *NET PROFIT: ${formatINR(netProfit)}*
📈 *Net Margin: ${netMarginPercent.toFixed(2)}%* | ROI: ${roiOnCost.toFixed(2)}%
Calculate your payout: https://profitcalci.in/tool/marketplace-profit-calculator`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              E-Commerce Fee Estimator
            </span>
            <span className="text-xs text-slate-500">Meesho • Amazon India • Flipkart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Marketplace Profit Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Calculate your true net bank payout and in-hand profit after referral fees, closing fees, 18% service GST, shipping, and RTO returns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary' : 'Copy Breakdown'}</span>
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
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Updated with standard seller fee slabs (Amazon Easy Ship, Flipkart, Meesho 0% base commission). You can manually override all referral fees, closing fees, and shipping charges below.</span>
        </span>
      </div>

      {/* Preset Marketplace Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MARKETPLACE_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-3 text-left rounded-xl border transition-all ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="text-sm font-bold">{preset.name.split(' ')[0]}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{preset.description}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mp-selling-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Marketplace Selling Price (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="mp-selling-price"
                  type="number"
                  inputMode="decimal"
                  value={sellingPriceInput}
                  onChange={(e) => setSellingPriceInput(e.target.value)}
                  placeholder="999"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mp-cost-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Purchase Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="mp-cost-price"
                  type="number"
                  inputMode="decimal"
                  value={costPriceInput}
                  onChange={(e) => setCostPriceInput(e.target.value)}
                  placeholder="400"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Marketplace Deductions & Fees
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="mp-referral" className="block text-xs font-medium text-slate-700 mb-1">
                  Referral Fee (%)
                </label>
                <div className="relative">
                  <input
                    id="mp-referral"
                    type="number"
                    value={referralPercentInput}
                    onChange={(e) => setReferralPercentInput(e.target.value)}
                    min="0"
                    max="60"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="mp-closing" className="block text-xs font-medium text-slate-700 mb-1">
                  Closing Fee (₹)
                </label>
                <input
                  id="mp-closing"
                  type="number"
                  value={closingFeeInput}
                  onChange={(e) => setClosingFeeInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="mp-shipping" className="block text-xs font-medium text-slate-700 mb-1">
                  Shipping (₹)
                </label>
                <input
                  id="mp-shipping"
                  type="number"
                  value={shippingFeeInput}
                  onChange={(e) => setShippingFeeInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Packaging & Returns Buffer
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="mp-pack" className="block text-xs font-medium text-slate-700 mb-1">
                  Packaging (₹)
                </label>
                <input
                  id="mp-pack"
                  type="number"
                  value={packagingFeeInput}
                  onChange={(e) => setPackagingFeeInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="mp-other" className="block text-xs font-medium text-slate-700 mb-1">
                  Other Cost (₹)
                </label>
                <input
                  id="mp-other"
                  type="number"
                  value={otherExpensesInput}
                  onChange={(e) => setOtherExpensesInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="mp-rto-rate" className="block text-xs font-medium text-slate-700 mb-1">
                  RTO Rate (%)
                </label>
                <div className="relative">
                  <input
                    id="mp-rto-rate"
                    type="number"
                    value={rtoRateInput}
                    onChange={(e) => setRtoRateInput(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="mp-rto-loss" className="block text-xs font-medium text-slate-700 mb-1">
                  Loss / Return (₹)
                </label>
                <input
                  id="mp-rto-loss"
                  type="number"
                  value={rtoLossPerUnitInput}
                  onChange={(e) => setRtoLossPerUnitInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-md space-y-5 animate-result-pop">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Net In-Hand Profit
              </span>
              <div key={netProfit} className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1 animate-number-pulse">
                {formatINR(netProfit)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Net margin: <span className="font-bold text-white">{netMarginPercent.toFixed(1)}%</span> | ROI: <span className="font-bold text-white">{roiOnCost.toFixed(1)}%</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/80">
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">Bank Settlement</span>
                <span className="text-lg font-bold text-emerald-300">
                  {formatINR(netBankPayout)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Marketplace Payout</span>
              </div>
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">Total Deductions</span>
                <span className="text-lg font-bold text-rose-300">
                  {formatINR(totalMarketplaceDeductions + safeShip)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Fees + Shipping</span>
              </div>
            </div>
          </div>

          {/* Breakdown Sheet */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Exact Payout Breakdown
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Customer Paid (Selling Price)</span>
              <span className="font-semibold text-slate-900">{formatINR(safeSelling)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>Platform Referral ({safeRef}%)</span>
              <span>- {formatINR(referralCommission)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>Closing Fee + 18% GST</span>
              <span>- {formatINR(safeClose + gstOnServices)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>Forward Courier Shipping</span>
              <span>- {formatINR(safeShip)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 font-bold text-emerald-700 bg-emerald-50 px-2 rounded">
              <span>Net Bank Settlement</span>
              <span>{formatINR(netBankPayout)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Less Product Purchase Cost</span>
              <span>- {formatINR(safeCost)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Less Packaging & Overheads</span>
              <span>- {formatINR(safePack + safeOther)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-amber-700">
              <span>RTO Risk Provision ({safeRtoRate}%)</span>
              <span>- {formatINR(rtoBufferPerUnit)}</span>
            </div>
            <div className="flex justify-between py-1 pt-2 font-bold text-sm text-slate-900">
              <span>Net In-Hand Profit</span>
              <span className={netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {formatINR(netProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="marketplace-calc-bottom" format="horizontal" />
    </div>
  );
};
