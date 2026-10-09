import React, { useState } from 'react';
import { Calculator, Copy, Check, ArrowRightLeft, Printer, RefreshCw, Info, BookOpen, HelpCircle, Share2 } from 'lucide-react';
import { formatINR, parseSafeNumber, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

const PRESET_SLABS = [
  { label: '0% (Exempt)', value: 0 },
  { label: '3% (Gold/Jewellery)', value: 3 },
  { label: '5% (Apparel/Spices)', value: 5 },
  { label: '12% (Footwear/Kitchen)', value: 12 },
  { label: '18% (Electronics/Services)', value: 18 },
  { label: '28% (Luxury/Auto)', value: 28 },
];

export const GstCalculator: React.FC = () => {
  const [amountInput, setAmountInput] = useState<string>('10000');
  const [rate, setRate] = useState<number>(18);
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [customRateVal, setCustomRateVal] = useState<string>('18');
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeRate = isCustomRate
    ? Math.max(0, Math.min(100, parsePositiveNumber(customRateVal, 18)))
    : rate;
  const safeAmount = parsePositiveNumber(amountInput, 0);

  // Calculations
  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === 'exclusive') {
    // Add GST to base amount
    baseAmount = Math.round(safeAmount * 100) / 100;
    gstAmount = Math.round(((baseAmount * activeRate) / 100) * 100) / 100;
    totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;
  } else {
    // GST Inclusive: Extract GST from total amount
    totalAmount = Math.round(safeAmount * 100) / 100;
    baseAmount = Math.round((safeAmount / (1 + activeRate / 100)) * 100) / 100;
    gstAmount = Math.round((totalAmount - baseAmount) * 100) / 100;
  }

  const cgst = isInterState ? 0 : Math.round((gstAmount / 2) * 100) / 100;
  const sgst = isInterState ? 0 : Math.round((gstAmount / 2) * 100) / 100;
  const igst = isInterState ? gstAmount : 0;

  const basePercent = totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 100;
  const gstPercent = totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0;

  const handleCopySummary = () => {
    const summary = `ProfitCalci GST Calculation
Mode: GST ${mode === 'exclusive' ? 'Exclusive (Added to Base)' : 'Inclusive (Extracted from MRP)'}
Tax Rate: ${activeRate}% (${isInterState ? 'Inter-State IGST' : 'Intra-State CGST+SGST'})
Base / Net Amount: ${formatINR(baseAmount)}
GST Amount: ${formatINR(gstAmount)}
${isInterState ? `IGST (${activeRate}%): ${formatINR(igst)}` : `CGST (${activeRate / 2}%): ${formatINR(cgst)}\nSGST (${activeRate / 2}%): ${formatINR(sgst)}`}
Total Gross Amount: ${formatINR(totalAmount)}
Calculated on ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const text = `🧾 *ProfitCalci GST Tax Calculation*
Mode: *GST ${mode === 'exclusive' ? 'Exclusive (Added to Base)' : 'Inclusive (Extracted from MRP)'}*
Tax Rate: ${activeRate}% (${isInterState ? 'Inter-State IGST' : 'Intra-State CGST+SGST'})
💰 Net Base Amount: ${formatINR(baseAmount)}
🏛️ Total GST Amount: ${formatINR(gstAmount)}
${isInterState ? `• IGST (${activeRate}%): ${formatINR(igst)}` : `• CGST (${activeRate / 2}%): ${formatINR(cgst)}\n• SGST (${activeRate / 2}%): ${formatINR(sgst)}`}
----------------------------
💵 *Total Gross Amount: ${formatINR(totalAmount)}*
Calculated via ProfitCalci: https://profitcalci.in/tool/gst-calculator`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Free Indian Tax Calculator
            </span>
            <span className="text-xs text-slate-500">Updated for FY 2025-26</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            GST Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Calculate GST inclusive and exclusive prices, CGST, SGST, and IGST for invoices and products.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
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
            <span className="hidden sm:inline">Print Receipt</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Calculation Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('exclusive')}
                className={`py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                  mode === 'exclusive'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GST Exclusive
                <span className="block text-[11px] font-normal text-slate-500">
                  Add GST to Base Amount
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('inclusive')}
                className={`py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                  mode === 'inclusive'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GST Inclusive
                <span className="block text-[11px] font-normal text-slate-500">
                  Extract GST from MRP
                </span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="gst-amount-input" className="text-sm font-semibold text-slate-800">
                {mode === 'exclusive' ? 'Base Amount (Excluding GST)' : 'Total Amount / MRP (Including GST)'}
              </label>
              <span className="text-xs text-slate-500">In Indian Rupees (₹)</span>
            </div>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold text-lg">₹</span>
              </div>
              <input
                id="gst-amount-input"
                type="number"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="10000"
                min="0"
                step="any"
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-slate-400 self-center mr-1">Quick:</span>
              {[1000, 5000, 10000, 11800, 50000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountInput(preset.toString())}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  +{formatINR(preset, 0)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setAmountInput('0')}
                className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-md flex items-center gap-1 ml-auto"
              >
                <RefreshCw className="w-3 h-3" /> Clear
              </button>
            </div>
          </div>

          {/* GST Slabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select GST Rate Slab
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_SLABS.map((slab) => {
                const isSelected = !isCustomRate && rate === slab.value;
                return (
                  <button
                    key={slab.value}
                    type="button"
                    onClick={() => {
                      setIsCustomRate(false);
                      setRate(slab.value);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-base font-bold">{slab.value}%</div>
                    <div className="text-[10px] text-slate-500 truncate px-1">
                      {slab.value === 0 ? 'Exempt' : slab.value === 18 ? 'Standard' : `${slab.value}%`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Rate Toggle */}
            <div className="mt-3 flex items-center gap-3">
              <label className="flex items-center text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCustomRate}
                  onChange={(e) => setIsCustomRate(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mr-2"
                />
                Custom GST Slab %
              </label>
              {isCustomRate && (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={customRateVal}
                    onChange={(e) => setCustomRateVal(e.target.value)}
                    placeholder="18"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-slate-500">%</span>
                </div>
              )}
            </div>
          </div>

          {/* Supply Type: Intra-State vs Inter-State */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-sm font-semibold text-slate-800">State of Supply</span>
                <p className="text-xs text-slate-500">
                  {isInterState ? 'Inter-State (Customer in different state) = IGST' : 'Intra-State (Same state) = CGST + SGST (50/50 split)'}
                </p>
              </div>

              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsInterState(false)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    !isInterState ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  CGST + SGST
                </button>
                <button
                  type="button"
                  onClick={() => setIsInterState(true)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isInterState ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  IGST
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Total Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800 animate-result-pop">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  Total Final Amount
                </span>
                <div key={totalAmount} className="text-3xl sm:text-4xl font-extrabold mt-1 text-white tracking-tight animate-number-pulse">
                  {formatINR(totalAmount)}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                GST {activeRate}%
              </span>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-700/80 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Base Price</span>
                <span className="text-lg font-bold text-slate-100">
                  {formatINR(baseAmount)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Total GST Tax</span>
                <span className="text-lg font-bold text-emerald-400">
                  +{formatINR(gstAmount)}
                </span>
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Base ({basePercent.toFixed(1)}%)</span>
                <span>Tax ({gstPercent.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-slate-300 h-full transition-all duration-300"
                  style={{ width: `${basePercent}%` }}
                />
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${gstPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Tax Breakdown</span>
              <span className="text-xs font-normal text-slate-500">
                {isInterState ? 'Inter-State' : 'Intra-State'}
              </span>
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Taxable Base Amount</span>
                <span className="font-semibold text-slate-900">{formatINR(baseAmount)}</span>
              </div>

              {isInterState ? (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Integrated GST (IGST @ {activeRate}%)</span>
                  <span className="font-semibold text-emerald-700">{formatINR(igst)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Central GST (CGST @ {activeRate / 2}%)</span>
                    <span className="font-semibold text-emerald-700">{formatINR(cgst)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">State GST (SGST @ {activeRate / 2}%)</span>
                    <span className="font-semibold text-emerald-700">{formatINR(sgst)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between py-2 pt-3 font-bold text-slate-900 text-base">
                <span>Invoice Total</span>
                <span className="text-emerald-700">{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Formula Note */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Calculation Formula:</span>
              {mode === 'exclusive' ? (
                <span>
                  GST Amount = (Base Amount × {activeRate}) ÷ 100 = <strong>{formatINR(gstAmount)}</strong>.
                  Total = Base + GST.
                </span>
              ) : (
                <span>
                  Base Amount = Total ÷ (1 + {activeRate}/100) = <strong>{formatINR(baseAmount)}</strong>.
                  GST Amount = Total − Base Amount.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AdSense Unit */}
      <AdSenseBanner slot="7841209341" format="horizontal" />

      {/* Comprehensive Editorial & Educational Guide (AdSense Content Depth) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed no-print">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            GST Compliance & Billing Guide
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Understanding Goods and Services Tax (GST) for Indian Businesses
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Statutory rules, tax calculation formulas, and slab classifications updated for FY 2025-26.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">
            What is the Difference Between Inclusive and Exclusive GST?
          </h3>
          <p>
            When quoting prices to clients or listing products on e-commerce platforms like Amazon, Flipkart, or Meesho, you will encounter two primary pricing approaches:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 text-sm block">1. GST Exclusive (B2B Standard)</strong>
              <p className="text-xs text-slate-600">
                The quoted rate represents only the basic cost of goods or services. The applicable tax is added separately on top.
              </p>
              <div className="p-2 bg-white rounded border border-slate-200 text-xs font-mono text-emerald-800">
                Gross = Base + (Base × GST Rate ÷ 100)
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 text-sm block">2. GST Inclusive (MRP & Consumer Retail)</strong>
              <p className="text-xs text-slate-600">
                The Maximum Retail Price (MRP) already includes the tax amount. You reverse-calculate to find the taxable value.
              </p>
              <div className="p-2 bg-white rounded border border-slate-200 text-xs font-mono text-emerald-800">
                Base = Total ÷ (1 + GST Rate ÷ 100)
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            Intra-State vs Inter-State Supply: CGST, SGST & IGST
          </h3>
          <p>
            The Indian Goods and Services Tax framework classifies all transactions based on the geographical relationship between the Supplier's Registered Location and the Customer's Place of Supply:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600">
            <li>
              <strong>Intra-State Supply (Same State):</strong> When both parties belong to the same state (e.g. seller in Mumbai, buyer in Pune), the tax is shared equally between the Central Government (<strong>CGST</strong>) and the State Government (<strong>SGST</strong>). For an 18% slab, 9% is CGST and 9% is SGST.
            </li>
            <li>
              <strong>Inter-State Supply (Different States / UTs):</strong> When the buyer and seller reside in different states (e.g. seller in Surat, Gujarat and buyer in Delhi), Integrated GST (<strong>IGST</strong>) applies at the full 18% rate.
            </li>
          </ul>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            Overview of Standard GST Tax Slabs in India
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Slab Rate</th>
                  <th className="p-2.5">Representative Goods & Commodities</th>
                  <th className="p-2.5">Common HSN/SAC Codes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">0% (Nil / Exempt)</td>
                  <td className="p-2.5">Fresh milk, eggs, unbranded grains, fresh fruits, vegetables</td>
                  <td className="p-2.5 font-mono">0401, 0701, 1006</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">3% (Special)</td>
                  <td className="p-2.5">Gold jewellery, silver, precious stones and imitation jewellery</td>
                  <td className="p-2.5 font-mono">7113, 7117</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">5% (Essential)</td>
                  <td className="p-2.5">Apparel below ₹1,000, cotton sarees, spices, tea, footwear below ₹1,000</td>
                  <td className="p-2.5 font-mono">6204, 0904, 6402</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">12% (Standard I)</td>
                  <td className="p-2.5">Processed food, stainless steel kitchenware, apparel above ₹1,000</td>
                  <td className="p-2.5 font-mono">7323, 6101</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">18% (Standard II)</td>
                  <td className="p-2.5">Electronics, phone accessories, cosmetics, hair oils, IT and digital services</td>
                  <td className="p-2.5 font-mono">8504, 3304, 9983</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-800">28% (Luxury / De-merit)</td>
                  <td className="p-2.5">Air conditioners, luxury motorcars, aerated beverages, cement</td>
                  <td className="p-2.5 font-mono">8415, 8703</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
