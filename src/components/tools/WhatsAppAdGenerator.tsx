import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquareShare,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Send,
  Flame,
  Zap,
  Shield,
  Gift,
  AlertCircle,
  RefreshCw,
  Edit3,
  Smartphone,
  Share2,
  CheckCheck
} from 'lucide-react';
import { formatINR, parsePositiveNumber } from '../../utils/formatters';
import { isGeminiConfigured, generateWithGemini } from '../../utils/aiClient';
import { AdSenseBanner } from '../AdSenseBanner';

type CampaignType = 'festive' | 'flash' | 'new_arrival' | 'clearance' | 'wholesale';
type ToneType = 'hinglish' | 'urgent' | 'professional' | 'english';

/**
 * Normalizes Indian phone numbers into international format (e.g. 919876543210)
 */
function cleanIndianPhoneNumber(phone: string): { display: string; intl: string } {
  const digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return { display: '', intl: '' };

  if (digits.length === 10) {
    return { display: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`, intl: `91${digits}` };
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    const trimmed = digits.slice(1);
    return { display: `+91 ${trimmed.slice(0, 5)} ${trimmed.slice(5)}`, intl: `91${trimmed}` };
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    const trimmed = digits.slice(2);
    return { display: `+91 ${trimmed.slice(0, 5)} ${trimmed.slice(5)}`, intl: digits };
  }
  return { display: digits, intl: digits };
}

/**
 * Generates battle-tested Indian eCommerce WhatsApp templates
 */
function generateTemplateCopy(params: {
  businessName: string;
  productName: string;
  regularPrice: number;
  offerPrice: number;
  keyFeatures: string;
  campaignType: CampaignType;
  tone: ToneType;
  phoneIntl: string;
}): string {
  const {
    businessName,
    productName,
    regularPrice,
    offerPrice,
    keyFeatures,
    campaignType,
    tone,
    phoneIntl,
  } = params;

  const discountAmount = regularPrice > offerPrice ? regularPrice - offerPrice : 0;
  const discountPercent =
    regularPrice > offerPrice && regularPrice > 0
      ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100)
      : 0;

  // Split comma or newline separated features
  const featureList = keyFeatures
    .split(/[,;\n]+/)
    .map((f) => f.trim())
    .filter(Boolean);

  const formattedBullets =
    featureList.length > 0
      ? featureList.map((f) => `  ✅ ${f}`).join('\n')
      : '  ✅ 100% Premium Quality Verified\n  ✅ Fast All-India Safe Delivery\n  ✅ Cash on Delivery (COD) Available';

  // Order link prefilled with item name
  const orderMessage = `Hi ${businessName || 'Seller'}, I want to order "${productName || 'your product'}" (Offer Price: Rs.${offerPrice}). Please share payment / delivery details.`;
  const orderUrl = phoneIntl
    ? `https://wa.me/${phoneIntl}?text=${encodeURIComponent(orderMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(orderMessage)}`;

  // 1. Hinglish Dhamaka Offer
  if (tone === 'hinglish' || campaignType === 'flash') {
    return `🔥 *MEGA DHAMAKA OFFER | ${businessName.toUpperCase() || 'SPECIAL SALE'}* 🔥

Aapke liye lekar aaye hain trending:
🛍️ *${productName || 'Special Product'}*

❌ Original MRP: ~₹${regularPrice}~
💰 Special Offer Price: *₹${offerPrice} ONLY!*
⚡ *Seedha ₹${discountAmount} ki Bachaat (${discountPercent}% OFF)* ⚡

*Khaas Features:*
${formattedBullets}

🚚 *Cash on Delivery (COD) Available*
📦 3-Day Express Dispatch Across India
💯 100% Quality Check Guarantee

⚠️ *Limited Stock Alert:* Sirf kuch hi pieces bache hain! Pehle aao, pehle paao.

👉 *Abhi Order Karne Ke Liye Yahan Click Karein:*
${orderUrl}

_Forward this offer to friends & family!_ 📲`;
  }

  // 2. Urgent FOMO / Flash Deal
  if (tone === 'urgent' || campaignType === 'clearance') {
    return `⚡ *24-HOUR FLASH CLEARANCE DEAL!* ⚡
From *${businessName || 'Our Store'}*

🚨 *${productName || 'Special Item'}* at Lowest Ever Price!

❌ Regular Price: ~₹${regularPrice}~
✅ *Today's Flash Price: ₹${offerPrice}*
💥 *Flat ${discountPercent}% DISCOUNT (Save ₹${discountAmount})*

*Key Specifications:*
${formattedBullets}

⏰ *Offer valid till stocks last or midnight!*
🚚 Express Doorstep Delivery | Easy Return Guarantee

📲 *Lock your piece before sold out:*
${orderUrl}

Reply *BOOK NOW* or click the link above! 👆`;
  }

  // 3. Festive Collection
  if (campaignType === 'festive') {
    return `✨ *FESTIVE SPECIAL COLLECTION | ${businessName.toUpperCase()}* ✨

Celebrate this festive season in style with our bestselling:
🌟 *${productName || 'Festive Special'}* 🌟

Original MRP: ~₹${regularPrice}~
Festive Deal Price: *₹${offerPrice}*
🎁 *Special Celebration Discount: ${discountPercent}% OFF (Save ₹${discountAmount})*

*Why You Will Love It:*
${formattedBullets}

🎁 Premium Quality & Beautiful Packaging (Ideal for Gifting)
🚚 Guaranteed Fast Delivery Across India
💵 COD & Online Payment Options Available

👉 *Order Now for Guaranteed Delivery Before Festivities:*
${orderUrl}

Wishing you joyful shopping! 🪔✨`;
  }

  // 4. Wholesale / Bulk Reseller
  if (campaignType === 'wholesale') {
    return `📦 *WHOLESALE & RESELLER SPECIAL RATE* 📦
Direct from *${businessName || 'Manufacturer & Wholesaler'}*

Item: *${productName || 'Bulk Catalog Item'}*

Retail Market Price: ₹${regularPrice}
Wholesale Deal Rate: *₹${offerPrice} / Piece*
📈 *Huge Profit Margin for Resellers: ${discountPercent}%*

*Batch Details:*
${formattedBullets}

✅ Direct Manufacturer Stock Ready for Dispatch
✅ White-Label Direct Dispatch to Your Buyers Available
✅ Single Piece Sample or Bulk Carton Booking

📲 *Click to Connect on WhatsApp for Bulk Catalog:*
${orderUrl}

_Serious reseller inquiries welcome!_`;
  }

  // 5. Professional & Clean English
  return `✨ *Exclusive Catalog Update | ${businessName}* ✨

We are pleased to introduce our featured product:
*{productName}*

Standard Price: ₹${regularPrice}
Special Offer: *₹${offerPrice}*
Discount: *Save ₹${discountAmount} (${discountPercent}% OFF)*

*Product Specifications:*
${formattedBullets}

✨ 100% Quality Checked & Carefully Packaged
✨ Complimentary Doorstep Delivery Nationwide
✨ Dedicated Customer Assistance

To place your order or view additional images & sizes, please click the secure link:
${orderUrl}

Thank you for supporting *${businessName}*!`;
}

export const WhatsAppAdGenerator: React.FC = () => {
  const [businessName, setBusinessName] = useState<string>('Radhika Ethnic Studio');
  const [productName, setProductName] = useState<string>('Pure Cotton Printed Anarkali Kurti Set with Dupatta');
  const [regularPriceInput, setRegularPriceInput] = useState<string>('1499');
  const [offerPriceInput, setOfferPriceInput] = useState<string>('699');
  const [keyFeatures, setKeyFeatures] = useState<string>(
    'Free Cash on Delivery, Sizes M to XXL, Fast 3-day express delivery, 100% Breathable Cotton'
  );
  const [campaignType, setCampaignType] = useState<CampaignType>('festive');
  const [tone, setTone] = useState<ToneType>('hinglish');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('9876543210');

  // Ad Copy State
  const [editedCopy, setEditedCopy] = useState<string>('');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');

  const hasApiKey = isGeminiConfigured();

  const regularPrice = parsePositiveNumber(regularPriceInput, 0);
  const offerPrice = parsePositiveNumber(offerPriceInput, 0);
  const phoneData = cleanIndianPhoneNumber(whatsappNumber);

  // Auto-compute baseline template copy whenever form values change
  const baselineTemplate = useMemo(() => {
    return generateTemplateCopy({
      businessName,
      productName,
      regularPrice,
      offerPrice,
      keyFeatures,
      campaignType,
      tone,
      phoneIntl: phoneData.intl,
    });
  }, [
    businessName,
    productName,
    regularPrice,
    offerPrice,
    keyFeatures,
    campaignType,
    tone,
    phoneData.intl,
  ]);

  // Sync initial copy with baseline template
  useEffect(() => {
    if (!isAiGenerated) {
      setEditedCopy(baselineTemplate);
    }
  }, [baselineTemplate, isAiGenerated]);

  const discountAmount = regularPrice > offerPrice ? regularPrice - offerPrice : 0;
  const discountPercent =
    regularPrice > offerPrice && regularPrice > 0
      ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100)
      : 0;

  // Handles AI generation using Gemini
  const handleGenerateAi = async () => {
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage('Please enter a product name/title.');
      return;
    }
    if (offerPrice <= 0) {
      setErrorMessage('Offer price must be greater than ₹0.');
      return;
    }

    if (!hasApiKey) {
      // Gracefully switch to template without breaking the app
      setIsAiGenerated(false);
      setEditedCopy(baselineTemplate);
      setErrorMessage(
        'Gemini API key is not yet set in environment. Generated an optimized high-converting marketing template instead!'
      );
      return;
    }

    setIsLoadingAi(true);

    const orderMsg = `Hi ${businessName}, I want to order ${productName} (Deal: Rs.${offerPrice}). Please share details.`;
    const orderUrl = phoneData.intl
      ? `https://wa.me/${phoneData.intl}?text=${encodeURIComponent(orderMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(orderMsg)}`;

    const prompt = `You are a high-performing Indian e-commerce copywriter crafting high-converting WhatsApp promotional broadcast messages for Indian sellers.

Details:
- Business/Brand: ${businessName}
- Product: ${productName}
- Original MRP: ₹${regularPrice}
- Offer/Deal Price: ₹${offerPrice} (${discountPercent}% OFF, Save ₹${discountAmount})
- Key Features/USPs: ${keyFeatures}
- Campaign Theme: ${campaignType}
- Desired Tone: ${tone} (use appropriate Hindi/Hinglish catchphrases if tone is 'hinglish')
- Pre-filled Order Link to include at the end: ${orderUrl}

Formatting Requirements:
1. Use WhatsApp bold formatting (*word*) for product names, prices, and critical callouts.
2. Use ~strikethrough~ on the old MRP price.
3. Use culturally engaging emojis (🔥, 🛍️, 💥, 🚚, 💰, 📦, 📲).
4. Emphasize Cash on Delivery (COD), fast dispatch, and limited stock urgency.
5. End with an urgent Call-to-Action and the exact order link provided above.
6. Do NOT output markdown code blocks (\`\`\` or similar). Output only the ready-to-copy WhatsApp message.`;

    try {
      const res = await generateWithGemini(prompt);
      setIsLoadingAi(false);

      if (res.success && res.content) {
        setEditedCopy(res.content.trim());
        setIsAiGenerated(true);
      } else {
        setIsAiGenerated(false);
        setEditedCopy(baselineTemplate);
        setErrorMessage(
          res.error || 'Gemini response unavailable. Loaded smart marketing template instead.'
        );
      }
    } catch (err: any) {
      setIsLoadingAi(false);
      setIsAiGenerated(false);
      setEditedCopy(baselineTemplate);
      setErrorMessage(err?.message || 'Failed to connect to AI. Reverted to smart template.');
    }
  };

  // Reset back to smart template
  const handleResetToTemplate = () => {
    setIsAiGenerated(false);
    setEditedCopy(baselineTemplate);
    setErrorMessage(null);
  };

  // Safe clipboard copy supporting both modern API and iframe fallbacks
  const handleCopy = async () => {
    const textToCopy = editedCopy || baselineTemplate;
    if (!textToCopy) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Fallback needed');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setErrorMessage('Failed to copy to clipboard automatically. Please select text manually.');
      }
    }
  };

  const activeCopy = editedCopy || baselineTemplate;
  const wordCount = activeCopy.trim().split(/\s+/).filter(Boolean).length;
  const charCount = activeCopy.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              WhatsApp Sales Copywriting
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Groups & Broadcast Ready
            </span>
            {isAiGenerated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini AI Generated
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            WhatsApp Ad Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Create high-converting Hinglish promotional messages, festive sale broadcasts, and flash deal copies with instant wa.me order links.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Ad Text'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Input Column */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Offer & Product Details
            </h2>
            <span className="text-[11px] text-slate-400">Updates Preview Instantly</span>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business / Store Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  placeholder="e.g. Radhika Ethnic Studio"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Contact Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  placeholder="10-digit number e.g. 9876543210"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {phoneData.display && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                    Order Link: wa.me/{phoneData.intl}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (isAiGenerated) setIsAiGenerated(false);
                }}
                placeholder="e.g. Pure Cotton Printed Anarkali Kurti Set"
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Original MRP (₹)
                </label>
                <input
                  type="number"
                  value={regularPriceInput}
                  onChange={(e) => {
                    setRegularPriceInput(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  placeholder="1499"
                  min="0"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Offer / Deal Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={offerPriceInput}
                  onChange={(e) => {
                    setOfferPriceInput(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  placeholder="699"
                  min="1"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {discountPercent > 0 && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                    {discountPercent}% OFF (Save ₹{discountAmount})
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Key Features & USPs (Comma-separated)
              </label>
              <textarea
                rows={2}
                value={keyFeatures}
                onChange={(e) => {
                  setKeyFeatures(e.target.value);
                  if (isAiGenerated) setIsAiGenerated(false);
                }}
                placeholder="Free Cash on Delivery, Sizes M to XXL, 3-day delivery"
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Campaign Type
                </label>
                <select
                  value={campaignType}
                  onChange={(e: any) => {
                    setCampaignType(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="festive">🎉 Festive Celebration (Diwali/Eid)</option>
                  <option value="flash">⚡ 24-Hour Flash Sale</option>
                  <option value="new_arrival">🆕 New Arrival Launch</option>
                  <option value="clearance">🏷️ Stock Clearance Flat Sale</option>
                  <option value="wholesale">📦 Wholesale & Reseller B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Language & Tone
                </label>
                <select
                  value={tone}
                  onChange={(e: any) => {
                    setTone(e.target.value);
                    if (isAiGenerated) setIsAiGenerated(false);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="hinglish">🇮🇳 Hinglish Dhamaka (Best for India)</option>
                  <option value="urgent">⏰ Urgent FOMO (High Urgency)</option>
                  <option value="professional">👔 Boutique & Professional</option>
                  <option value="english">🇬🇧 Clean English</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={isLoadingAi}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoadingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Writing with Gemini 3.8 Flash...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate / Enhance with AI</span>
                  </>
                )}
              </button>

              {isAiGenerated && (
                <button
                  type="button"
                  onClick={handleResetToTemplate}
                  className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Revert to standard template"
                >
                  Reset Template
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live WhatsApp Chat Mockup & Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* View Mode Toggle Header */}
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {businessName || 'WhatsApp Broadcast'}
                </span>
                <span className="text-[10px] text-slate-500">
                  • {wordCount} words ({charCount} chars)
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="w-3 h-3 inline mr-1" />
                  Chat View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    activeTab === 'edit'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Edit3 className="w-3 h-3 inline mr-1" />
                  Edit Text
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5">
              {activeTab === 'preview' ? (
                /* Authentic WhatsApp Chat Bubble Representation */
                <div className="bg-[#efeae2] dark:bg-[#0b141a] p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 relative">
                  <div className="max-w-[95%] bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 p-3.5 rounded-2xl rounded-tr-none shadow-xs font-sans text-xs sm:text-sm whitespace-pre-wrap leading-relaxed relative">
                    {activeCopy}

                    <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-slate-500 dark:text-slate-300">
                      <span>Just now</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Editable Raw Textarea */
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Edit or Personalize Your Ad Copy:
                  </label>
                  <textarea
                    rows={12}
                    value={activeCopy}
                    onChange={(e) => setEditedCopy(e.target.value)}
                    className="w-full p-3 font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Action Buttons: 1-Click Copy & Direct WhatsApp Dispatch */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Ad Message'}</span>
                </button>

                {/* Direct WhatsApp Share (prompts user to pick any contact or group) */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeCopy)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share to WhatsApp</span>
                </a>
              </div>

              {/* Test direct chat on user's own number */}
              {phoneData.intl && (
                <div className="mt-2.5 text-center">
                  <a
                    href={`https://wa.me/${phoneData.intl}?text=${encodeURIComponent(activeCopy)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Test sending message directly to your own number ({phoneData.display})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Practical WhatsApp Copywriting Tips for Bharat Sellers */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-600" />
              Pro Tips for High-Converting WhatsApp Broadcasts:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>
                <strong>Always specify COD</strong>: In India, stating "Cash on Delivery Available" increases order conversions by over 40%.
              </li>
              <li>
                <strong>Use *bold* pricing</strong>: Showing original MRP ~₹1499~ alongside Deal Price *₹699* anchors perceived value.
              </li>
              <li>
                <strong>Clickable wa.me links</strong>: Customers prefer clicking a direct link over manually saving a phone number.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <AdSenseBanner slot="whatsapp-ad-bottom" format="horizontal" />
    </div>
  );
};
