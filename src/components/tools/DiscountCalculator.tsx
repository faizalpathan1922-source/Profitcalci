import React, { useState } from 'react';
import { Percent, Copy, Check, Info, RefreshCw, Tag, HelpCircle, ArrowRight } from 'lucide-react';
import { formatINR, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const DiscountCalculator: React.FC = () => {
  const [originalPriceInput, setOriginalPriceInput] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountPercentInput, setDiscountPercentInput] = useState<string>('');
  const [flatDiscountInput, setFlatDiscountInput] = useState<string>('');
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [copied, setCopied] = useState<boolean>(false);

  const safeOriginal = parsePositiveNumber(originalPriceInput, 0);
  const safeQty = Math.max(1, parsePositiveNumber(quantityInput, 1));

  let discountAmountPerUnit = 0;
  let finalPricePerUnit = 0;
  let effectivePercent = 0;

  if (discountType === 'percent') {
    const safePercent = Math.max(0, Math.min(100, parsePositiveNumber(discountPercentInput, 0)));
    effectivePercent = safePercent;
    discountAmountPerUnit = Math.round(((safeOriginal * safePercent) / 100) * 100) / 100;
    finalPricePerUnit = Math.max(0, Math.round((safeOriginal - discountAmountPerUnit) * 100) / 100);
  } else {
    const safeFlat = parsePositiveNumber(flatDiscountInput, 0);
    discountAmountPerUnit = Math.min(safeOriginal, safeFlat);
    finalPricePerUnit = Math.max(0, Math.round((safeOriginal - discountAmountPerUnit) * 100) / 100);
    effectivePercent = safeOriginal > 0 ? (discountAmountPerUnit / safeOriginal) * 100 : 0;
  }

  const totalOriginal = safeOriginal * safeQty;
  const totalDiscount = discountAmountPerUnit * safeQty;
  const totalFinalPrice = finalPricePerUnit * safeQty;

  const handleCopy = () => {
    const summary = `ProfitCalci Discount Calculation
Original Price: ${formatINR(safeOriginal)}
Discount: ${discountType === 'percent' ? `${effectivePercent}%` : formatINR(discountAmountPerUnit)} (${effectivePercent.toFixed(1)}% OFF)
---------------------------------
You Save: ${formatINR(discountAmountPerUnit)}
Final Discounted Price: ${formatINR(finalPricePerUnit)}
${safeQty > 1 ? `Total for ${safeQty} items: ${formatINR(totalFinalPrice)} (Total Savings: ${formatINR(totalDiscount)})` : ''}
Calculated via ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Instant Price Reduction Tool
            </span>
            <span className="text-xs text-slate-500">Retail, Sale & Bulk Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discount Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Calculate exact customer savings and final sale price for retail sales, festive promotions, and clearances.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Discount Mode
          </label>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setDiscountType('percent')}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                discountType === 'percent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Percentage Discount (%)
            </button>
            <button
              type="button"
              onClick={() => setDiscountType('flat')}
              className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                discountType === 'flat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Flat Amount Off (₹)
            </button>
          </div>

          {/* Original Price */}
          <div>
            <label htmlFor="disc-original-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Original Price / MRP (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
              <input
                id="disc-original-price"
                type="number"
                inputMode="decimal"
                value={originalPriceInput}
                onChange={(e) => setOriginalPriceInput(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Discount Value */}
          {discountType === 'percent' ? (
            <div>
              <label htmlFor="disc-percent-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Discount Percentage (%)
              </label>
              <div className="relative">
                <input
                  id="disc-percent-input"
                  type="number"
                  inputMode="decimal"
                  value={discountPercentInput}
                  onChange={(e) => setDiscountPercentInput(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="any"
                  className="w-full pl-4 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 font-bold text-lg">%</span>
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-xs text-slate-400 self-center mr-1">Quick Slabs:</span>
                {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercentInput(pct.toString())}
                    className="px-2 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md"
                  >
                    {pct}% OFF
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="disc-flat-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Flat Discount Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="disc-flat-input"
                  type="number"
                  inputMode="decimal"
                  value={flatDiscountInput}
                  onChange={(e) => setFlatDiscountInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label htmlFor="disc-qty-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Quantity / Pieces (Optional)
            </label>
            <input
              id="disc-qty-input"
              type="number"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-md space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Final Discounted Price
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {formatINR(finalPricePerUnit)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Per unit price after {effectivePercent.toFixed(1)}% discount reduction
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/80">
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">Total You Save</span>
                <span className="text-lg font-bold text-emerald-300">
                  {formatINR(discountAmountPerUnit)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  ({effectivePercent.toFixed(1)}% Off)
                </span>
              </div>
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">Original MRP</span>
                <span className="text-lg font-bold text-slate-200 line-through">
                  {formatINR(safeOriginal)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Before discount</span>
              </div>
            </div>

            {safeQty > 1 && (
              <div className="pt-2 border-t border-emerald-800/80">
                <div className="flex justify-between text-xs text-emerald-200">
                  <span>Total for {safeQty} items:</span>
                  <span className="font-bold text-white text-sm">{formatINR(totalFinalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-300 mt-1">
                  <span>Total Customer Savings:</span>
                  <span className="font-bold text-emerald-300">{formatINR(totalDiscount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Proof */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              Calculation Breakdown
            </h3>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Original Price</span>
                <span className="font-semibold text-slate-900">{formatINR(safeOriginal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Discount Applied</span>
                <span className="font-semibold text-emerald-700">
                  - {formatINR(discountAmountPerUnit)} ({effectivePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900">
                <span>Customer Pays</span>
                <span>{formatINR(finalPricePerUnit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="discount-calc-bottom" format="horizontal" />
    </div>
  );
};
