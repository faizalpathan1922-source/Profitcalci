import React, { useState } from 'react';
import { TrendingUp, Copy, Check, AlertTriangle, ShieldCheck, DollarSign, Info, RefreshCw, BookOpen, AlertCircle, Share2, Printer, Download } from 'lucide-react';
import { formatINR, parseSafeNumber, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

interface PlatformPreset {
  id: 'general' | 'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom';
  name: string;
  referralPercent: number;
  closingFee: number;
  shippingEstimate: number;
  description: string;
}

const PLATFORMS: PlatformPreset[] = [
  {
    id: 'general',
    name: 'General / Retail / Direct',
    referralPercent: 0,
    closingFee: 0,
    shippingEstimate: 50,
    description: 'Direct sales, retail shop, or wholesale orders without platform fees.',
  },
  {
    id: 'shopify',
    name: 'Shopify / D2C Store',
    referralPercent: 2,
    closingFee: 0,
    shippingEstimate: 60,
    description: 'Shopify D2C website with PG charges (Razorpay/Cashfree 2%), ad spends, and courier shipping.',
  },
  {
    id: 'meesho',
    name: 'Meesho',
    referralPercent: 0, // Meesho boasts 0% commission on most categories
    closingFee: 0,
    shippingEstimate: 75,
    description: '0% commission model. Payout affected mainly by shipping & RTO returns.',
  },
  {
    id: 'amazon',
    name: 'Amazon India',
    referralPercent: 12,
    closingFee: 20,
    shippingEstimate: 85,
    description: 'Referral fee (8-15%) + Closing fee (₹5-25) + Easy Ship.',
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    referralPercent: 10,
    closingFee: 15,
    shippingEstimate: 70,
    description: 'Commission + Fixed fee + Collection fee + Shipping.',
  },
];

export const ProfitCalculator: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'general' | 'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom'>('general');
  const [sellingPrice, setSellingPrice] = useState<string>('800');
  const [costPrice, setCostPrice] = useState<string>('500');
  const [referralPercent, setReferralPercent] = useState<string>('0');
  const [closingFee, setClosingFee] = useState<string>('0');
  const [shippingFee, setShippingFee] = useState<string>('50');
  const [packagingFee, setPackagingFee] = useState<string>('20');
  const [otherExpenses, setOtherExpenses] = useState<string>('30');
  const [rtoPercent, setRtoPercent] = useState<string>('0'); // 0% for general sale
  const [rtoLossPerUnit, setRtoLossPerUnit] = useState<string>('80');
  const [adSpend, setAdSpend] = useState<string>('0');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handlePlatformChange = (pId: 'general' | 'meesho' | 'amazon' | 'flipkart' | 'shopify' | 'custom') => {
    setSelectedPlatform(pId);
    const p = PLATFORMS.find((item) => item.id === pId);
    if (p) {
      setReferralPercent(p.referralPercent.toString());
      setClosingFee(p.closingFee.toString());
      setShippingFee(p.shippingEstimate.toString());
      if (pId === 'general') {
        setRtoPercent('0');
      } else if (pId === 'shopify') {
        setRtoPercent('10');
      } else {
        setRtoPercent('15');
      }
    }
  };

  const safeSelling = parsePositiveNumber(sellingPrice, 0);
  const safeCost = parsePositiveNumber(costPrice, 0);
  const safeRef = Math.max(0, Math.min(100, parsePositiveNumber(referralPercent, 0)));
  const safeClose = parsePositiveNumber(closingFee, 0);
  const safeShip = parsePositiveNumber(shippingFee, 0);
  const safePack = parsePositiveNumber(packagingFee, 0);
  const safeOther = parsePositiveNumber(otherExpenses, 0);
  const safeRtoRate = Math.max(0, Math.min(100, parsePositiveNumber(rtoPercent, 0)));
  const safeRtoLoss = parsePositiveNumber(rtoLossPerUnit, 0);
  const safeAd = parsePositiveNumber(adSpend, 0);

  // Calculations
  const marketplaceCommission = (safeSelling * safeRef) / 100;
  // 18% GST applies to marketplace referral & closing fee services in India
  const gstOnMarketplaceFees = (marketplaceCommission + safeClose) * 0.18;
  const totalMarketplaceCharges = marketplaceCommission + safeClose + gstOnMarketplaceFees;

  // Expected RTO buffer absorbed per delivered order:
  const rtoBufferPerOrder = (safeRtoRate / 100) * safeRtoLoss;

  const totalDeliveryAndPackaging = safeShip + safePack;
  const totalDeductionsExcludingCost = totalMarketplaceCharges + totalDeliveryAndPackaging + safeOther + rtoBufferPerOrder + safeAd;
  const totalAllCosts = safeCost + totalDeductionsExcludingCost;

  // Net Payout deposited into bank by marketplace before product cost
  const netPayoutFromPlatform = safeSelling - totalMarketplaceCharges - safeShip;

  // Net profit in hand
  const netProfit = safeSelling - totalAllCosts;
  const netMarginPercent = safeSelling > 0 ? (netProfit / safeSelling) * 100 : 0;
  const markupPercent = totalAllCosts > 0 ? (netProfit / totalAllCosts) * 100 : 0;
  const roiPercent = safeCost > 0 ? (netProfit / safeCost) * 100 : 0;

  // Health assessment
  let healthColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let healthText = 'Healthy Profit Margin';
  if (netProfit < 0) {
    healthColor = 'text-rose-700 bg-rose-50 border-rose-200';
    healthText = 'Loss Alert! You are losing money on this price.';
  } else if (netMarginPercent < 10) {
    healthColor = 'text-amber-700 bg-amber-50 border-amber-200';
    healthText = 'Low Margin Risk! Even a small spike in RTO will cause loss.';
  } else if (netMarginPercent < 20) {
    healthColor = 'text-blue-700 bg-blue-50 border-blue-200';
    healthText = 'Moderate Margin. Decent for high volume commodities.';
  }

  const handleCopy = () => {
    const summary = `ProfitCalci Marketplace Profit Calculation
Platform: ${PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
Selling Price: ${formatINR(safeSelling)}
Product Cost: ${formatINR(safeCost)}
Platform Fees & GST: ${formatINR(totalMarketplaceCharges)}
Shipping & Packaging: ${formatINR(totalDeliveryAndPackaging)}
RTO Return Buffer (${safeRtoRate}%): ${formatINR(rtoBufferPerOrder)}
Net Bank Payout: ${formatINR(netPayoutFromPlatform)}
-------------------------
NET PROFIT: ${formatINR(netProfit)}
NET MARGIN: ${netMarginPercent.toFixed(2)}%
ROI on Cost: ${roiPercent.toFixed(2)}%
Calculated on ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const platformName = PLATFORMS.find((p) => p.id === selectedPlatform)?.name || selectedPlatform;
    const dateStr = new Date().toISOString().split('T')[0];

    const rows: [string, string | number][] = [
      ['Report', 'ProfitCalci Marketplace Profit Calculation'],
      ['Platform', platformName],
      ['Calculation Date', dateStr],
      ['Selling Price (INR)', safeSelling.toFixed(2)],
      ['Product Purchase Cost (INR)', safeCost.toFixed(2)],
      ['Gross Profit (INR)', (safeSelling - safeCost).toFixed(2)],
      ['Gross Margin %', safeSelling > 0 ? (((safeSelling - safeCost) / safeSelling) * 100).toFixed(2) + '%' : '0%'],
      ['Platform Commission %', `${safeRef}%`],
      ['Platform Referral Fee (INR)', marketplaceCommission.toFixed(2)],
      ['Fixed Closing Fee (INR)', safeClose.toFixed(2)],
      ['GST on Platform Fees (18%) (INR)', gstOnMarketplaceFees.toFixed(2)],
      ['Total Platform Deductions (INR)', totalMarketplaceCharges.toFixed(2)],
      ['Courier Shipping Freight (INR)', safeShip.toFixed(2)],
      ['Packaging Box & Material (INR)', safePack.toFixed(2)],
      ['Total Logistics & Packaging (INR)', totalDeliveryAndPackaging.toFixed(2)],
      ['Ad Spend / Marketing per Unit (INR)', safeAd.toFixed(2)],
      ['Other Overhead Expenses (INR)', safeOther.toFixed(2)],
      ['Expected RTO Return Rate %', `${safeRtoRate}%`],
      ['RTO Freight Loss Per Return Unit (INR)', safeRtoLoss.toFixed(2)],
      ['RTO Risk Buffer Absorbed per Order (INR)', rtoBufferPerOrder.toFixed(2)],
      ['Total Non-Product Deductions (INR)', totalDeductionsExcludingCost.toFixed(2)],
      ['Total Landed Cost per Order (INR)', totalAllCosts.toFixed(2)],
      ['Net Platform Bank Payout (INR)', netPayoutFromPlatform.toFixed(2)],
      ['Net Clean Profit in Hand (INR)', netProfit.toFixed(2)],
      ['Net Profit Margin %', `${netMarginPercent.toFixed(2)}%`],
      ['Markup on Landed Cost %', `${markupPercent.toFixed(2)}%`],
      ['Return on Investment (ROI) on Cost %', `${roiPercent.toFixed(2)}%`],
      ['Profitability Assessment Status', healthText],
    ];

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `profit-calculator-${selectedPlatform}-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const getWhatsAppShareUrl = () => {
    const text = `📊 *ProfitCalci Profit & Payout Calculation*
Platform: *${PLATFORMS.find((p) => p.id === selectedPlatform)?.name}*
💰 Selling Price: ${formatINR(safeSelling)}
📦 Product Cost: ${formatINR(safeCost)}
🏛️ Platform Fees & GST: ${formatINR(totalMarketplaceCharges)}
🚚 Shipping & Packaging: ${formatINR(totalDeliveryAndPackaging)}
🔄 RTO Return Buffer (${safeRtoRate}%): ${formatINR(rtoBufferPerOrder)}
💵 Net Bank Payout: *${formatINR(netPayoutFromPlatform)}*
---------------------------------------------
🎉 *NET PROFIT: ${formatINR(netProfit)}*
📈 *NET MARGIN: ${netMarginPercent.toFixed(2)}%*
📊 ROI on Cost: ${roiPercent.toFixed(2)}%
Calculated via ProfitCalci: https://profitcalci.in/tool/profit-calculator`;
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
              E-Commerce Margin Tool
            </span>
            <span className="text-xs text-slate-500">Includes RTO & Shipping Buffer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketplace Profit Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Calculate your actual net profit after referral fees, closing fees, courier shipping, packaging, and RTO returns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Breakdown' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            title="Download calculation breakdown as CSV"
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
            <span>Share on WhatsApp</span>
          </a>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
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
          <span>Updated with standard seller fee slabs (Amazon Easy Ship, Flipkart, Meesho 0% base commission, Shopify D2C). You can manually override all fees below.</span>
        </span>
      </div>

      {/* Platform Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => handlePlatformChange(platform.id)}
                className={`py-3 px-3 text-center rounded-xl transition-all border ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-600'
                    : 'border-transparent hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <div className="text-sm sm:text-base font-bold">{platform.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {platform.referralPercent}% commission
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Details */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Selling Price */}
            <div>
              <label htmlFor="selling-price-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price on App (₹)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="selling-price-input"
                  type="number"
                  inputMode="decimal"
                  value={sellingPrice || ''}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="699"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Customer listing price</span>
            </div>

            {/* Cost of Goods */}
            <div>
              <label htmlFor="cost-price-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Cost / Purchase (₹)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="cost-price-input"
                  type="number"
                  inputMode="decimal"
                  value={costPrice || ''}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="250"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">What you paid supplier / factory</span>
            </div>
          </div>

          {/* Platform Fees */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Platform & Marketplace Deductions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="referral-fee-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Referral Commission (%)
                </label>
                <div className="relative">
                  <input
                    id="referral-fee-input"
                    type="number"
                    value={referralPercent}
                    onChange={(e) => setReferralPercent(e.target.value)}
                    min="0"
                    step="0.5"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>

              <div>
                <label htmlFor="closing-fee-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Fixed / Closing Fee (₹)
                </label>
                <div className="relative">
                  <input
                    id="closing-fee-input"
                    type="number"
                    value={closingFee}
                    onChange={(e) => setClosingFee(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics, Packaging & Other Expenses */}
          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Fulfillment, Packaging & Other Expenses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="shipping-fee-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Courier / Shipping (₹)
                </label>
                <input
                  id="shipping-fee-input"
                  type="number"
                  inputMode="decimal"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="packaging-fee-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Box / Packaging (₹)
                </label>
                <input
                  id="packaging-fee-input"
                  type="number"
                  inputMode="decimal"
                  value={packagingFee}
                  onChange={(e) => setPackagingFee(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="other-expenses-input" className="block text-xs font-medium text-slate-700 mb-1">
                  Other Expenses (₹)
                </label>
                <input
                  id="other-expenses-input"
                  type="number"
                  inputMode="decimal"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  min="0"
                  placeholder="30"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* RTO & Return Overhead (Vital for Indian Sellers) */}
          <div className="pt-3 border-t border-slate-100 bg-amber-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl border-amber-100">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                COD Return (RTO) Risk Buffer
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-1.5 py-0.2 rounded">
                Crucial for India
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rto-rate-input" className="block text-xs font-medium text-amber-900 mb-1">
                  Expected RTO Rate (%)
                </label>
                <div className="relative">
                  <input
                    id="rto-rate-input"
                    type="number"
                    value={rtoPercent}
                    onChange={(e) => setRtoPercent(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block">Usually 15-25% for Indian COD</span>
              </div>

              <div>
                <label htmlFor="rto-loss-input" className="block text-xs font-medium text-amber-900 mb-1">
                  Return Courier Loss (₹)
                </label>
                <div className="relative">
                  <input
                    id="rto-loss-input"
                    type="number"
                    value={rtoLossPerUnit}
                    onChange={(e) => setRtoLossPerUnit(e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">₹</span>
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block">Freight lost when order returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Net Profit Big Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 animate-result-pop">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Net Profit Per Order
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span key={netProfit} className={`text-3xl sm:text-4xl font-extrabold tracking-tight animate-number-pulse inline-block ${netProfit >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {formatINR(netProfit)}
              </span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                netMarginPercent >= 20 ? 'bg-emerald-500/20 text-emerald-300' :
                netMarginPercent >= 10 ? 'bg-blue-500/20 text-blue-300' :
                netMarginPercent >= 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {netMarginPercent.toFixed(1)}% margin
              </span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Bank Payout</span>
                <span className="text-base font-bold text-slate-100">
                  {formatINR(netPayoutFromPlatform)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">ROI on Cost</span>
                <span className="text-base font-bold text-emerald-400">
                  {roiPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Margin Health Status Badge */}
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
                  ? `You pocket ${formatINR(netProfit)} clean for every successful delivery.`
                  : `Increase selling price or negotiate cost price by at least ${formatINR(Math.abs(netProfit))}.`}
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Per-Order Cost Analysis</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Product Purchase Cost</span>
                <span className="font-medium text-slate-900">{formatINR(safeCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Platform Referral + Closing Fee</span>
                <span className="font-medium text-slate-700">
                  {formatINR(marketplaceCommission + safeClose)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">18% GST on Platform Fees</span>
                <span className="font-medium text-slate-700">{formatINR(gstOnMarketplaceFees)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Courier Shipping</span>
                <span className="font-medium text-slate-700">{formatINR(safeShip)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Packaging Box & Label</span>
                <span className="font-medium text-slate-700">{formatINR(safePack)}</span>
              </div>
              {safeOther > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Other Overhead Expenses</span>
                  <span className="font-medium text-slate-700">{formatINR(safeOther)}</span>
                </div>
              )}
              {safeRtoRate > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-amber-800">RTO Return Provision ({safeRtoRate}%)</span>
                  <span className="font-medium text-amber-800">+{formatINR(rtoBufferPerOrder)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Total Cost Per Unit</span>
                <span className="font-bold text-slate-800">{formatINR(totalAllCosts)}</span>
              </div>
              <div className="flex justify-between py-2 pt-2.5 text-base font-bold text-slate-900">
                <span>Net Clean Profit</span>
                <span className={netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                  {formatINR(netProfit)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs text-slate-500">
                <span>Net Profit Margin (on Selling Price)</span>
                <span className="font-bold text-slate-800">{netMarginPercent.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-1 text-xs text-slate-500">
                <span>Markup (on Total Cost)</span>
                <span className="font-bold text-slate-800">{markupPercent.toFixed(2)}%</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between no-print">
              <span className="text-xs text-slate-500">Need this report offline?</span>
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

      {/* Comprehensive E-commerce Profitability Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed no-print">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            E-Commerce Masterclass
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            How to Calculate Real Net Profit on Indian E-Commerce Marketplaces
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Understanding referral commissions, closing fees, shipping weight slabs, and Cash on Delivery (COD) RTO overheads.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">
            The Danger of "Top-line Sales" vs "Bank Payout"
          </h3>
          <p>
            Many new online merchants in India celebrate high gross merchandise values (GMV) on platforms like Meesho, Amazon India, or Flipkart without realizing that hidden platform deductions can wipe out up to 40% of their selling price.
          </p>
          <p>
            A typical customer order involves five separate deduction layers before reaching your bank account:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">1. Category Referral Fee (Commission)</strong>
              Varies from 0% on Meesho to 8%-15% on Amazon and Flipkart depending on whether you sell ethnic wear, footwear, or electronics.
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">2. Fixed Closing Fee</strong>
              A tiered administrative processing fee levied per dispatched order (e.g. ₹5 to ₹25 per unit on Amazon Easy Ship).
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">3. 18% GST on Marketplace Services</strong>
              All referral fees, closing fees, and logistics fees charged by platforms attract an 18% GST deduction.
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <strong className="text-slate-900 block mb-1">4. Logistics & Dead Weight Charges</strong>
              Courier charges based on the higher of dead scale weight or volumetric weight (length × breadth × height ÷ 5000).
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            The Indian COD RTO Problem: Why You Must Factor in Return Loss
          </h3>
          <p>
            In the Indian retail market, 60% to 75% of customer orders are placed using <strong>Cash on Delivery (COD)</strong>. Approximately 15% to 25% of these parcels return undelivered because the customer was unavailable, refused delivery, or found the product elsewhere.
          </p>
          <p>
            When a parcel becomes an <strong>RTO (Return to Origin)</strong>, the seller still pays two-way courier shipping or a reverse logistics penalty (typically ₹70 to ₹90) with zero customer revenue collected.
          </p>
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1 text-emerald-950">
            <strong className="text-sm text-emerald-900 block">The Golden ProfitCalci RTO Formula:</strong>
            <p>
              Expected RTO Loss Per Order = <strong>(RTO Rate % ÷ 100) × Return Shipping Freight</strong>
            </p>
            <p className="text-emerald-800">
              If your return rate is 20% and courier freight is ₹80, every single delivered item must absorb <strong>₹16</strong> in return overhead to keep your overall business profitable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
