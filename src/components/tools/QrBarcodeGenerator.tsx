import React, { useState } from 'react';
import { QrCode, Download, Printer, Copy, Check, Sparkles, Smartphone, Link, MessageCircle, FileText } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { AdSenseBanner } from '../AdSenseBanner';

export const QrBarcodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<'upi' | 'url' | 'whatsapp' | 'text'>('upi');
  const [upiId, setUpiId] = useState<string>('merchant@okhdfcbank');
  const [payeeName, setPayeeName] = useState<string>('Bharat Store');
  const [amount, setAmount] = useState<string>('499');
  const [note, setNote] = useState<string>('Order VK102');

  const [urlInput, setUrlInput] = useState<string>('https://profitcalci.in');
  const [waNumber, setWaNumber] = useState<string>('919876543210');
  const [waText, setWaText] = useState<string>('Hi, I want to inquire about your products!');
  const [rawText, setRawText] = useState<string>('Welcome to Bharat Store! Visit again.');

  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Compute payload
  let qrPayload = '';
  if (qrType === 'upi') {
    qrPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}${
      amount ? `&am=${encodeURIComponent(amount)}` : ''
    }&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ''}`;
  } else if (qrType === 'url') {
    qrPayload = urlInput.trim();
  } else if (qrType === 'whatsapp') {
    const cleanWa = waNumber.replace(/[^0-9]/g, '');
    qrPayload = `https://wa.me/${cleanWa}?text=${encodeURIComponent(waText)}`;
  } else {
    qrPayload = rawText;
  }

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrPayload || 'ProfitCalci')}`;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `profitcalci-qr-${qrType}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback: open image in new tab to save
      window.open(qrImageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Payment & Utility QR
            </span>
            <span className="text-xs text-slate-500">Instant High-Resolution PNG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate custom QR codes for UPI payments, website URLs, WhatsApp chat links, and shop notices.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleDownloadQr}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Downloading...' : 'Download PNG'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Stand</span>
          </button>
        </div>
      </div>

      {/* QR Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setQrType('upi')}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
            qrType === 'upi' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>UPI Payment</span>
        </button>
        <button
          type="button"
          onClick={() => setQrType('url')}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
            qrType === 'url' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>Website URL</span>
        </button>
        <button
          type="button"
          onClick={() => setQrType('whatsapp')}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
            qrType === 'whatsapp' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setQrType('text')}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
            qrType === 'text' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Plain Text / Notice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="md:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {qrType === 'upi' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  UPI VPA ID (Required) *
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@okhdfcbank"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Compatible with GPay, PhonePe, Paytm, BHIM</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business / Payee Name
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="e.g. Bharat Store"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fixed Amount (Optional ₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Open amount"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bill / Note
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Order #102"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {qrType === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Website or Product Link *
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://yourstore.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {qrType === 'whatsapp' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number (with country code, e.g. 91...)
                </label>
                <input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  placeholder="919876543210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pre-filled Message
                </label>
                <textarea
                  rows={2}
                  value={waText}
                  onChange={(e) => setWaText(e.target.value)}
                  placeholder="Hello, I want to order..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          {qrType === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notice or Message Text
              </label>
              <textarea
                rows={3}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="WiFi password, store notice, or message..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleCopyPayload}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Data String!' : 'Copy QR Data String'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadQr}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG File</span>
            </button>
          </div>
        </div>

        {/* QR Preview Stand */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-xl max-w-xs w-full text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                {qrType === 'upi' ? 'Scan to Pay with Any UPI' : 'Scan With Phone Camera'}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={qrImageUrl}
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>

            <div>
              {qrType === 'upi' ? (
                <>
                  <h4 className="font-extrabold text-slate-900 text-base">{payeeName}</h4>
                  <p className="text-xs font-mono text-emerald-800 font-semibold">{upiId}</p>
                  {amount && (
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      Amount: ₹{amount}
                    </p>
                  )}
                  <div className="pt-2 mt-2 border-t border-slate-200 flex justify-center gap-2 text-[10px] text-slate-500 font-semibold">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-600 truncate px-2 font-mono">
                  {qrPayload}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="qr-calc-bottom" format="horizontal" />
    </div>
  );
};
