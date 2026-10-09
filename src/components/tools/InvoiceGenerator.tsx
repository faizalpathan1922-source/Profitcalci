import React, { useState } from 'react';
import { FileText, Plus, Trash2, Printer, Download, RefreshCw, Eye, Edit3, Check, QrCode, Building, Sparkles, BookOpen } from 'lucide-react';
import { formatINR, numberToWordsINR, parseSafeNumber } from '../../utils/formatters';
import { INDIAN_STATES } from '../../data/statesData';
import { HSN_DATABASE } from '../../data/hsnData';
import { InvoiceData, InvoiceItem } from '../../types';
import { AdSenseBanner } from '../AdSenseBanner';

const INITIAL_INVOICE: InvoiceData = {
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  placeOfSupply: 'Maharashtra',
  reverseCharge: false,
  // Seller
  sellerName: '',
  sellerTradeName: '',
  sellerGstin: '',
  sellerPan: '',
  sellerAddress: '',
  sellerCity: '',
  sellerState: 'Maharashtra',
  sellerPincode: '',
  sellerPhone: '',
  sellerEmail: '',
  // Buyer
  buyerName: '',
  buyerGstin: '',
  buyerAddress: '',
  buyerCity: '',
  buyerState: 'Maharashtra',
  buyerPincode: '',
  buyerPhone: '',
  // Bank
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  upiId: '',
  // Items
  items: [],
  notes: '',
  terms: '',
};

