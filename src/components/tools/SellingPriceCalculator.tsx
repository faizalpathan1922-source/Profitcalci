import React, { useState } from 'react';
import { Tag, Copy, Check, Info, HelpCircle, ArrowRight, ShieldCheck, Sparkles, BookOpen, Share2, Printer } from 'lucide-react';
import { formatINR, parseSafeNumber, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const SellingPriceCalculator: React.FC = () => {
  const [costPrice, setCostPrice] = useState<number>(0);
  const [channel, setChannel] = useState<'direct' | 'marketplace'>('direct');
  const [targetMode, setTargetMode] = useState<'margin' | 'markup' | 'fixed'>('margin');
  const [targetMargin, setTargetMargin] = useState<number>(20); // 20% profit margin
  const [targetMarkup, setTargetMarkup] = useState<number>(20); // 20% markup on cost
  const [targetProfitAmount, setTargetProfitAmount] = useState<number>(0); // Target profit

  // Marketplace & logistics overheads
  const [platformCommission, setPlatformCommission] = useState<number>(0); // 0% for direct
  const [closingFee, setClosingFee] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [packagingFee, setPackagingFee] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [rtoPercent, setRtoPercent] = useState<number>(0);
  const [rtoLoss, setRtoLoss] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const handleChannelChange = (newChannel: 'direct' | 'marketplace') => {
    setChannel(newChannel);
    if (newChannel === 'direct') {
      setPlatformCommission(0);
      setClosingFee(0);
      setRtoPercent(0);
    } else {
      setPlatformCommission(10);
      setClosingFee(15);
      setRtoPercent(15);
    }
  };

  const safeCost = Math.max(0, parsePositiveNumber(costPrice, 0));
  const safeMargin = Math.max(0, Math.min(80, parsePositiveNumber(targetMargin, 20)));
  const safeMarkup = Math.max(0, parsePositiveNumber(targetMarkup, 20));
  const safeFixedProfit = Math.max(0, parsePositiveNumber(targetProfitAmount, 0));
  const safeCommission = channel === 'marketplace' ? Math.max(0, Math.min(50, parsePositiveNumber(platformCommission, 0))) : 0;
  const safeClose = channel === 'marketplace' ? Math.max(0, parsePositiveNumber(closingFee, 0)) : 0;
  const safeShip = Math.max(0, parsePositiveNumber(shippingFee, 0));
  const safePack = Math.max(0, parsePositiveNumber(packagingFee, 0));
  const safeOther = Math.max(0, parsePositiveNumber(otherExpenses, 0));
  const safeRtoPercent = channel === 'marketplace' ? Math.max(0, Math.min(100, parsePositiveNumber(rtoPercent, 0))) : 0;
  const safeRtoLoss = Math.max(0, parsePositiveNumber(rtoLoss, 0));

  // Calculations
  const rtoProvision = (safeRtoPercent / 100) * safeRtoLoss;
  const commissionMultiplier = (safeCommission * 1.18) / 100; // includes 18% GST on marketplace services
  const fixedClosingWithGst = safeClose * 1.18;
  const totalBaseExpenses = safeCost + safeShip + safePack + safeOther + rtoProvision + fixedClosingWithGst;

  let calculatedListingPrice = 0;
  let denominator = 1;

  if (targetMode === 'margin') {
    const marginRatio = safeMargin / 100;
    denominator = 1 - commissionMultiplier - marginRatio;
    if (denominator > 0.02) {
      calculatedListingPrice = Math.round(totalBaseExpenses / denominator);
    } else {
      calculatedListingPrice = 0; // Unachievable margin
    }
  } else if (targetMode === 'markup') {
    // Markup is applied on total costs (Cost + Shipping + Pack + Other)
    const totalCostBasis = safeCost + safeShip + safePack + safeOther;
    const markupProfit = (totalCostBasis * safeMarkup) / 100;
    denominator = 1 - commissionMultiplier;
    if (denominator > 0.02) {
      calculatedListingPrice = Math.round((totalBaseExpenses + markupProfit) / denominator);
    }
  } else {
    // Fixed Rupee Profit target
    denominator = 1 - commissionMultiplier;
    if (denominator > 0.02) {
      calculatedListingPrice = Math.round((totalBaseExpenses + safeFixedProfit) / denominator);
    }
  }

  // Reverse validation based on calculated listing price
  const commDeduction = (calculatedListingPrice * commissionMultiplier);
  const netBankPayout = calculatedListingPrice - commDeduction - fixedClosingWithGst - safeShip;
  const achievedNetProfit = calculatedListingPrice - safeCost - commDeduction - fixedClosingWithGst - safeShip - safePack - safeOther - rtoProvision;
  const achievedMarginPercent = calculatedListingPrice > 0 ? (achievedNetProfit / calculatedListingPrice) * 100 : 0;
  const totalCostsIncurred = safeCost + commDeduction + fixedClosingWithGst + safeShip + safePack + safeOther + rtoProvision;

  const handleCopy = () => {
    const summary = `ProfitCalci Recommended Selling Price
Product Cost: ${formatINR(safeCost)}
Shipping: ${formatINR(safeShip)} | Packaging: ${formatINR(safePack)} | Other: ${formatINR(safeOther)}
Target: ${targetMode === 'margin' ? `${safeMargin}% Margin` : targetMode === 'markup' ? `${safeMarkup}% Markup` : `${formatINR(safeFixedProfit)} Net Profit`}
===============================
RECOMMENDED SELLING PRICE: ${formatINR(calculatedListingPrice)}
EXPECTED NET PROFIT: ${formatINR(achievedNetProfit)} (${achievedMarginPercent.toFixed(1)}% margin)
===============================
Breakdown:
- Total Incurred Costs: ${formatINR(totalCostsIncurred)}
- Platform & Services: ${formatINR(commDeduction + fixedClosingWithGst)}
- Logistics (Forward + RTO): ${formatINR(safeShip + rtoProvision)}
- Packaging & Other: ${formatINR(safePack + safeOther)}
- Net Payout Received: ${formatINR(netBankPayout)}
Calculated via ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const text = `🏷️ *ProfitCalci Selling Price Recommendation*
Product Cost: ${formatINR(safeCost)}
Shipping + Packaging + Other: ${formatINR(safeShip + safePack + safeOther)}
Target Profit: ${targetMode === 'margin' ? `${safeMargin}% Margin` : targetMode === 'markup' ? `${safeMarkup}% Markup` : `${formatINR(safeFixedProfit)} Net Profit`}
---------------------------------------------
🎯 *RECOMMENDED LISTING PRICE: ${formatINR(calculatedListingPrice)}*
💰 *EXPECTED NET PROFIT: ${formatINR(achievedNetProfit)}* (${achievedMarginPercent.toFixed(1)}% margin)
💵 Net Bank Payout: ${formatINR(netBankPayout)}
Calculate your selling price: https://profitcalci.in/tool/selling-price-calculator`;
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
              Reverse Pricing Tool
            </span>
            <span className="text-xs text-slate-500">Solve "What should I price this at?"</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Selling Price Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Enter your product cost and target profit to get the exact marketplace listing price that protects your margins.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Pricing' : 'Copy Recommendation'}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Channel Selector */}
          <div>
            <div className="mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sales Channel
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleChannelChange('direct')}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                  channel === 'direct' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Direct / Retail / Website
                <span className="block text-[11px] font-normal text-slate-500">0% Commission</span>
              </button>
              <button
                type="button"
                onClick={() => handleChannelChange('marketplace')}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                  channel === 'marketplace' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Marketplace (Amazon/Flipkart)
                <span className="block text-[11px] font-normal text-slate-500">Fees & Returns</span>
              </button>
            </div>
          </div>

          {/* Target Profit Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Target Profit Calculation
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTargetMode('margin')}
                className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
                  targetMode === 'margin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Margin (%)
                <span className="hidden sm:block text-[10px] font-normal text-slate-500">on Selling Price</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetMode('markup')}
                className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
                  targetMode === 'markup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Markup (%)
                <span className="hidden sm:block text-[10px] font-normal text-slate-500">on Cost</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetMode('fixed')}
                className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all text-center ${
                  targetMode === 'fixed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Fixed (₹)
                <span className="hidden sm:block text-[10px] font-normal text-slate-500">Rupee Profit</span>
              </button>
            </div>
          </div>

          {/* Primary Cost & Target Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sp-product-cost" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Purchase Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="sp-product-cost"
                  type="number"
                  inputMode="decimal"
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {targetMode === 'margin' ? (
              <div>
                <label htmlFor="sp-target-margin" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Desired Net Margin (%)
                </label>
                <div className="relative">
                  <input
                    id="sp-target-margin"
                    type="number"
                    value={targetMargin}
                    onChange={(e) => setTargetMargin(Number(e.target.value))}
                    min="1"
                    max="90"
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold">%</span>
                </div>
              </div>
            ) : targetMode === 'markup' ? (
              <div>
                <label htmlFor="sp-target-markup" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Desired Markup on Cost (%)
                </label>
                <div className="relative">
                  <input
                    id="sp-target-markup"
                    type="number"
                    value={targetMarkup}
                    onChange={(e) => setTargetMarkup(Number(e.target.value))}
                    min="1"
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold">%</span>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="sp-target-profit" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Desired Net Profit (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                  <input
                    id="sp-target-profit"
                    type="number"
                    value={targetProfitAmount}
                    onChange={(e) => setTargetProfitAmount(Number(e.target.value))}
                    min="1"
                    className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Shipping, Packaging, Other Expenses */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="sp-shipping-fee" className="block text-xs font-medium text-slate-700 mb-1">
                Shipping (₹)
              </label>
              <input
                id="sp-shipping-fee"
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="sp-packaging-fee" className="block text-xs font-medium text-slate-700 mb-1">
                Packaging (₹)
              </label>
              <input
                id="sp-packaging-fee"
                type="number"
                value={packagingFee}
                onChange={(e) => setPackagingFee(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="sp-other-expenses" className="block text-xs font-medium text-slate-700 mb-1">
                Other Expenses (₹)
              </label>
              <input
                id="sp-other-expenses"
                type="number"
                value={otherExpenses}
                onChange={(e) => setOtherExpenses(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Marketplace Specific Overheads (if marketplace selected) */}
          {channel === 'marketplace' && (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Marketplace Deductions & Overheads
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="sp-platform-commission" className="block text-xs font-medium text-slate-700 mb-1">
                    Commission % (Meesho: 0%, Amazon: 8-15%)
                  </label>
                  <div className="relative">
                    <input
                      id="sp-platform-commission"
                      type="number"
                      value={platformCommission}
                      onChange={(e) => setPlatformCommission(Number(e.target.value))}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="sp-closing-fee" className="block text-xs font-medium text-slate-700 mb-1">
                    Fixed Closing Fee (₹)
                  </label>
                  <input
                    id="sp-closing-fee"
                    type="number"
                    value={closingFee}
                    onChange={(e) => setClosingFee(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="sp-rto-percent" className="block text-xs font-medium text-slate-700 mb-1">
                    RTO Return Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      id="sp-rto-percent"
                      type="number"
                      value={rtoPercent}
                      onChange={(e) => setRtoPercent(Number(e.target.value))}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="sp-rto-loss" className="block text-xs font-medium text-slate-700 mb-1">
                    Courier Loss Per Return (₹)
                  </label>
                  <input
                    id="sp-rto-loss"
                    type="number"
                    value={rtoLoss}
                    onChange={(e) => setRtoLoss(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Highlight */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-lg border border-emerald-900/50 animate-result-pop">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Listing Price</span>
            </div>
            <div key={calculatedListingPrice} className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-1 animate-number-pulse">
              {calculatedListingPrice > 0 ? formatINR(calculatedListingPrice, 0) : 'N/A'}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              List at this price on the marketplace to safely achieve your{' '}
              <strong className="text-emerald-300">
                {targetMode === 'margin' ? `${safeMargin}% net margin` : `${formatINR(safeFixedProfit)} net profit`}
              </strong>.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Net Bank Payout</span>
                <span className="text-base font-bold text-slate-100">
                  {formatINR(netBankPayout)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Clean Profit In Hand</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatINR(achievedNetProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Reverse Audit Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-sm">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Audit Breakdown of Recommended Price
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Customer Pays</span>
                <span className="font-bold text-slate-900">{formatINR(calculatedListingPrice)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Marketplace Fees + 18% GST</span>
                <span className="text-rose-600 font-medium">-{formatINR(commDeduction + fixedClosingWithGst)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Shipping & Packaging</span>
                <span className="text-rose-600 font-medium">-{formatINR(safeShip + safePack)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">RTO Buffer ({safeRtoPercent}%)</span>
                <span className="text-rose-600 font-medium">-{formatINR(rtoProvision)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Product Purchase Cost</span>
                <span className="text-rose-600 font-medium">-{formatINR(safeCost)}</span>
              </div>
              <div className="flex justify-between py-2 pt-2.5 font-bold text-base text-slate-900">
                <span>Final Profit Earned</span>
                <span className="text-emerald-700">{formatINR(achievedNetProfit)}</span>
              </div>
            </div>
          </div>

          {/* Quick Rounding Advice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block mb-1">Pricing Psychology Tip:</span>
            Indian buyers on Meesho and Amazon respond best to price points ending in <strong>9</strong> or <strong>99</strong> (e.g. ₹{Math.floor(calculatedListingPrice / 10) * 10 + 9} or ₹{Math.floor(calculatedListingPrice / 100) * 100 + 99}).
          </div>
        </div>
      </div>

      {/* AdSense Unit */}
      <AdSenseBanner slot="6120938471" format="horizontal" />

      {/* Reverse Pricing Mathematical Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed no-print">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Pricing Strategy
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            The Reverse Pricing Model for E-Commerce Sellers
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How to price products mathematically so marketplace deductions don't eat into your planned profits.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">
            The Mathematical Formula for Target Margin
          </h3>
          <p>
            When platform commissions are calculated as a percentage of the final listing price, you cannot simply add fees on top of your purchase cost. Doing so results in a compounding shortfall.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 space-y-2">
            <div>
              <strong>Selling Price (SP) Formula:</strong>
            </div>
            <div className="text-emerald-800 font-bold">
              SP = (Cost + Fixed Logistics + Packaging + RTO Buffer) ÷ [1 − (Commission% × 1.18) − Target Margin%]
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Note that 1.18 represents the 18% GST applicable on all marketplace commission charges in India.
          </p>
        </div>
      </div>
    </div>
  );
};
