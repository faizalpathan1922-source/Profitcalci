import React, { useState } from 'react';
import { Heading, Copy, Check, Sparkles, AlertCircle, Tag, Search } from 'lucide-react';
import { isGeminiConfigured, generateWithGemini } from '../../utils/aiClient';
import { AiApiNoticeBanner } from '../AiApiNoticeBanner';
import { AdSenseBanner } from '../AdSenseBanner';

export const ProductTitleGenerator: React.FC = () => {
  const [brand, setBrand] = useState<string>('UrbanStitch');
  const [productType, setProductType] = useState<string>('Oversized Cotton T-Shirt for Men');
  const [keyAttributes, setKeyAttributes] = useState<string>('Bio-wash 220 GSM, Round Neck, Drop Shoulder, Solid Black, Casual Streetwear');
  const [marketplace, setMarketplace] = useState<string>('amazon');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedTitles, setGeneratedTitles] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const hasApiKey = isGeminiConfigured();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productType.trim()) {
      setErrorMessage('Please enter a product type/name.');
      return;
    }

    if (!hasApiKey) {
      setErrorMessage('Gemini API key is not configured. As per strict audit guidelines, fake or simulated titles are disabled. Please configure GEMINI_API_KEY in environment secrets.');
      return;
    }

    setIsLoading(true);
    const prompt = `Generate 5 SEO-optimized e-commerce product titles for ${marketplace.toUpperCase()} following algorithmic search guidelines:
Brand: ${brand}
Product: ${productType}
Key Attributes / Keywords: ${keyAttributes}

Ensure:
- Amazon / Flipkart style: [Brand] + [Model/Product] + [Material/Style] + [Color/Size/Key Feature]
- High search-intent ranking words
- Under 150-180 characters each
- Clear numbered list 1 to 5 with character count noted`;

    const res = await generateWithGemini(prompt);
    setIsLoading(false);

    if (res.success && res.content) {
      setGeneratedTitles(res.content);
    } else {
      setErrorMessage(res.error || 'Failed to generate product titles.');
    }
  };

  const handleCopy = () => {
    if (!generatedTitles) return;
    navigator.clipboard.writeText(generatedTitles);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              SEO Title Optimizer
            </span>
            <span className="text-xs text-slate-500">Amazon • Flipkart • Meesho</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Product Title Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate keyword-rich, algorithm-compliant product titles that increase organic click-through rates.
          </p>
        </div>
      </div>

      {!hasApiKey && (
        <AiApiNoticeBanner toolName="Product Title Generator" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. UrbanStitch"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Marketplace
                </label>
                <select
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="amazon">Amazon India (Max 200 chars)</option>
                  <option value="flipkart">Flipkart (Concise & Specific)</option>
                  <option value="meesho">Meesho (Catalog Search Terms)</option>
                  <option value="myntra">Myntra / Ajio (Fashion Brand Standard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Core Product Type *
              </label>
              <input
                type="text"
                required
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g. Oversized Cotton T-Shirt for Men"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Key Attributes, Colors, Materials & Specs
              </label>
              <textarea
                rows={2}
                value={keyAttributes}
                onChange={(e) => setKeyAttributes(e.target.value)}
                placeholder="220 GSM, Bio-wash, Drop Shoulder, Solid Black..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                hasApiKey
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Generating with Gemini...' : hasApiKey ? 'Generate Optimized Titles' : 'Test Form (API Required)'}</span>
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SEO Title Suggestions
              </h2>
              {generatedTitles && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {generatedTitles ? (
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl font-sans text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {generatedTitles}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Titles Generated Yet</p>
                <p className="text-[11px] text-slate-500">
                  {hasApiKey
                    ? 'Enter product attributes and generate titles.'
                    : 'External Gemini API is required. Fake content is disabled.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSenseBanner slot="product-title-bottom" format="horizontal" />
    </div>
  );
};
