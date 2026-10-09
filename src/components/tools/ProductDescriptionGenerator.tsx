import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isGeminiConfigured, generateWithGemini } from '../../utils/aiClient';
import { AdSenseBanner } from '../AdSenseBanner';

function generateListingTemplate(params: {
  productName: string;
  category: string;
  features: string;
  targetPlatform: 'amazon' | 'meesho' | 'shopify';
}): string {
  const { productName, category, features, targetPlatform } = params;
  const featureBullets = features
    .split(/[,;\n]+/)
    .map((f) => f.trim())
    .filter(Boolean);

  if (targetPlatform === 'amazon') {
    return `📌 PRODUCT TITLE:
${productName} | Premium Quality ${category} for Everyday Use & Gifting

🔹 ABOUT THIS ITEM (5 BULLET POINTS):
• PREMIUM QUALITY MATERIAL: Crafted with high-grade, durable materials ensuring prolonged longevity and superior comfort.
• KEY SPECIFICATIONS: ${featureBullets[0] || 'Optimized dimensions, lightweight build, and skin-friendly finish'}.
• VERSATILE USAGE: ${featureBullets[1] || 'Perfect for daily wear, festive gatherings, office use, or special occasions'}.
• EASY CARE & MAINTENANCE: Low maintenance care. Follow standard handling guidelines to retain original color and texture.
• PROUDLY PACKAGED: Comes securely packed in tamper-proof protective packaging. Ideal choice for personal use or gifting to loved ones.

📝 PRODUCT DESCRIPTION:
Elevate your collection with the all-new ${productName}. Carefully engineered to cater to modern Indian buyers, this ${category} offering combines timeless aesthetics with practical everyday durability. Whether you are buying for yourself or searching for a thoughtful gift, this item stands out with its authentic craftsmanship and attention to detail.

Backed by meticulous quality checks and secure packaging, you can shop with complete peace of mind. Add to cart today and experience genuine Indian craftsmanship delivered straight to your doorstep.

🔍 BACKEND SEARCH KEYWORDS (249 BYTES):
${productName.toLowerCase()} ${category.toLowerCase()} online shopping best quality affordable indian seller fast delivery premium daily use`;
  }

  if (targetPlatform === 'meesho') {
    return `📦 MEESHO CATALOG SPECIFICATIONS:

Product Name: ${productName}
Category: ${category}
Material: Premium Quality
Occasion: Casual / Daily / Festive / Formal
Sizes / Pack: Standard Size (Free Size / S-XXL)
Net Quantity: 1 Unit
Country of Origin: India

✨ DETAILED SPECIFICATIONS:
${
  featureBullets.length > 0
    ? featureBullets.map((f, i) => `${i + 1}. ${f}`).join('\n')
    : '1. Premium Quality\n2. Durable Finishing\n3. Fast Dispatch'
}

🛒 RESELLER NOTE:
Guaranteed high quality with minimal customer return rates. Keep handsome profit margins when sharing with your WhatsApp / Facebook buyers. Real product images matched with dispatch quality.`;
  }

  // Shopify
  return `✨ ${productName.toUpperCase()} — THE ULTIMATE ${category.toUpperCase()}

Experience the perfect harmony of quality, comfort, and timeless Indian craftsmanship with our bestselling ${productName}.

WHY YOU'LL LOVE IT:
${
  featureBullets.length > 0
    ? featureBullets.map((f) => `✓ ${f}`).join('\n')
    : '✓ Premium Finishing\n✓ Comfortable Wear\n✓ Authentic Indian Craftsmanship'
}

CARE & DETAILS:
• Category: ${category}
• Origin: Handcrafted with pride in India
• Dispatch: Dispatched within 24–48 hours in secure protective boxing.

Upgrade your lifestyle or surprise someone special with a gift that truly lasts. Order today with free nationwide delivery and Cash on Delivery!`;
}

export const ProductDescriptionGenerator: React.FC = () => {
  const [productName, setProductName] = useState<string>('Jaipuri Hand-Block Printed Cotton Saree');
  const [category, setCategory] = useState<string>('Ethnic Wear');
  const [features, setFeatures] = useState<string>(
    '100% pure mulmul cotton, 5.5 meters length with 0.8 meter blouse piece, natural organic vegetable dyes, skin friendly and breathable, festive or daily office wear'
  );
  const [targetPlatform, setTargetPlatform] = useState<'amazon' | 'meesho' | 'shopify'>('amazon');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasApiKey = isGeminiConfigured();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage('Please enter a product title/name.');
      return;
    }

    const fallbackTemplate = generateListingTemplate({
      productName,
      category,
      features,
      targetPlatform,
    });

    if (!hasApiKey) {
      setGeneratedText(fallbackTemplate);
      setIsAiGenerated(false);
      setErrorMessage(
        'Gemini API key is not configured. Generated an optimized high-converting e-commerce template instead!'
      );
      return;
    }

    setIsLoading(true);
    const prompt = `Write an optimized e-commerce product listing for an Indian seller on ${targetPlatform.toUpperCase()}:
Product Title: ${productName}
Category: ${category}
Key Details & Specifications: ${features}

Format clearly:
1. SEO Optimized Title (keywords, brandable, under 180 chars)
2. 5 High-Converting Bullet Points (Highlight Quality, Material, Fit/Dimensions, Care Instructions, Ideal Occasion)
3. Rich 2-Paragraph Product Description
4. 10 High Search-Volume Keywords for backend search terms`;

    try {
      const res = await generateWithGemini(prompt);
      setIsLoading(false);

      if (res.success && res.content) {
        setGeneratedText(res.content);
        setIsAiGenerated(true);
      } else {
        setGeneratedText(fallbackTemplate);
        setIsAiGenerated(false);
        setErrorMessage(
          res.error || 'Gemini response unavailable. Loaded smart e-commerce template instead.'
        );
      }
    } catch (err: any) {
      setIsLoading(false);
      setGeneratedText(fallbackTemplate);
      setIsAiGenerated(false);
      setErrorMessage(err?.message || 'Failed to connect to AI. Reverted to smart template.');
    }
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedText);
      } else {
        throw new Error('Fallback');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = generatedText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              E-Commerce Catalog Tool
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Amazon • Meesho • Flipkart • Shopify
            </span>
            {isAiGenerated && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 dark:bg-violet-950 text-violet-800 dark:text-violet-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini AI Generated
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Description Generator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Generate high-converting Amazon bullet points, Meesho catalog descriptions, and SEO-friendly specifications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Product Name / Item *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Jaipuri Hand-Block Printed Cotton Saree"
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Product Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Ethnic Wear, Electronics"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Target Marketplace
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e: any) => setTargetPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="amazon">Amazon India (Title + 5 Bullets)</option>
                  <option value="meesho">Meesho (Catalog Format + Specs)</option>
                  <option value="shopify">Shopify / D2C Store (Storytelling)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Key Features, Materials & Dimensions
              </label>
              <textarea
                rows={3}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Pure cotton, breathable, hand-wash, free size, length 5.5m..."
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Listing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{hasApiKey ? 'Generate AI Description' : 'Generate Description'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Generated Listing Copy
              </h2>
              {generatedText && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {generatedText ? (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                  {generatedText}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Entire Listing'}</span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No Description Generated Yet
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enter product features and click "Generate Description" to view your listing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSenseBanner slot="product-desc-bottom" format="horizontal" />
    </div>
  );
};
