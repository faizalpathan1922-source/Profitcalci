import React, { useState } from 'react';
import { Target, Copy, Check, Info, AlertTriangle, RefreshCw, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR, parsePositiveNumber, formatNumberIN } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const BreakEvenCalculator: React.FC = () => {
  const [fixedCostsInput, setFixedCostsInput] = useState<string>('');
  const [variableCostInput, setVariableCostInput] = useState<string>('');
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const safeFixed = parsePositiveNumber(fixedCostsInput, 0);
  const safeVariable = parsePositiveNumber(variableCostInput, 0);
  const safeSelling = parsePositiveNumber(sellingPriceInput, 0);

  // Contribution Margin per unit
  const contributionMarginPerUnit = safeSelling - safeVariable;
  const isProfitableUnit = contributionMarginPerUnit > 0;

  let breakEvenUnits = 0;
  let breakEvenRevenue = 0;
  let contributionRatio = 0;

  if (isProfitableUnit) {
    breakEvenUnits = Math.ceil(safeFixed / contributionMarginPerUnit);
    breakEvenRevenue = breakEvenUnits * safeSelling;
    contributionRatio = safeSelling > 0 ? (contributionMarginPerUnit / safeSelling) * 100 : 0;
  }

  const handleCopy = () => {
    const summary = `ProfitCalci Break-Even Analysis
Fixed Costs: ${formatINR(safeFixed)}
Variable Cost / Unit: ${formatINR(safeVariable)}
Selling Price / Unit: ${formatINR(safeSelling)}
=================================
Contribution Margin / Unit: ${formatINR(contributionMarginPerUnit)} (${contributionRatio.toFixed(1)}%)
BREAK-EVEN UNITS: ${formatNumberIN(breakEvenUnits)} units
BREAK-EVEN REVENUE: ${formatINR(breakEvenRevenue)}
=================================
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
              Business Feasibility & Planning
            </span>
            <span className="text-xs text-slate-500">Find No-Profit No-Loss Volume</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Break-even Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Determine exactly how many units you must sell each month to cover fixed rent, salaries, and operational costs.
          </p>
        </div>

        <button
          onClick={handleCopy}
          disabled={!isProfitableUnit}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Analysis' : 'Copy Analysis'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs Column */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Cost & Pricing Inputs
          </h2>

          {/* Fixed Costs */}
          <div>
            <label htmlFor="be-fixed-costs" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Monthly Fixed Costs (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
              <input
                id="be-fixed-costs"
                type="number"
                inputMode="decimal"
                value={fixedCostsInput}
                onChange={(e) => setFixedCostsInput(e.target.value)}
                placeholder="0.00"
                min="0"
                className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Include shop/warehouse rent, fixed staff salaries, software tools, electricity, and loan EMIs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Variable Cost */}
            <div>
              <label htmlFor="be-variable-cost" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Variable Cost per Product (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="be-variable-cost"
                  type="number"
                  inputMode="decimal"
                  value={variableCostInput}
                  onChange={(e) => setVariableCostInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Purchase price, courier, packaging bag, and labels per order.
              </p>
            </div>

            {/* Selling Price */}
            <div>
              <label htmlFor="be-selling-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price per Product (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="be-selling-price"
                  type="number"
                  inputMode="decimal"
                  value={sellingPriceInput}
                  onChange={(e) => setSellingPriceInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Price collected from the customer or marketplace payout.
              </p>
            </div>
          </div>

          {!isProfitableUnit && safeSelling > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-bold">Cannot break even: </span>
                Your selling price ({formatINR(safeSelling)}) is lower than or equal to your variable cost ({formatINR(safeVariable)}). You are losing {formatINR(Math.abs(contributionMarginPerUnit))} on every sale before covering fixed costs.
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Break-Even Volume Required
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {isProfitableUnit ? `${formatNumberIN(breakEvenUnits)} Units` : 'N/A'}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isProfitableUnit
                  ? `Sell at least ${formatNumberIN(breakEvenUnits)} units/month to avoid operating loss`
                  : 'Positive unit margin needed to calculate break-even'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-300 block">Break-even Revenue</span>
                <span className="text-lg font-bold text-emerald-400">
                  {isProfitableUnit ? formatINR(breakEvenRevenue) : '₹0'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Gross turnover</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-300 block">Unit Contribution</span>
                <span className="text-lg font-bold text-white">
                  {formatINR(contributionMarginPerUnit)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  ({contributionRatio.toFixed(1)}% Ratio)
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              Step-by-Step Proof
            </h3>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Contribution Margin</span>
                <span className="font-semibold text-slate-900">
                  {formatINR(safeSelling)} - {formatINR(safeVariable)} = {formatINR(contributionMarginPerUnit)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Break-even Formula</span>
                <span className="font-mono text-slate-900 font-medium">
                  {formatINR(safeFixed)} / {formatINR(contributionMarginPerUnit)}
                </span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900">
                <span>Resulting Target</span>
                <span className="text-emerald-700">{formatNumberIN(breakEvenUnits)} units ({formatINR(breakEvenRevenue)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="breakeven-calc-bottom" format="horizontal" />
    </div>
  );
};
