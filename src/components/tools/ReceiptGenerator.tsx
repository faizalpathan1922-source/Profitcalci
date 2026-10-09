import React, { useState } from 'react';
import { Receipt, Printer, Edit3, Eye, Check, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatINR, numberToWordsINR, parsePositiveNumber } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const ReceiptGenerator: React.FC = () => {
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [receiptDate, setReceiptDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sellerName, setSellerName] = useState<string>('');
  const [sellerGstin, setSellerGstin] = useState<string>('');
  const [sellerAddress, setSellerAddress] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cash' | 'bank_transfer' | 'cheque'>('upi');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [towardsDescription, setTowardsDescription] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const safeAmount = parsePositiveNumber(amountInput, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Payment Voucher
            </span>
            <span className="text-xs text-slate-500">Official Cash / UPI Receipt</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment Receipt Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Issue formal payment vouchers for cash, UPI, or bank transfers with automatic amount in words and instant printing.
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
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {!previewMode ? (
        /* Edit Form */
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt Number
              </label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                placeholder="e.g. RCPT-2026-001"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Receipt Date
              </label>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issuer Business (Received By)
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Enter shop or business name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
              />
              <input
                type="text"
                value={sellerAddress}
                onChange={(e) => setSellerAddress(e.target.value)}
                placeholder="Enter business address, city, pin code"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer (Received From)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer / client name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2"
              />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone Number (Optional)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount Received (₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e: any) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="cash">Cash Payment</option>
                <option value="bank_transfer">NEFT / RTGS / IMPS</option>
                <option value="cheque">Cheque / Demand Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction / UTR / Cheque Ref
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UPI/1234567890/Bank"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Towards / Description
            </label>
            <textarea
              rows={2}
              value={towardsDescription}
              onChange={(e) => setTowardsDescription(e.target.value)}
              placeholder="e.g. Towards full settlement of Bill #..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      ) : null}

      {/* Printable Receipt Paper Voucher */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-300 shadow-xl max-w-3xl mx-auto space-y-6 text-slate-900 print:border-none print:shadow-none print:p-0">
        <div className="flex justify-between items-start border-b-2 border-emerald-800 pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase block">
              Official Payment Voucher
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-0.5">
              PAYMENT RECEIPT
            </h2>
          </div>
          <div className="text-right">
            <h3 className="font-extrabold text-base text-slate-900">{sellerName}</h3>
            {sellerGstin && <p className="text-[11px] font-mono text-slate-600">GSTIN: {sellerGstin}</p>}
            <p className="text-[11px] text-slate-500 max-w-xs">{sellerAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-bold block uppercase text-[10px]">Received From:</span>
            <p className="text-sm font-bold text-slate-900">{customerName}</p>
            {customerPhone && <p className="text-slate-600 font-mono">{customerPhone}</p>}
          </div>

          <div className="text-right space-y-1">
            <div>
              <span className="text-slate-500">Receipt No: </span>
              <span className="font-mono font-bold text-slate-900">{receiptNumber}</span>
            </div>
            <div>
              <span className="text-slate-500">Date: </span>
              <span className="font-semibold text-slate-900">{receiptDate}</span>
            </div>
            <div>
              <span className="text-slate-500">Payment Mode: </span>
              <span className="font-bold uppercase text-emerald-800">{paymentMode.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Highlighted Amount Box */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
              Amount Received in INR
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950">
              {formatINR(safeAmount)}
            </span>
          </div>
          <div className="text-xs text-slate-700 max-w-xs">
            <span className="font-semibold text-slate-500 block">Reference / UTR:</span>
            <span className="font-mono font-bold">{transactionRef || 'N/A'}</span>
          </div>
        </div>

        {/* In Words & Description */}
        <div className="space-y-3 text-xs border-y border-slate-200 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-bold text-slate-600 shrink-0">Amount in Words:</span>
            <span className="font-bold text-slate-900 italic">{numberToWordsINR(safeAmount)}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
            <span className="font-bold text-slate-600 shrink-0">Payment Towards:</span>
            <span className="text-slate-800">{towardsDescription || 'Goods and services rendered'}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-10 flex justify-between items-end text-xs">
          <div className="text-center">
            <div className="border-t border-slate-300 w-36 pt-1 text-[11px] text-slate-500">
              Customer Signature
            </div>
          </div>

          <div className="text-center">
            <div className="border-t-2 border-slate-800 w-44 pt-1 font-bold text-slate-900">
              Authorized Signatory
            </div>
            <span className="text-[10px] text-slate-500">{sellerName}</span>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="receipt-calc-bottom" format="horizontal" />
    </div>
  );
};
