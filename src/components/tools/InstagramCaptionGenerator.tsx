import React, { useState } from 'react';
import { Instagram, Copy, Check, Sparkles, AlertCircle, Hash, RefreshCw } from 'lucide-react';
import { isGeminiConfigured, generateWithGemini } from '../../utils/aiClient';
import { AiApiNoticeBanner } from '../AiApiNoticeBanner';
import { AdSenseBanner } from '../AdSenseBanner';

export const InstagramCaptionGenerator: React.FC = () => {
  const [productName, setProductName] = useState<string>('Handcrafted Kundan Choker Necklace Set');
  const [niche, setNiche] = useState<string>('ethnic_jewellery');
  const [offerDetails, setOfferDetails] = useState<string>('Flat 25% Off + Free Shipping across India');
  const [captionTone, setCaptionTone] = useState<string>('aesthetic');
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCaption, setGeneratedCaption] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const hasApiKey = isGeminiConfigured();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage('Please enter a product or topic name.');
      return;
    }

    if (!hasApiKey) {
      setErrorMessage('Gemini API key is not configured. As per strict audit guidelines, fake or simulated AI content is disabled. Please configure GEMINI_API_KEY in environment secrets.');
      return;
    }

    setIsLoading(true);
    const prompt = `Write 2 aesthetic, high-engagement Instagram captions for an Indian e-commerce / D2C brand:
Product: ${productName}
Niche: ${niche}
Offer/Promotion: ${offerDetails}
Tone: ${captionTone}
${includeHashtags ? 'Include 15-20 trending, targeted Indian e-commerce hashtags for Instagram explore feed.' : 'No hashtags.'}
Format with strong hook line, spacing, call-to-action (Link in bio / DM to order), and emojis.`;

    const res = await generateWithGemini(prompt);
    setIsLoading(false);

    if (res.success && res.content) {
      setGeneratedCaption(res.content);
    } else {
      setErrorMessage(res.error || 'Failed to generate Instagram caption.');
    }
  };

  const handleCopy = () => {
    if (!generatedCaption) return;
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
              Social Media AI Tool
            </span>
            <span className="text-xs text-slate-500">Reels, Carousels & Posts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instagram Caption Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Craft engaging Instagram captions with hooks, emojis, calls to action, and targeted e-commerce hashtags.
          </p>
        </div>
      </div>

      {!hasApiKey && (
        <AiApiNoticeBanner toolName="Instagram Caption Generator" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Product / Reel Topic *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Handcrafted Kundan Choker Set"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category / Niche
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="fashion_ethnic">Ethnic Wear & Sarees</option>
                  <option value="ethnic_jewellery">Jewellery & Accessories</option>
                  <option value="footwear">Footwear & Juttis</option>
                  <option value="beauty_skincare">Beauty & Organic Skincare</option>
                  <option value="home_decor">Home Decor & Handicrafts</option>
                  <option value="electronics_gadgets">Gadgets & Mobile Covers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Caption Style / Tone
                </label>
                <select
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="aesthetic">Aesthetic & Elegant (Boutique)</option>
                  <option value="casual_relatable">Casual & Relatable (Gen-Z)</option>
                  <option value="promotional_urgent">Promotional & Urgent (Flash Sale)</option>
                  <option value="storytelling">Storytelling & Craftsmanship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Special Offer or Highlights
              </label>
              <input
                type="text"
                value={offerDetails}
                onChange={(e) => setOfferDetails(e.target.value)}
                placeholder="e.g. Flat 25% Off + Free Shipping across India"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="insta-hashtags"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="insta-hashtags" className="text-xs text-slate-700 font-medium">
                Include relevant viral e-commerce hashtags (#ExplorePage #ShopOnline)
              </label>
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
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Generating with Gemini...' : hasApiKey ? 'Generate Instagram Captions' : 'Test Form (API Required)'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Generated Instagram Caption
              </h2>
              {generatedCaption && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {generatedCaption ? (
              <div className="p-4 bg-pink-50/40 border border-pink-200 rounded-xl font-sans text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {generatedCaption}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <Instagram className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Caption Generated Yet</p>
                <p className="text-[11px] text-slate-500">
                  {hasApiKey
                    ? 'Enter product details to generate Instagram captions.'
                    : 'External Gemini API is required. Fake content is disabled.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSenseBanner slot="insta-caption-bottom" format="horizontal" />
    </div>
  );
};
