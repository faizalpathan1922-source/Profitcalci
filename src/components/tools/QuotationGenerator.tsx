import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, Printer, Edit3, Eye, Check, RefreshCw, FileText } from 'lucide-react';
import { formatINR, numberToWordsINR, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  gstRate: number;
}

export const QuotationGenerator: React.FC = () => {
  const [quoteNumber, setQuoteNumber] = useState<string>('');
  const [quoteDate, setQuoteDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState<string>('');
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerGstin, setSellerGstin] = useState<string>('');
  const [sellerAddress, setSellerAddress] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');

  const [items, setItems] = useState<QuoteItem[]>([]);

  const [notes, setNotes] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Math
  const calculatedItems = items.map((item) => {
    const qty = Math.max(0, parsePositiveNumber(item.quantity, 1));
    const price = Math.max(0, parsePositiveNumber(item.unitPrice, 0));
    const rate = Math.max(0, parsePositiveNumber(item.gstRate, 0));
    const lineSubtotal = qty * price;
    const lineGst = (lineSubtotal * rate) / 100;
    const lineTotal = lineSubtotal + lineGst;
    return { ...item, qty, price, lineSubtotal, lineGst, lineTotal };
  });

  const subtotal = calculatedItems.reduce((acc, curr) => acc + curr.lineSubtotal, 0);
  const totalGst = calculatedItems.reduce((acc, curr) => acc + curr.lineGst, 0);
  const grandTotal = subtotal + totalGst;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        gstRate: 18,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, val: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Commercial Estimate
            </span>
            <span className="text-xs text-slate-500">Formal Quotation / Proforma</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quotation Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate formal B2B price estimates and quotations with itemized GST, validity terms, and instant A4 printing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            {previewMode ? <Edit3 className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Edit Mode' : 'Preview Paper'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {!previewMode ? (
        /* Edit Form */
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 no-print">
          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quotation No.
              </label>
              <input
                type="text"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quote Date
              </label>
              <input
                type="date"
                value={quoteDate}
                onChange={(e) => setQuoteDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Seller & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Seller (Your Business)
              </h3>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Business Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={sellerGstin}
                onChange={(e) => setSellerGstin(e.target.value)}
                placeholder="GSTIN (Optional)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={sellerAddress}
                onChange={(e) => setSellerAddress(e.target.value)}
                placeholder="Address & State"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Client (Prepared For)
              </h3>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client / Company Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Client Address"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Line items table */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quotation Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-center w-20">Qty</th>
                    <th className="p-2 text-right w-28">Rate (₹)</th>
                    <th className="p-2 text-center w-24">GST %</th>
                    <th className="p-2 text-right w-28">Total (₹)</th>
                    <th className="p-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => {
                    const row = calculatedItems[idx];
                    return (
                      <tr key={item.id}>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            placeholder="Item description..."
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                            min="1"
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-center text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                            min="0"
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-right text-xs font-bold"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={item.gstRate}
                            onChange={(e) => handleItemChange(item.id, 'gstRate', Number(e.target.value))}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded text-center text-xs"
                          >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                        </td>
                        <td className="p-2 text-right font-bold text-slate-800">
                          {formatINR(row?.lineTotal || 0)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Terms & Conditions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      ) : null}

      {/* Printable Quotation Paper Document */}
      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              Commercial Quotation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Original for Recipient</p>
          </div>
          <div className="text-right">
            <h3 className="font-extrabold text-lg text-emerald-800">{sellerName}</h3>
            {sellerGstin && <p className="text-xs font-mono text-slate-600">GSTIN: {sellerGstin}</p>}
            <p className="text-xs text-slate-500 max-w-xs">{sellerAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Quote For:</span>
            <p className="font-bold text-sm text-slate-900">{clientName}</p>
            <p className="text-slate-600">{clientAddress}</p>
          </div>
          <div className="text-right space-y-1">
            <div>
              <span className="text-slate-500">Quotation No: </span>
              <span className="font-mono font-bold text-slate-900">{quoteNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">Date: </span>
              <span className="font-semibold text-slate-900">{quoteDate}</span>
            </div>
            <div>
              <span className="text-slate-500">Valid Until: </span>
              <span className="font-semibold text-slate-900">{validUntil}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-xs border border-slate-200">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2 text-left">Item Description</th>
              <th className="p-2 text-center w-16">Qty</th>
              <th className="p-2 text-right w-24">Rate (₹)</th>
              <th className="p-2 text-right w-24">Taxable</th>
              <th className="p-2 text-center w-16">GST</th>
              <th className="p-2 text-right w-28">Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {calculatedItems.map((item) => (
              <tr key={item.id}>
                <td className="p-2 font-medium">{item.description || 'Item'}</td>
                <td className="p-2 text-center">{item.qty}</td>
                <td className="p-2 text-right">{formatINR(item.price)}</td>
                <td className="p-2 text-right">{formatINR(item.lineSubtotal)}</td>
                <td className="p-2 text-center">{item.gstRate}%</td>
                <td className="p-2 text-right font-bold">{formatINR(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-between items-start pt-2">
          <div className="max-w-md text-xs space-y-2">
            <div>
              <span className="font-bold text-slate-700">Amount in Words:</span>
              <p className="font-medium text-slate-800 italic">{numberToWordsINR(grandTotal)}</p>
            </div>
            {notes && (
              <div className="pt-2">
                <span className="font-bold text-slate-700">Terms & Conditions:</span>
                <p className="text-slate-600 whitespace-pre-line text-[11px] mt-0.5">{notes}</p>
              </div>
            )}
          </div>

          <div className="w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Subtotal (Excl. Tax):</span>
              <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Total GST Amount:</span>
              <span className="font-semibold text-slate-900">{formatINR(totalGst)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm font-black text-slate-900 border-t-2 border-slate-800 pt-1">
              <span>Grand Total:</span>
              <span className="text-emerald-800">{formatINR(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-10 flex justify-between items-end text-xs">
          <div className="text-slate-400 text-[10px]">
            Created via ProfitCalci Commercial Solutions (profitcalci.in)
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 w-44 pt-1 font-bold text-slate-800">
              Authorized Signatory
            </div>
            <span className="text-[10px] text-slate-500">{sellerName}</span>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="quotation-calc-bottom" format="horizontal" />
    </div>
  );
};
