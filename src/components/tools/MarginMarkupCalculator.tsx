import React, { useState } from 'react';
import { Percent, ArrowRightLeft, Copy, Check, Info } from 'lucide-react';
import { formatINR, parseSafeNumber } from '../../utils/formatters';

export const MarginMarkupCalculator: React.FC = () => {
  const [cost, setCost] = useState<number>(500);
  const [markupPercent, setMarkupPercent] = useState<number>(40);
  const [copied, setCopied] = useState<boolean>(false);

  const safeCost = Math.max(0, parseSafeNumber(cost, 0));
  const safeMarkup = Math.max(0, parseSafeNumber(markupPercent, 0));

  // Calculations
  // Markup % = (Profit / Cost) * 100
  // Margin % = (Profit / Selling Price) * 100
  const profitAmount = (safeCost * safeMarkup) / 100;
  const sellingPrice = safeCost + profitAmount;
  const marginPercent = sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0;

  const handleCopy = () => {
    const summary = `ProfitCalci Margin vs Markup Calculation:
Cost Price: ${formatINR(safeCost)}
Markup on Cost: ${safeMarkup}%
Selling Price: ${formatINR(sellingPrice)}
Gross Profit: ${formatINR(profitAmount)}
Profit Margin on Sale: ${marginPercent.toFixed(2)}%
Calculated via ProfitCalci (profitcalci.in)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Wholesale & Pricing Math
            </span>
            <span className="text-xs text-slate-500">Markup vs Profit Margin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Margin & Markup Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Instantly convert between cost markup percentage and final revenue margin percentage for wholesale deals.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Result'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Input */}
        <div className="md:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label htmlFor="markup-cost-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cost of Goods (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
              <input
                id="markup-cost-price"
                type="number"
                inputMode="decimal"
                value={cost || ''}
                onChange={(e) => setCost(Number(e.target.value))}
                placeholder="500"
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="markup-percent-input" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cost Markup Percentage (%)
              </label>
              <span className="text-xs font-bold text-emerald-700">{safeMarkup}%</span>
            </div>
            <div className="relative">
              <input
                id="markup-percent-input"
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 font-bold">%</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-400 self-center">Presets:</span>
            {[20, 30, 40, 50, 100].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarkupPercent(m)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                +{m}%
              </button>
            ))}
          </div>

          {/* Key difference explainer */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Markup vs Margin Rule:</span>
            </div>
            <p>
              • <strong>Markup</strong> is the percentage added to the <em>Cost Price</em>.
            </p>
            <p>
              • <strong>Margin</strong> is the profit percentage earned from the <em>Selling Price</em>.
            </p>
            <p className="text-amber-800 font-semibold pt-1">
              Example: 100% markup on ₹100 gives ₹200 selling price, which is exactly a 50% margin.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-6 space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800 animate-result-pop">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
              Resulting Selling Price
            </span>
            <div key={sellingPrice} className="text-4xl font-extrabold mt-1 text-white tracking-tight animate-number-pulse">
              {formatINR(sellingPrice)}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Gross Profit</span>
                <span className="text-lg font-bold text-emerald-400">
                  +{formatINR(profitAmount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Profit Margin on Sale</span>
                <span className="text-lg font-bold text-slate-100">
                  {marginPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-sm">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Conversion Summary
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Product Cost</span>
              <span className="font-medium text-slate-900">{formatINR(safeCost)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Markup Applied</span>
              <span className="font-bold text-emerald-700">+{safeMarkup}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">Effective Profit Margin</span>
              <span className="font-bold text-slate-900">{marginPercent.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between py-1.5 pt-2 text-base font-bold text-slate-900">
              <span>Customer Invoiced Price</span>
              <span className="text-emerald-700">{formatINR(sellingPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