export const InvoiceGenerator: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(INITIAL_INVOICE);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Check if seller state is same as place of supply
  const isInterState = data.sellerState.toLowerCase() !== data.placeOfSupply.toLowerCase();

  // Line item calculations
  const calculatedItems = data.items.map((item) => {
    const qty = Math.max(0, parseSafeNumber(item.quantity, 1));
    const rate = Math.max(0, parseSafeNumber(item.unitPrice, 0));
    const gross = qty * rate;
    const discountAmount = (gross * parseSafeNumber(item.discountPercent, 0)) / 100;
    const taxableValue = gross - discountAmount;
    const taxRate = parseSafeNumber(item.gstRate, 0);
    const taxAmount = (taxableValue * taxRate) / 100;
    const total = taxableValue + taxAmount;

    return {
      ...item,
      taxableValue,
      taxAmount,
      total,
      cgst: isInterState ? 0 : taxAmount / 2,
      sgst: isInterState ? 0 : taxAmount / 2,
      igst: isInterState ? taxAmount : 0,
    };
  });

  const totalTaxable = calculatedItems.reduce((acc, curr) => acc + curr.taxableValue, 0);
  const totalGst = calculatedItems.reduce((acc, curr) => acc + curr.taxAmount, 0);
  const totalCgst = isInterState ? 0 : totalGst / 2;
  const totalSgst = isInterState ? 0 : totalGst / 2;
  const totalIgst = isInterState ? totalGst : 0;
  const rawGrandTotal = totalTaxable + totalGst;
  const roundedGrandTotal = Math.round(rawGrandTotal);
  const roundOff = roundedGrandTotal - rawGrandTotal;

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      hsn: '',
      quantity: 1,
      unit: 'Pcs',
      unitPrice: 0,
      discountPercent: 0,
      gstRate: 5,
    };
    setData({ ...data, items: [...data.items, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) return;
    setData({ ...data, items: data.items.filter((item) => item.id !== id) });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setData({
      ...data,
      items: data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const handleHsnSelect = (id: string, hsnCode: string) => {
    const found = HSN_DATABASE.find((h) => h.code === hsnCode);
    if (found) {
      setData({
        ...data,
        items: data.items.map((item) =>
          item.id === id
            ? {
                ...item,
                hsn: found.code,
                gstRate: found.gstRate,
                description: item.description || found.typicalProducts[0] || found.description,
              }
            : item
        ),
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setData({
      ...INITIAL_INVOICE,
      invoiceDate: new Date().toISOString().split('T')[0],
      items: [],
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Indian GST Tax Invoice
            </span>
            <span className="text-xs text-slate-500">A4 Printable / PDF Export</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            GST Invoice Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create professional GST-compliant tax invoices for your retail shop, wholesale orders, or online sales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            {previewMode ? <Edit3 className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Edit Mode' : 'Preview Paper'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Form (Shown in Edit Mode) */}
      {!previewMode && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 no-print">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Invoice Setup & Information
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                Clear All Fields
              </button>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label htmlFor="inv-number-input" className="block text-xs font-semibold text-slate-700 mb-1">Invoice Number</label>
              <input
                id="inv-number-input"
                type="text"
                value={data.invoiceNumber}
                onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="inv-date-input" className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
              <input
                id="inv-date-input"
                type="date"
                value={data.invoiceDate}
                onChange={(e) => setData({ ...data, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="inv-due-date-input" className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                id="inv-due-date-input"
                type="date"
                value={data.dueDate}
                onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="inv-place-supply-input" className="block text-xs font-semibold text-slate-700 mb-1">Place of Supply (State)</label>
              <select
                id="inv-place-supply-input"
                value={data.placeOfSupply}
                onChange={(e) => setData({ ...data, placeOfSupply: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.code} - {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seller & Buyer details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Seller */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Business Details (Seller)</span>
              </h3>
              <div>
                <label htmlFor="seller-name-input" className="block text-xs text-slate-600 mb-0.5">Company / Shop Name</label>
                <input
                  id="seller-name-input"
                  type="text"
                  value={data.sellerName}
                  onChange={(e) => setData({ ...data, sellerName: e.target.value })}
                  placeholder="e.g. Bharat Apparels"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="seller-gstin-input" className="block text-xs text-slate-600 mb-0.5">GSTIN (Optional if unreg)</label>
                  <input
                    id="seller-gstin-input"
                    type="text"
                    value={data.sellerGstin}
                    onChange={(e) => setData({ ...data, sellerGstin: e.target.value })}
                    placeholder="27AABCT..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm uppercase bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="seller-state-input" className="block text-xs text-slate-600 mb-0.5">Seller State</label>
                  <select
                    id="seller-state-input"
                    value={data.sellerState}
                    onChange={(e) => setData({ ...data, sellerState: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st.code} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="seller-address-input" className="block text-xs text-slate-600 mb-0.5">Full Address</label>
                <input
                  id="seller-address-input"
                  type="text"
                  value={data.sellerAddress}
                  onChange={(e) => setData({ ...data, sellerAddress: e.target.value })}
                  placeholder="Street, Area, City, Pincode"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="seller-phone-input" className="block text-xs text-slate-600 mb-0.5">Phone</label>
                  <input
                    id="seller-phone-input"
                    type="text"
                    value={data.sellerPhone}
                    onChange={(e) => setData({ ...data, sellerPhone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="seller-email-input" className="block text-xs text-slate-600 mb-0.5">Email</label>
                  <input
                    id="seller-email-input"
                    type="email"
                    value={data.sellerEmail}
                    onChange={(e) => setData({ ...data, sellerEmail: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Buyer */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>Customer / Billed To (Buyer)</span>
              </h3>
              <div>
                <label htmlFor="buyer-name-input" className="block text-xs text-slate-600 mb-0.5">Client / Buyer Name</label>
                <input
                  id="buyer-name-input"
                  type="text"
                  value={data.buyerName}
                  onChange={(e) => setData({ ...data, buyerName: e.target.value })}
                  placeholder="Customer or Store Name"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="buyer-gstin-input" className="block text-xs text-slate-600 mb-0.5">Buyer GSTIN (if B2B)</label>
                  <input
                    id="buyer-gstin-input"
                    type="text"
                    value={data.buyerGstin}
                    onChange={(e) => setData({ ...data, buyerGstin: e.target.value })}
                    placeholder="Optional for B2C"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm uppercase bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="buyer-state-input" className="block text-xs text-slate-600 mb-0.5">Buyer State</label>
                  <select
                    id="buyer-state-input"
                    value={data.buyerState}
                    onChange={(e) => setData({ ...data, buyerState: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st.code} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="buyer-address-input" className="block text-xs text-slate-600 mb-0.5">Buyer Address</label>
                <input
                  id="buyer-address-input"
                  type="text"
                  value={data.buyerAddress}
                  onChange={(e) => setData({ ...data, buyerAddress: e.target.value })}
                  placeholder="Address"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="buyer-city-input" className="block text-xs text-slate-600 mb-0.5">City</label>
                  <input
                    id="buyer-city-input"
                    type="text"
                    value={data.buyerCity}
                    onChange={(e) => setData({ ...data, buyerCity: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="buyer-phone-input" className="block text-xs text-slate-600 mb-0.5">Phone Number</label>
                  <input
                    id="buyer-phone-input"
                    type="text"
                    value={data.buyerPhone}
                    onChange={(e) => setData({ ...data, buyerPhone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Product & Service Items
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            {data.items.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-600">No items added to invoice yet.</p>
                <p className="text-[11px] text-slate-400">Click &quot;Add Item&quot; above to add your first product or service line.</p>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer mt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Item
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.items.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4">
                      <label htmlFor={`item-desc-${item.id}`} className="block text-[11px] text-slate-500 mb-0.5">Item Description</label>
                      <input
                        id={`item-desc-${item.id}`}
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Product Name"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`item-hsn-${item.id}`} className="block text-[11px] text-slate-500 mb-0.5">HSN Code</label>
                      <input
                        id={`item-hsn-${item.id}`}
                        type="text"
                        value={item.hsn}
                        onChange={(e) => handleItemChange(item.id, 'hsn', e.target.value)}
                        placeholder="e.g. 6204"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm bg-white uppercase"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`item-qty-${item.id}`} className="block text-[11px] text-slate-500 mb-0.5">Qty & Unit</label>
                      <div className="flex gap-1">
                        <input
                          id={`item-qty-${item.id}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                        <input
                          type="text"
                          aria-label="Unit"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          className="w-14 px-1.5 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`item-rate-${item.id}`} className="block text-[11px] text-slate-500 mb-0.5">Rate (₹)</label>
                      <input
                        id={`item-rate-${item.id}`}
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                        min="0"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`item-gst-${item.id}`} className="block text-[11px] text-slate-500 mb-0.5">GST Slab %</label>
                      <select
                        id={`item-gst-${item.id}`}
                        value={item.gstRate}
                        onChange={(e) => handleItemChange(item.id, 'gstRate', Number(e.target.value))}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option value="0">0%</option>
                        <option value="3">3%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          {/* Payment & Bank Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Payment & Bank Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label htmlFor="bank-name-input" className="block text-[11px] text-slate-500 mb-0.5">Bank Name</label>
                <input
                  id="bank-name-input"
                  type="text"
                  value={data.bankName}
                  onChange={(e) => setData({ ...data, bankName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label htmlFor="bank-acc-input" className="block text-[11px] text-slate-500 mb-0.5">Account Number</label>
                <input
                  id="bank-acc-input"
                  type="text"
                  value={data.accountNumber}
                  onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label htmlFor="bank-ifsc-input" className="block text-[11px] text-slate-500 mb-0.5">IFSC Code</label>
                <input
                  id="bank-ifsc-input"
                  type="text"
                  value={data.ifscCode}
                  onChange={(e) => setData({ ...data, ifscCode: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm uppercase"
                />
              </div>
              <div>
                <label htmlFor="bank-upi-input" className="block text-[11px] text-slate-500 mb-0.5">UPI ID (e.g. shop@okaxis)</label>
                <input
                  id="bank-upi-input"
                  type="text"
                  value={data.upiId}
                  onChange={(e) => setData({ ...data, upiId: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Paper Document View (Always printed, toggleable preview) */}
      <div className={`invoice-paper bg-white p-8 sm:p-10 border border-slate-300 rounded-xl shadow-md text-slate-900 font-sans ${previewMode ? 'block' : 'hidden sm:block'}`}>
        {/* Header with TAX INVOICE title */}
        <div className="border-b-2 border-slate-800 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {data.sellerName || 'TAX INVOICE'}
            </h2>
            {data.sellerTradeName && data.sellerTradeName !== data.sellerName && (
              <p className="text-xs text-slate-500 font-semibold">{data.sellerTradeName}</p>
            )}
            <p className="text-xs text-slate-600 max-w-sm mt-1">
              {data.sellerAddress} {data.sellerCity && `, ${data.sellerCity}`} - {data.sellerPincode}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              State: <strong>{data.sellerState}</strong> | Phone: {data.sellerPhone}
            </p>
            {data.sellerGstin && (
              <p className="text-xs font-bold text-slate-900 mt-1">
                GSTIN: <span className="font-mono text-emerald-800">{data.sellerGstin}</span>
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-sm uppercase tracking-wider rounded">
              TAX INVOICE
            </span>
            <div className="mt-2 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Invoice No: </span>
                <strong className="font-mono">{data.invoiceNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500">Invoice Date: </span>
                <strong>{data.invoiceDate}</strong>
              </div>
              <div>
                <span className="text-slate-500">Due Date: </span>
                <strong>{data.dueDate}</strong>
              </div>
              <div>
                <span className="text-slate-500">Place of Supply: </span>
                <strong className="text-emerald-700">{data.placeOfSupply}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div className="grid grid-cols-2 gap-6 py-3 border-b border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To (Customer):
            </span>
            <strong className="text-sm text-slate-900 block">{data.buyerName || 'Walk-in Customer'}</strong>
            <p className="text-slate-600 mt-0.5">{data.buyerAddress} {data.buyerCity && `, ${data.buyerCity}`}</p>
            <p className="text-slate-600">State: {data.buyerState} - {data.buyerPincode}</p>
            {data.buyerGstin ? (
              <p className="font-bold text-slate-900 mt-1">GSTIN: {data.buyerGstin}</p>
            ) : (
              <p className="text-slate-400 italic">Unregistered Consumer (B2C)</p>
            )}
          </div>

          <div className="text-right flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tax Type:
              </span>
              <span className="font-bold text-slate-900">
                {isInterState ? 'Inter-State Supply (IGST Applicable)' : 'Intra-State Supply (CGST + SGST Applicable)'}
              </span>
            </div>
            {data.upiId && (
              <div className="text-xs text-slate-500 mt-2">
                Scan to pay via UPI: <strong className="text-slate-800">{data.upiId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Table of Items */}
        <div className="mt-4">
          <table className="w-full text-xs border border-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="py-2 px-2 text-center border-r border-slate-300 w-8">#</th>
                <th className="py-2 px-3 text-left border-r border-slate-300">Item Description</th>
                <th className="py-2 px-2 text-center border-r border-slate-300 w-16">HSN</th>
                <th className="py-2 px-2 text-center border-r border-slate-300 w-14">Qty</th>
                <th className="py-2 px-2 text-right border-r border-slate-300 w-16">Rate (₹)</th>
                <th className="py-2 px-2 text-right border-r border-slate-300 w-20">Taxable (₹)</th>
                <th className="py-2 px-2 text-center border-r border-slate-300 w-14">GST %</th>
                <th className="py-2 px-2 text-right w-24">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.length > 0 ? (
                calculatedItems.map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="py-2 px-2 text-center border-r border-slate-300 text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-300 font-medium text-slate-900">
                      {item.description || 'Goods / Services'}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-300 font-mono">{item.hsn || '-'}</td>
                    <td className="py-2 px-2 text-center border-r border-slate-300">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2 px-2 text-right border-r border-slate-300">{item.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-2 text-right border-r border-slate-300 font-semibold">
                      {item.taxableValue.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-slate-300">{item.gstRate}%</td>
                    <td className="py-2 px-2 text-right font-bold text-slate-900">{item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No items added yet. Click &quot;Edit Mode&quot; to add products or services.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary & Bank Details */}
        <div className="grid grid-cols-12 gap-6 mt-4 pt-2">
          {/* Left: Bank & In Words */}
          <div className="col-span-7 space-y-3 text-xs">
            {(data.bankName || data.accountNumber || data.upiId || data.ifscCode) ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Bank & Payment Details
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-600">
                  {data.bankName && <div>Bank: <strong>{data.bankName}</strong></div>}
                  {data.ifscCode && <div>IFSC: <strong className="font-mono">{data.ifscCode}</strong></div>}
                  {data.accountNumber && <div>A/C No: <strong className="font-mono">{data.accountNumber}</strong></div>}
                  {data.upiId && <div>UPI ID: <strong className="text-emerald-700">{data.upiId}</strong></div>}
                </div>
              </div>
            ) : null}

            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Total Amount (in words):</span>
              <span className="italic text-slate-800 font-medium">{numberToWordsINR(roundedGrandTotal)}</span>
            </div>

            {data.terms && (
              <div className="pt-2 text-[10px] text-slate-500 whitespace-pre-line">
                <span className="font-bold text-slate-700 block">Terms & Conditions:</span>
                {data.terms}
              </div>
            )}
          </div>

          {/* Right: Tax Breakdown & Grand Total */}
          <div className="col-span-5 text-xs space-y-1.5">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-600">Total Taxable Amount:</span>
              <span className="font-semibold text-slate-900">{formatINR(totalTaxable)}</span>
            </div>

            {isInterState ? (
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total IGST:</span>
                <span className="font-semibold text-emerald-800">{formatINR(totalIgst)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Total CGST:</span>
                  <span className="font-semibold text-emerald-800">{formatINR(totalCgst)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Total SGST:</span>
                  <span className="font-semibold text-emerald-800">{formatINR(totalSgst)}</span>
                </div>
              </>
            )}

            {roundOff !== 0 && (
              <div className="flex justify-between py-1 border-b border-slate-200 text-slate-500">
                <span>Round-off:</span>
                <span>{roundOff > 0 ? `+${roundOff.toFixed(2)}` : roundOff.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between py-2 pt-2 border-t-2 border-slate-800 text-sm font-extrabold text-slate-900">
              <span>Grand Total:</span>
              <span className="text-base text-emerald-800">{formatINR(roundedGrandTotal)}</span>
            </div>

            <div className="pt-6 text-right">
              <div className="inline-block text-center border-t border-slate-400 pt-1 w-44">
                <span className="text-[11px] font-bold text-slate-800 block">For {data.sellerName}</span>
                <span className="text-[9px] text-slate-500">Authorized Signatory</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AdSense Unit */}
      <AdSenseBanner slot="5192847102" format="horizontal" />

      {/* Statutory Invoicing Guide */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed no-print">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            GST Compliance Rules
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Mandatory Tax Invoice Requirements Under Indian Law
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rules governed by Section 31 of the CGST Act and Rule 46 of the CGST Rules, 2017.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">
            What Elements Make a Tax Invoice Legally Valid in India?
          </h3>
          <p>
            Any registered taxpayer issuing a tax invoice to another business (B2B) or retail consumer (B2C) must include standard statutory fields to ensure input tax credit (ITC) eligibility:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">1. Consecutive Invoice Serial Number</strong>
              Must not exceed 16 characters containing alphabets, numerals, and special characters (hyphen or slash), unique for a financial year.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">2. 15-Digit GSTIN & State Code</strong>
              Mandatory 2-digit state prefix (e.g. 27 for Maharashtra, 07 for Delhi) matching the registration certificate.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">3. 4 or 6 Digit HSN/SAC Code</strong>
              Required for all goods (HSN) and services (SAC) based on annual turnover brackets.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">4. Place of Supply & Tax Segregation</strong>
              Explicit declaration of Place of Supply and separate columns for CGST, SGST, or IGST amounts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
