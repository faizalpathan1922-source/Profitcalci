import React, { useState } from 'react';
import { ShoppingBag, Copy, Check, Download, AlertTriangle, ShieldCheck, Info, Share2, Printer, Percent, DollarSign, HelpCircle, Truck, PackageCheck, Target } from 'lucide-react';
import { formatINR, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

interface ShopifyPlan {
  name: string;
  transactionFeePercent: number; // Shopify 3rd party PG extra fee
  monthlyCostINR: number;
}

const SHOPIFY_PLANS: Record<string, ShopifyPlan> = {
  basic: { name: 'Basic Shopify', transactionFeePercent: 2.0, monthlyCostINR: 1994 },
  shopify: { name: 'Shopify (Standard)', transactionFeePercent: 1.0, monthlyCostINR: 7447 },
  advanced: { name: 'Advanced Shopify', transactionFeePercent: 0.5, monthlyCostINR: 30164 },
  shopifyPayments: { name: 'Shopify Payments / Manual (0%)', transactionFeePercent: 0, monthlyCostINR: 1994 },
};

export const ShopifyCalculator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [sellingPrice, setSellingPrice] = useState<string>('1299');
  const [costPrice, setCostPrice] = useState<string>('450');
  const [adSpendPerOrder, setAdSpendPerOrder] = useState<string>('300'); // CAC
  const [shippingFee, setShippingFee] = useState<string>('70');
  const [packagingFee, setPackagingFee] = useState<string>('25');
  const [pgFeePercent, setPgFeePercent] = useState<string>('2'); // Razorpay/Cashfree
  const [codSharePercent, setCodSharePercent] = useState<string>('60'); // 60% COD, 40% Prepaid
  const [codHandlingFee, setCodHandlingFee] = useState<string>('35'); // Courier charges extra for COD
  const [rtoPercent, setRtoPercent] = useState<string>('15'); // 15% COD RTO
  const [rtoLossPerUnit, setRtoLossPerUnit] = useState<string>('85');
  const [otherOverheads, setOtherOverheads] = useState<string>('20');

  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  // Safe parsed numbers
  const safeSelling = parsePositiveNumber(sellingPrice, 0);
  const safeCost = parsePositiveNumber(costPrice, 0);
  const safeAd = parsePositiveNumber(adSpendPerOrder, 0);
  const safeShip = parsePositiveNumber(shippingFee, 0);
  const safePack = parsePositiveNumber(packagingFee, 0);
  const safePgRate = Math.max(0, Math.min(10, parsePositiveNumber(pgFeePercent, 2)));
  const safeCodShare = Math.max(0, Math.min(100, parsePositiveNumber(codSharePercent, 60)));
  const safeCodFee = parsePositiveNumber(codHandlingFee, 0);
  const safeRtoRate = Math.max(0, Math.min(100, parsePositiveNumber(rtoPercent, 15)));
  const safeRtoLoss = parsePositiveNumber(rtoLossPerUnit, 85);
  const safeOther = parsePositiveNumber(otherOverheads, 0);

  const plan = SHOPIFY_PLANS[selectedPlan] || SHOPIFY_PLANS.basic;

  // 1. Transaction & Payment Gateway charges
  const pgFee = (safeSelling * safePgRate) / 100;
  const gstOnPgFee = pgFee * 0.18; // 18% GST on payment gateway
  const shopifyTransactionFee = (safeSelling * plan.transactionFeePercent) / 100;
  const totalPaymentAndPlatformFees = pgFee + gstOnPgFee + shopifyTransactionFee;

  // 2. COD extra handling absorbed per order (weighted average by COD share)
  const effectiveCodHandling = (safeCodShare / 100) * safeCodFee;

  // 3. RTO Buffer absorbed per order (RTO applies primarily to COD orders)
  const codRtoEffectiveRate = (safeCodShare / 100) * (safeRtoRate / 100);
  const rtoBufferPerOrder = codRtoEffectiveRate * safeRtoLoss;

  // 4. Logistics & Materials
  const totalFulfillment = safeShip + safePack + effectiveCodHandling;

  // 5. Total Non-COGS costs
  const totalNonCogsCosts = totalPaymentAndPlatformFees + totalFulfillment + safeAd + safeOther + rtoBufferPerOrder;
  const totalAllCosts = safeCost + totalNonCogsCosts;

  // 6. Net Profit & Margins
  const netProfit = safeSelling - totalAllCosts;
  const netMarginPercent = safeSelling > 0 ? (netProfit / safeSelling) * 100 : 0;
  const grossProfit = safeSelling - safeCost;
  const grossMarginPercent = safeSelling > 0 ? (grossProfit / safeSelling) * 100 : 0;
  const markupPercent = totalAllCosts > 0 ? (netProfit / totalAllCosts) * 100 : 0;
  const roiPercent = safeCost > 0 ? (netProfit / safeCost) * 100 : 0;

  // Break-even ROAS (Return On Ad Spend) = Selling Price / (Selling Price - Non-Ad Costs)
  const costsExcludingAd = totalAllCosts - safeAd;
  const contributionBeforeAd = safeSelling - costsExcludingAd;
  const breakEvenRoas = contributionBeforeAd > 0 ? safeSelling / contributionBeforeAd : 0;
  const actualRoas = safeAd > 0 ? safeSelling / safeAd : 0;

  // Health assessment
  let healthColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let healthText = 'Healthy D2C Profit Margin';
  if (netProfit < 0) {
    healthColor = 'text-rose-700 bg-rose-50 border-rose-200';
    healthText = 'Loss Alert! Your Customer Acquisition Cost (CAC) or product cost exceeds margin.';
  } else if (netMarginPercent < 12) {
    healthColor = 'text-amber-700 bg-amber-50 border-amber-200';
    healthText = 'Thin D2C Margin! High risk if Facebook/Meta ad CAC fluctuates.';
  } else if (netMarginPercent < 22) {
    healthColor = 'text-blue-700 bg-blue-50 border-blue-200';
    healthText = 'Standard D2C Margin. Healthy scaling range for e-commerce brands.';
  }

  const handleCopy = () => {
    const summary = `Shopify D2C Profit Calculation
Plan: ${plan.name}
Selling Price: ${formatINR(safeSelling)}
COGS (Product Cost): ${formatINR(safeCost)}
Ad CAC Spend: ${formatINR(safeAd)} (ROAS: ${actualRoas > 0 ? actualRoas.toFixed(2) + 'x' : 'N/A'})
Payment Gateway & Shopify Fee: ${formatINR(totalPaymentAndPlatformFees)}
Shipping & Packaging: ${formatINR(totalFulfillment)}
COD RTO Buffer: ${formatINR(rtoBufferPerOrder)}
-------------------------
TOTAL COST: ${formatINR(totalAllCosts)}
NET PROFIT: ${formatINR(netProfit)}
NET MARGIN: ${netMarginPercent.toFixed(2)}%
BREAK-EVEN ROAS: ${breakEvenRoas > 0 ? breakEvenRoas.toFixed(2) + 'x' : 'N/A'}
Calculated via ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const rows: [string, string | number][] = [
      ['Report', 'ProfitCalci Shopify D2C Profit Breakdown'],
      ['Shopify Plan', plan.name],
      ['Calculation Date', dateStr],
      ['Selling Price (INR)', safeSelling.toFixed(2)],
      ['Product Sourcing Cost / COGS (INR)', safeCost.toFixed(2)],
      ['Gross Profit (INR)', grossProfit.toFixed(2)],
      ['Gross Margin %', `${grossMarginPercent.toFixed(2)}%`],
      ['Customer Acquisition Cost / Ad Spend (INR)', safeAd.toFixed(2)],
      ['Actual ROAS', actualRoas > 0 ? `${actualRoas.toFixed(2)}x` : 'N/A'],
      ['Break-even ROAS Required', breakEvenRoas > 0 ? `${breakEvenRoas.toFixed(2)}x` : 'N/A'],
      ['Payment Gateway Fee (2%) (INR)', pgFee.toFixed(2)],
      ['18% GST on PG Fee (INR)', gstOnPgFee.toFixed(2)],
      ['Shopify Transaction Fee (INR)', shopifyTransactionFee.toFixed(2)],
      ['Total Payment & Shopify Deductions (INR)', totalPaymentAndPlatformFees.toFixed(2)],
      ['Forward Courier Shipping (INR)', safeShip.toFixed(2)],
      ['Packaging & Unboxing Box (INR)', safePack.toFixed(2)],
      ['COD Share %', `${safeCodShare}%`],
      ['COD Extra Handling Fee per Order (INR)', effectiveCodHandling.toFixed(2)],
      ['Expected COD RTO Rate %', `${safeRtoRate}%`],
      ['RTO Freight Loss Per Unit (INR)', safeRtoLoss.toFixed(2)],
      ['Effective RTO Provision Absorbed (INR)', rtoBufferPerOrder.toFixed(2)],
      ['Other Brand Overheads (INR)', safeOther.toFixed(2)],
      ['Total All Landed Costs (INR)', totalAllCosts.toFixed(2)],
      ['Net Profit per Order (INR)', netProfit.toFixed(2)],
      ['Net Profit Margin %', `${netMarginPercent.toFixed(2)}%`],
      ['Markup on Cost %', `${markupPercent.toFixed(2)}%`],
      ['ROI %', `${roiPercent.toFixed(2)}%`],
      ['Status', healthText],
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shopify-profit-calculator-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const getWhatsAppShareUrl = () => {
    const text = `🛍️ *Shopify D2C Store Profit Calculation*
Plan: *${plan.name}*
💰 Selling Price: ${formatINR(safeSelling)}
📦 COGS (Cost): ${formatINR(safeCost)}
📣 Ad CAC: ${formatINR(safeAd)}
💳 PG & Platform Fee: ${formatINR(totalPaymentAndPlatformFees)}
🚚 Shipping & Packaging: ${formatINR(totalFulfillment)}
🔄 COD RTO Buffer: ${formatINR(rtoBufferPerOrder)}
---------------------------------
🎉 *NET PROFIT: ${formatINR(netProfit)} (${netMarginPercent.toFixed(1)}%)*
🎯 Target Break-even ROAS: *${breakEvenRoas.toFixed(2)}x*
Calculated on ProfitCalci: https://profitcalci.in/tool/shopify-calculator`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              D2C Brand Suite
            </span>
            <span className="text-xs text-slate-500">Shopify • Ad CAC • ROAS • RTO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-600" />
            Shopify Profit Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Calculate your exact D2C net profit factoring in Meta/Google Ad CAC, Razorpay payment gateway, courier shipping, COD fees, and COD RTO returns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Download Shopify calculation as CSV"
          >
            {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-emerald-600" />}
            <span>{downloaded ? 'CSV Downloaded' : 'Download as CSV'}</span>
          </button>
          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs"
            title="Share on WhatsApp"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Share</span>
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Plan selection */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Select Your Shopify Plan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(SHOPIFY_PLANS).map(([key, item]) => {
            const isSelected = selectedPlan === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPlan(key)}
                className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold ring-1 ring-emerald-600 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="text-xs sm:text-sm font-bold">{item.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.transactionFeePercent > 0 ? `${item.transactionFeePercent}% fee on 3P PG` : '0% Shopify fee'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Details */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Selling Price & COGS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="shopify-price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price on Shopify (₹)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="shopify-price"
                  type="number"
                  inputMode="decimal"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="1299"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Customer checkout price (incl. GST)</span>
            </div>

            <div>
              <label htmlFor="shopify-cost" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Cost / Sourcing (₹)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="shopify-cost"
                  type="number"
                  inputMode="decimal"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="450"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Your purchase / factory manufacturing cost</span>
            </div>
          </div>

          {/* Ad Spend & Marketing (CAC) */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              Marketing & Ad Spend (CAC)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="shopify-ad-spend" className="block text-xs font-medium text-slate-700 mb-1">
                  Ad Spend per Acquired Order (CAC) (₹)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                  <input
                    id="shopify-ad-spend"
                    type="number"
                    inputMode="decimal"
                    value={adSpendPerOrder}
                    onChange={(e) => setAdSpendPerOrder(e.target.value)}
                    placeholder="300"
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Meta / Google Ads cost per purchase</span>
              </div>

              <div>
                <label htmlFor="shopify-pg-rate" className="block text-xs font-medium text-slate-700 mb-1">
                  Payment Gateway Fee (%)
                </label>
                <div className="relative">
                  <input
                    id="shopify-pg-rate"
                    type="number"
                    value={pgFeePercent}
                    onChange={(e) => setPgFeePercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Razorpay / Cashfree usually ~2% + 18% GST</span>
              </div>
            </div>
          </div>

          {/* Shipping, Packaging & COD */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              Shipping, Packaging & COD Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="shopify-ship" className="block text-xs font-medium text-slate-700 mb-1">
                  Courier Shipping (₹)
                </label>
                <input
                  id="shopify-ship"
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Delhivery / Shiprocket</span>
              </div>

              <div>
                <label htmlFor="shopify-pack" className="block text-xs font-medium text-slate-700 mb-1">
                  Box & Packaging (₹)
                </label>
                <input
                  id="shopify-pack"
                  type="number"
                  value={packagingFee}
                  onChange={(e) => setPackagingFee(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Box, tape, thank you card</span>
              </div>

              <div>
                <label htmlFor="shopify-other" className="block text-xs font-medium text-slate-700 mb-1">
                  Other Expenses (₹)
                </label>
                <input
                  id="shopify-other"
                  type="number"
                  value={otherOverheads}
                  onChange={(e) => setOtherOverheads(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Apps, domains, buffer</span>
              </div>
            </div>

            {/* COD Specifics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
              <div>
                <label htmlFor="shopify-cod-share" className="block text-xs font-medium text-slate-700 mb-1">
                  COD Orders Share (%)
                </label>
                <div className="relative">
                  <input
                    id="shopify-cod-share"
                    type="number"
                    min="0"
                    max="100"
                    value={codSharePercent}
                    onChange={(e) => setCodSharePercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">E.g. 60% COD vs 40% Prepaid</span>
              </div>

              <div>
                <label htmlFor="shopify-cod-fee" className="block text-xs font-medium text-slate-700 mb-1">
                  COD Handling Fee (₹)
                </label>
                <div className="relative">
                  <input
                    id="shopify-cod-fee"
                    type="number"
                    value={codHandlingFee}
                    onChange={(e) => setCodHandlingFee(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">₹</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Courier cash collection surcharge</span>
              </div>
            </div>
          </div>

          {/* RTO Risk Section */}
          <div className="pt-3 border-t border-amber-200 bg-amber-50/60 -mx-5 -mb-5 p-5 rounded-b-2xl">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                COD Return to Origin (RTO) Provision
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="shopify-rto-rate" className="block text-xs font-medium text-amber-900 mb-1">
                  Expected COD RTO Rate (%)
                </label>
                <div className="relative">
                  <input
                    id="shopify-rto-rate"
                    type="number"
                    min="0"
                    max="100"
                    value={rtoPercent}
                    onChange={(e) => setRtoPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-amber-700 mt-0.5 block">Indian D2C average is 15% - 25%</span>
              </div>

              <div>
                <label htmlFor="shopify-rto-loss" className="block text-xs font-medium text-amber-900 mb-1">
                  Reverse Freight Loss per Return (₹)
                </label>
                <div className="relative">
                  <input
                    id="shopify-rto-loss"
                    type="number"
                    value={rtoLossPerUnit}
                    onChange={(e) => setRtoLossPerUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">₹</span>
                </div>
                <span className="text-[10px] text-amber-700 mt-0.5 block">Forward + return courier charges lost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Profit Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 animate-result-pop">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Net In-Hand Profit Per Delivered Order
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span key={netProfit} className={`text-3xl sm:text-4xl font-extrabold tracking-tight animate-number-pulse ${netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {formatINR(netProfit)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                netMarginPercent >= 20 ? 'bg-emerald-500/20 text-emerald-300' :
                netMarginPercent >= 10 ? 'bg-blue-500/20 text-blue-300' :
                netMarginPercent >= 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {netMarginPercent.toFixed(1)}% margin
              </span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Required Break-Even ROAS</span>
                <span className="text-base font-bold text-amber-300">
                  {breakEvenRoas > 0 ? `${breakEvenRoas.toFixed(2)}x` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Actual ROAS</span>
                <span className="text-base font-bold text-emerald-400">
                  {actualRoas > 0 ? `${actualRoas.toFixed(2)}x` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Health status */}
          <div className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${healthColor}`}>
            {netProfit >= 0 ? (
              <ShieldCheck className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
            )}
            <div>
              <span className="font-bold block">{healthText}</span>
              <span className="text-xs opacity-90 block mt-0.5">
                {netProfit >= 0
                  ? `Your store generates ${formatINR(netProfit)} net after ad CAC and courier charges.`
                  : `You are losing money on every order. Aim for a lower CAC or higher bundle cart value.`}
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Per-Order Unit Economics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Product Sourcing (COGS)</span>
                <span className="font-medium text-slate-900">{formatINR(safeCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Ad CAC (Meta / Google)</span>
                <span className="font-medium text-slate-900">{formatINR(safeAd)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Payment Gateway + 18% GST</span>
                <span className="font-medium text-slate-700">{formatINR(pgFee + gstOnPgFee)}</span>
              </div>
              {plan.transactionFeePercent > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Shopify Fee ({plan.transactionFeePercent}%)</span>
                  <span className="font-medium text-slate-700">{formatINR(shopifyTransactionFee)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Courier Shipping + Packaging</span>
                <span className="font-medium text-slate-700">{formatINR(safeShip + safePack)}</span>
              </div>
              {effectiveCodHandling > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Weighted COD Handling Fee</span>
                  <span className="font-medium text-slate-700">{formatINR(effectiveCodHandling)}</span>
                </div>
              )}
              {rtoBufferPerOrder > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-amber-800">Absorbed COD RTO Buffer</span>
                  <span className="font-medium text-amber-800">+{formatINR(rtoBufferPerOrder)}</span>
                </div>
              )}
              {safeOther > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Apps & Brand Overheads</span>
                  <span className="font-medium text-slate-700">{formatINR(safeOther)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Total Landed Cost</span>
                <span className="font-bold text-slate-800">{formatINR(totalAllCosts)}</span>
              </div>
              <div className="flex justify-between py-2 pt-2.5 text-base font-bold text-slate-900">
                <span>Net Clean Profit</span>
                <span className={netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                  {formatINR(netProfit)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs text-slate-500">
                <span>Net Margin (on Selling Price)</span>
                <span className="font-bold text-slate-800">{netMarginPercent.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-1 text-xs text-slate-500">
                <span>Markup on All Costs</span>
                <span className="font-bold text-slate-800">{markupPercent.toFixed(2)}%</span>
              </div>
            </div>

            {/* Offline CSV Download */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              <span className="text-xs text-slate-500">Need this breakdown offline?</span>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloaded ? 'Downloaded CSV' : 'Download as CSV'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AdSense Placement */}
      <AdSenseBanner slot="9012485721" format="horizontal" />

      {/* Shopify D2C Best Practices Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-sm text-slate-700 leading-relaxed no-print">
        <h2 className="text-xl font-bold text-slate-900">How to Master Shopify D2C Unit Economics in India</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">1. Keep CAC under 30%</h3>
            <p className="text-xs text-slate-600">
              For healthy profitability, aim for your Customer Acquisition Cost (CAC) on Meta/Instagram to stay under 30% of average order value (AOV).
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">2. Incentivize Prepaid</h3>
            <p className="text-xs text-slate-600">
              Offer a ₹50-₹100 discount or a free gift for prepaid payments via UPI/cards to slash RTO returns and save ₹30+ COD handling fees.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">3. Bundle to Increase AOV</h3>
            <p className="text-xs text-slate-600">
              Courier freight (₹60-80) is nearly the same for 1 item or 2 items. Selling packs of 2 or 3 increases contribution margin dramatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
