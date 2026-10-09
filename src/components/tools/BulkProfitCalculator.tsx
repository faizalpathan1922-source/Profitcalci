import React, { useState } from 'react';
import { Layers, Plus, Trash2, Copy, Check, Download, Info, RefreshCw, ArrowRight } from 'lucide-react';
import { formatINR, formatNumberIN, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

interface BulkProductRow {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  unitOverhead: number;
}

export const BulkProfitCalculator: React.FC = () => {
  const [products, setProducts] = useState<BulkProductRow[]>([
    {
      id: '1',
      name: 'Cotton Printed Kurtis',
      quantity: 100,
      costPrice: 250,
      sellingPrice: 499,
      unitOverhead: 40,
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Earbuds',
      quantity: 50,
      costPrice: 400,
      sellingPrice: 899,
      unitOverhead: 60,
    },
    {
      id: '3',
      name: 'Stainless Steel Water Bottles',
      quantity: 80,
      costPrice: 150,
      sellingPrice: 349,
      unitOverhead: 35,
    },
  ]);

  const [copied, setCopied] = useState<boolean>(false);

  // Line calculations
  const calculatedRows = products.map((item) => {
    const qty = Math.max(0, parsePositiveNumber(item.quantity, 1));
    const cost = Math.max(0, parsePositiveNumber(item.costPrice, 0));
    const sell = Math.max(0, parsePositiveNumber(item.sellingPrice, 0));
    const overhead = Math.max(0, parsePositiveNumber(item.unitOverhead, 0));

    const totalCostPerUnit = cost + overhead;
    const profitPerUnit = sell - totalCostPerUnit;

    const rowRevenue = qty * sell;
    const rowCost = qty * totalCostPerUnit;
    const rowProfit = rowRevenue - rowCost;
    const rowMargin = rowRevenue > 0 ? (rowProfit / rowRevenue) * 100 : 0;

    return {
      ...item,
      qty,
      cost,
      sell,
      overhead,
      totalCostPerUnit,
      profitPerUnit,
      rowRevenue,
      rowCost,
      rowProfit,
      rowMargin,
    };
  });

  // Portfolio Totals
  const totalUnitsSold = calculatedRows.reduce((acc, curr) => acc + curr.qty, 0);
  const totalPortfolioRevenue = calculatedRows.reduce((acc, curr) => acc + curr.rowRevenue, 0);
  const totalPortfolioCost = calculatedRows.reduce((acc, curr) => acc + curr.rowCost, 0);
  const totalPortfolioProfit = totalPortfolioRevenue - totalPortfolioCost;
  const portfolioMarginPercent = totalPortfolioRevenue > 0 ? (totalPortfolioProfit / totalPortfolioRevenue) * 100 : 0;
  const portfolioRoiPercent = totalPortfolioCost > 0 ? (totalPortfolioProfit / totalPortfolioCost) * 100 : 0;

  const handleAddRow = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        name: `Product #${products.length + 1}`,
        quantity: 10,
        costPrice: 200,
        sellingPrice: 400,
        unitOverhead: 30,
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleRowChange = (id: string, field: keyof BulkProductRow, val: any) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  };

  const handleCopySummary = () => {
    const summary = `ProfitCalci Bulk Multi-Product Profit Analysis
Total Products Tracked: ${products.length} SKUs
Total Units Sold: ${formatNumberIN(totalUnitsSold)} units
===================================================
TOTAL REVENUE TURNOVER: ${formatINR(totalPortfolioRevenue)}
TOTAL COGS & LOGISTICS: ${formatINR(totalPortfolioCost)}
TOTAL NET PORTFOLIO PROFIT: ${formatINR(totalPortfolioProfit)}
WEIGHTED MARGIN: ${portfolioMarginPercent.toFixed(1)}% | ROI: ${portfolioRoiPercent.toFixed(1)}%
===================================================
Top Products Breakdown:
${calculatedRows
  .map(
    (r) =>
      `• ${r.name} (${r.qty} pcs): Rev ${formatINR(r.rowRevenue)} | Profit ${formatINR(r.rowProfit)} (${r.rowMargin.toFixed(1)}%)`
  )
  .join('\n')}
Calculated via ProfitCalci (profitcalci.in)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['Product Name', 'Quantity', 'Cost Price', 'Overhead', 'Selling Price', 'Total Cost', 'Total Revenue', 'Net Profit', 'Margin %'];
    const rows = calculatedRows.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      r.qty,
      r.cost,
      r.overhead,
      r.sell,
      r.rowCost,
      r.rowRevenue,
      r.rowProfit,
      r.rowMargin.toFixed(2),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'profitcalci-bulk-profit.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Inventory & Batch Analysis
            </span>
            <span className="text-xs text-slate-500">Multi-SKU Portfolio Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bulk Profit Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Analyze multiple product batches with varying purchase costs, shipping overheads, and selling prices to calculate total catalog profitability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Portfolio KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Revenue
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 block">
            {formatINR(totalPortfolioRevenue)}
          </span>
          <span className="text-[10px] text-slate-400">{formatNumberIN(totalUnitsSold)} units sold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Costs
          </span>
          <span className="text-xl font-black text-slate-700 mt-1 block">
            {formatINR(totalPortfolioCost)}
          </span>
          <span className="text-[10px] text-slate-400">COGS + Logistics</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-4 rounded-2xl shadow-md">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
            Total Net Profit
          </span>
          <span className="text-xl font-black text-white mt-1 block">
            {formatINR(totalPortfolioProfit)}
          </span>
          <span className="text-[10px] text-emerald-200">Across {products.length} SKUs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Margin
          </span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">
            {portfolioMarginPercent.toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-400">ROI: {portfolioRoiPercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Product Rows Table */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Product Batch Inventory ({products.length} Items)
          </h2>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-2.5 text-left">Product / SKU</th>
                <th className="p-2.5 text-center w-20">Units</th>
                <th className="p-2.5 text-right w-24">Buy (₹)</th>
                <th className="p-2.5 text-right w-24">Overhead (₹)</th>
                <th className="p-2.5 text-right w-24">Sell (₹)</th>
                <th className="p-2.5 text-right w-28">Total Rev (₹)</th>
                <th className="p-2.5 text-right w-28">Net Profit (₹)</th>
                <th className="p-2.5 text-center w-20">Margin</th>
                <th className="p-2.5 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((item, idx) => {
                const row = calculatedRows[idx];
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleRowChange(item.id, 'name', e.target.value)}
                        placeholder="Product name"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(item.id, 'quantity', Number(e.target.value))}
                        min="1"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-center text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.costPrice}
                        onChange={(e) => handleRowChange(item.id, 'costPrice', Number(e.target.value))}
                        min="0"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.unitOverhead}
                        onChange={(e) => handleRowChange(item.id, 'unitOverhead', Number(e.target.value))}
                        min="0"
                        placeholder="Ship/Pack"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-xs text-slate-500"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={item.sellingPrice}
                        onChange={(e) => handleRowChange(item.id, 'sellingPrice', Number(e.target.value))}
                        min="0"
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-xs font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 text-right font-medium text-slate-800">
                      {formatINR(row?.rowRevenue || 0)}
                    </td>
                    <td className="p-2 text-right font-bold">
                      <span className={(row?.rowProfit || 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {formatINR(row?.rowProfit || 0)}
                      </span>
                    </td>
                    <td className="p-2 text-center font-bold text-slate-700">
                      {row?.rowMargin.toFixed(1)}%
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(item.id)}
                        className="text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100/80 font-bold border-t-2 border-slate-300 text-slate-900">
                <td className="p-2.5">Total Portfolio Portfolio ({products.length} SKUs)</td>
                <td className="p-2.5 text-center">{formatNumberIN(totalUnitsSold)}</td>
                <td colSpan={3}></td>
                <td className="p-2.5 text-right font-black">{formatINR(totalPortfolioRevenue)}</td>
                <td className="p-2.5 text-right font-black text-emerald-800">{formatINR(totalPortfolioProfit)}</td>
                <td className="p-2.5 text-center font-black text-emerald-800">{portfolioMarginPercent.toFixed(1)}%</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <AdSenseBanner slot="bulk-profit-bottom" format="horizontal" />
    </div>
  );
};
