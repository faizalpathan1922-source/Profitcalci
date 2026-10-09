import React, { useState } from 'react';
import { AlertTriangle, Copy, Check, Info, ShieldAlert, RefreshCw, HelpCircle, ArrowRight, TrendingDown } from 'lucide-react';
import { formatINR, parsePositiveNumber, formatNumberIN } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const ReturnLossCalculator: React.FC = () => {
  const [monthlyOrdersInput, setMonthlyOrdersInput] = useState<string>('');
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('');
  const [costPriceInput, setCostPriceInput] = useState<string>('');
  const [returnRateInput, setReturnRateInput] = useState<string>('');
  const [twoWayFreightInput, setTwoWayFreightInput] = useState<string>('');
  const [packagingLossInput, setPackagingLossInput] = useState<string>('');
  const [damagedPercentInput, setDamagedPercentInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const safeOrders = Math.max(1, parsePositiveNumber(monthlyOrdersInput, 1));
  const safeSelling = parsePositiveNumber(sellingPriceInput, 0);
  const safeCost = parsePositiveNumber(costPriceInput, 0);
  const safeReturnRate = Math.max(0, Math.min(100, parsePositiveNumber(returnRateInput, 0)));
  const safeTwoWayFreight = parsePositiveNumber(twoWayFreightInput, 0);
  const safePackagingLoss = parsePositiveNumber(packagingLossInput, 0);
  const safeDamagedPercent = Math.max(0, Math.min(100, parsePositiveNumber(damagedPercentInput, 0)));

  // Return counts
  const returnOrdersCount = Math.round((safeOrders * safeReturnRate) / 100);
  const deliveredOrdersCount = safeOrders - returnOrdersCount;
  const damagedUnitsCount = Math.round((returnOrdersCount * safeDamagedPercent) / 100);

  // Financial Losses
  const totalFreightLoss = returnOrdersCount * safeTwoWayFreight;
  const totalPackagingLoss = returnOrdersCount * safePackagingLoss;
  const totalDamagedInventoryLoss = damagedUnitsCount * safeCost;

  const totalMonthlyLoss = totalFreightLoss + totalPackagingLoss + totalDamagedInventoryLoss;
  const totalAnnualLoss = totalMonthlyLoss * 12;
  const averageLossPerReturn = returnOrdersCount > 0 ? totalMonthlyLoss / returnOrdersCount : 0;
  const returnLossTaxOnDeliveredOrders = deliveredOrdersCount > 0 ? totalMonthlyLoss / deliveredOrdersCount : 0;

  const handleCopy = () => {
    const summary = `ProfitCalci Return & RTO Loss Audit
Monthly Orders Dispatched: ${formatNumberIN(safeOrders)}
Return Rate: ${safeReturnRate}% (${formatNumberIN(returnOrdersCount)} returns/month)
-----------------------------------------------
MONTHLY LOSS BREAKDOWN:
- Courier Freight Wasted (2-way): ${formatINR(totalFreightLoss)}
- Packaging & Box Waste: ${formatINR(totalPackagingLoss)}
- Damaged / Unsellable Goods (${formatNumberIN(damagedUnitsCount)} units): ${formatINR(totalDamagedInventoryLoss)}
===============================================
TOTAL MONTHLY RETURN FINANCIAL DRAIN: ${formatINR(totalMonthlyLoss)}
PROJECTED ANNUALIZED DRAIN: ${formatINR(totalAnnualLoss)}
Average Loss per Return: ${formatINR(averageLossPerReturn)}
Profit Drag on each Delivered Order: -${formatINR(returnLossTaxOnDeliveredOrders)}
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              E-Commerce Risk Audit
            </span>
            <span className="text-xs text-slate-500">RTO Freight • Packaging • Damaged Goods</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Return Loss Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Quantify the true monthly drain caused by customer returns, reverse courier logistics, packaging waste, and damaged stock.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Audit' : 'Copy Audit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Monthly Volume & Product Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rl-orders" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Monthly Orders Dispatched
              </label>
              <input
                id="rl-orders"
                type="number"
                value={monthlyOrdersInput}
                onChange={(e) => setMonthlyOrdersInput(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="rl-rate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Return / RTO Rate (%)
              </label>
              <div className="relative">
                <input
                  id="rl-rate"
                  type="number"
                  value={returnRateInput}
                  onChange={(e) => setReturnRateInput(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-3 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rl-selling-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Average Selling Price (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="rl-selling-price"
                  type="number"
                  value={sellingPriceInput}
                  onChange={(e) => setSellingPriceInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rl-cost-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Purchase Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  id="rl-cost-price"
                  type="number"
                  value={costPriceInput}
                  onChange={(e) => setCostPriceInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Cost Incurred per Return
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="rl-freight" className="block text-xs font-medium text-slate-700 mb-1">
                  2-Way Courier (₹)
                </label>
                <input
                  id="rl-freight"
                  type="number"
                  value={twoWayFreightInput}
                  onChange={(e) => setTwoWayFreightInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="rl-pack" className="block text-xs font-medium text-slate-700 mb-1">
                  Packaging Waste (₹)
                </label>
                <input
                  id="rl-pack"
                  type="number"
                  value={packagingLossInput}
                  onChange={(e) => setPackagingLossInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="rl-damaged" className="block text-xs font-medium text-slate-700 mb-1">
                  Damaged Stock %
                </label>
                <div className="relative">
                  <input
                    id="rl-damaged"
                    type="number"
                    value={damagedPercentInput}
                    onChange={(e) => setDamagedPercentInput(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-rose-950 to-red-900 text-white p-6 rounded-2xl shadow-md space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold">
                Total Monthly Return Drain
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {formatINR(totalMonthlyLoss)}
              </div>
              <p className="text-xs text-rose-200 mt-1">
                Projected annual loss: <span className="font-bold text-white">{formatINR(totalAnnualLoss)}/year</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-rose-800/80">
              <div className="bg-rose-900/60 p-3 rounded-xl">
                <span className="text-[11px] text-rose-200 block">Returns Count</span>
                <span className="text-lg font-bold text-white">
                  {formatNumberIN(returnOrdersCount)} units
                </span>
                <span className="text-[10px] text-rose-300 block mt-0.5">
                  ({safeReturnRate}% of orders)
                </span>
              </div>
              <div className="bg-rose-900/60 p-3 rounded-xl">
                <span className="text-[11px] text-rose-200 block">Average Drain</span>
                <span className="text-lg font-bold text-rose-300">
                  {formatINR(averageLossPerReturn)}
                </span>
                <span className="text-[10px] text-rose-300 block mt-0.5">Per returned parcel</span>
              </div>
            </div>
          </div>

          {/* Breakdown Sheet */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-600">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Drain Breakdown
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Two-Way Courier Shipping Wasted</span>
              <span className="font-semibold text-rose-700">{formatINR(totalFreightLoss)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Packaging Boxes & Flyer Waste</span>
              <span className="font-semibold text-rose-700">{formatINR(totalPackagingLoss)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Damaged Inventory ({damagedUnitsCount} units destroyed)</span>
              <span className="font-semibold text-rose-700">{formatINR(totalDamagedInventoryLoss)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-500">
              <span>Gross Sales Turnover Blocked</span>
              <span>{formatINR(returnOrdersCount * safeSelling)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-slate-900 pt-1 text-sm">
              <span>Profit Surcharge on Delivered Parcels</span>
              <span className="text-rose-600">-{formatINR(returnLossTaxOnDeliveredOrders)} / delivered order</span>
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="return-loss-calc-bottom" format="horizontal" />
    </div>
  );
};
