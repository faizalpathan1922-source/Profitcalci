import React, { useState } from 'react';
import { Banknote, Copy, Check, Info, AlertTriangle, ShieldCheck, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react';
import { formatINR, parsePositiveNumber, formatNumberIN } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const CodProfitCalculator: React.FC = () => {
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('');
  const [costPriceInput, setCostPriceInput] = useState<string>('');
  const [forwardShipInput, setForwardShipInput] = useState<string>('');
  const [codFeeInput, setCodFeeInput] = useState<string>('');
  const [packagingInput, setPackagingInput] = useState<string>('');
  const [monthlyOrdersInput, setMonthlyOrdersInput] = useState<string>('');
  const [rtoRateInput, setRtoRateInput] = useState<string>('');
  const [reverseShipInput, setReverseShipInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const safeSelling = parsePositiveNumber(sellingPriceInput, 0);
  const safeCost = parsePositiveNumber(costPriceInput, 0);
  const safeForward = parsePositiveNumber(forwardShipInput, 0);
  const safeCodFee = parsePositiveNumber(codFeeInput, 0);
  const safePack = parsePositiveNumber(packagingInput, 0);
  const safeMonthlyOrders = Math.max(1, parsePositiveNumber(monthlyOrdersInput, 1));
  const safeRtoRate = Math.max(0, Math.min(100, parsePositiveNumber(rtoRateInput, 0)));
  const safeReverse = parsePositiveNumber(reverseShipInput, 0);

  // Delivered vs RTO split
  const deliveryRate = 100 - safeRtoRate;
  const deliveredCount = Math.round((safeMonthlyOrders * deliveryRate) / 100);
  const rtoCount = safeMonthlyOrders - deliveredCount;

  // Profit on Delivered Unit:
  // Customer pays selling price. We incur product cost + forward ship + cod collection fee + packaging
  const deliveredCostPerUnit = safeCost + safeForward + safeCodFee + safePack;
  const deliveredProfitPerUnit = safeSelling - deliveredCostPerUnit;
  const totalDeliveredProfit = deliveredCount * deliveredProfitPerUnit;

  // Loss on RTO Unit:
  // Customer rejects at doorstep. Zero revenue collected.
  // We pay forward shipping + reverse return courier + lost/damaged packaging
  const rtoLossPerUnit = safeForward + safeReverse + safePack;
  const totalRtoLoss = rtoCount * rtoLossPerUnit;

  // Net COD Business Performance:
  const netMonthlyProfit = totalDeliveredProfit - totalRtoLoss;
  const netProfitPerDispatchedOrder = safeMonthlyOrders > 0 ? netMonthlyProfit / safeMonthlyOrders : 0;
  const totalRealizedRevenue = deliveredCount * safeSelling;
  const netMarginPercent = totalRealizedRevenue > 0 ? (netMonthlyProfit / totalRealizedRevenue) * 100 : 0;

  const handleCopy = () => {
    const summary = `ProfitCalci Cash-on-Delivery (COD) Profit Analysis
Dispatched Orders: ${formatNumberIN(safeMonthlyOrders)} parcels/month
Selling Price: ${formatINR(safeSelling)} | Product Cost: ${formatINR(safeCost)}
Delivery Rate: ${deliveryRate}% (${formatNumberIN(deliveredCount)} delivered)
RTO Rate: ${safeRtoRate}% (${formatNumberIN(rtoCount)} returned to origin)
-----------------------------------------------
Delivered Profit per Order: ${formatINR(deliveredProfitPerUnit)}
Loss per RTO Return: -${formatINR(rtoLossPerUnit)}
Gross Profit from Deliveries: ${formatINR(totalDeliveredProfit)}
Loss Absorbed from RTO: -${formatINR(totalRtoLoss)}
===============================================
NET MONTHLY COD PROFIT: ${formatINR(netMonthlyProfit)}
NET IN-HAND PROFIT PER DISPATCH: ${formatINR(netProfitPerDispatchedOrder)}
NET PROFIT MARGIN: ${netMarginPercent.toFixed(1)}%
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
              COD Risk & Profit Shield
            </span>
            <span className="text-xs text-slate-500">Shopify • D2C • Courier Aggregators</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            COD Profit Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Calculate your true cash-on-delivery profits after courier COD charges and two-way RTO return freight drains.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Summary' : 'Copy Analysis'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Order & Courier Costs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cod-selling-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                COD Selling Price / Order Value (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="cod-selling-price"
                  type="number"
                  inputMode="decimal"
                  value={sellingPriceInput}
                  onChange={(e) => setSellingPriceInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cod-cost-price" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Purchase Cost (₹)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-lg">₹</span>
                <input
                  id="cod-cost-price"
                  type="number"
                  inputMode="decimal"
                  value={costPriceInput}
                  onChange={(e) => setCostPriceInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Courier Charges */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="cod-forward" className="block text-xs font-medium text-slate-700 mb-1">
                Forward Ship (₹)
              </label>
              <input
                id="cod-forward"
                type="number"
                value={forwardShipInput}
                onChange={(e) => setForwardShipInput(e.target.value)}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="cod-fee" className="block text-xs font-medium text-slate-700 mb-1">
                COD Fee (₹)
              </label>
              <input
                id="cod-fee"
                type="number"
                value={codFeeInput}
                onChange={(e) => setCodFeeInput(e.target.value)}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="cod-pack" className="block text-xs font-medium text-slate-700 mb-1">
                Packaging (₹)
              </label>
              <input
                id="cod-pack"
                type="number"
                value={packagingInput}
                onChange={(e) => setPackagingInput(e.target.value)}
                min="0"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Monthly Dispatches and RTO */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Monthly Volume & Return Rate
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="cod-orders" className="block text-xs font-medium text-slate-700 mb-1">
                  Dispatched Orders
                </label>
                <input
                  id="cod-orders"
                  type="number"
                  value={monthlyOrdersInput}
                  onChange={(e) => setMonthlyOrdersInput(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="cod-rto-rate" className="block text-xs font-medium text-slate-700 mb-1">
                  RTO Return %
                </label>
                <div className="relative">
                  <input
                    id="cod-rto-rate"
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
                <label htmlFor="cod-reverse" className="block text-xs font-medium text-slate-700 mb-1">
                  Reverse Freight (₹)
                </label>
                <input
                  id="cod-reverse"
                  type="number"
                  value={reverseShipInput}
                  onChange={(e) => setReverseShipInput(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-md space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                Net Monthly COD Profit
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                {formatINR(netMonthlyProfit)}
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                {formatINR(netProfitPerDispatchedOrder)} net profit in hand per parcel dispatched ({netMarginPercent.toFixed(1)}% margin)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-800/80">
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">Delivered ({deliveredCount})</span>
                <span className="text-lg font-bold text-emerald-300">
                  +{formatINR(totalDeliveredProfit)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  +{formatINR(deliveredProfitPerUnit)}/order
                </span>
              </div>
              <div className="bg-emerald-800/50 p-3 rounded-xl">
                <span className="text-[11px] text-emerald-200 block">RTO Waste ({rtoCount})</span>
                <span className="text-lg font-bold text-rose-300">
                  -{formatINR(totalRtoLoss)}
                </span>
                <span className="text-[10px] text-rose-400 block mt-0.5">
                  -{formatINR(rtoLossPerUnit)}/return
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs text-slate-600">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dispatched Portfolio Health
            </h3>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Total Dispatched Volume</span>
              <span className="font-semibold text-slate-900">{formatNumberIN(safeMonthlyOrders)} orders</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
              <span>Successful Deliveries ({deliveryRate}%)</span>
              <span className="font-bold">{formatNumberIN(deliveredCount)} orders</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>RTO Undelivered Returns ({safeRtoRate}%)</span>
              <span className="font-bold">{formatNumberIN(rtoCount)} orders</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Delivered Gross Profit</span>
              <span className="font-semibold text-slate-900">{formatINR(totalDeliveredProfit)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
              <span>RTO Freight & Packaging Drain</span>
              <span className="font-semibold">-{formatINR(totalRtoLoss)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-slate-900 pt-1 text-sm">
              <span>True Net Profit</span>
              <span className={netMonthlyProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                {formatINR(netMonthlyProfit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="cod-calc-bottom" format="horizontal" />
    </div>
  );
};
