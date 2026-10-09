import React, { useState } from 'react';
import { Share2, Copy, Check, Sparkles, AlertCircle, Target, TrendingUp } from 'lucide-react';
import { isGeminiConfigured, generateWithGemini } from '../../utils/aiClient';
import { AiApiNoticeBanner } from '../AiApiNoticeBanner';
import { AdSenseBanner } from '../AdSenseBanner';

export const SocialMediaAdGenerator: React.FC = () => {
  const [productName, setProductName] = useState<string>('Wireless Earbuds with 40H Playtime');
  const [targetAudience, setTargetAudience] = useState<string>('College students, working professionals & gamers in India');
  const [adAngle, setAdAngle] = useState<string>('problem_solution');
  const [adPlatform, setAdPlatform] = useState<string>('meta');
  const [offerText, setOfferText] = useState<string>('Special Launch Offer: Flat 50% Off + 1 Year Warranty + Cash on Delivery');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedAd, setGeneratedAd] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const hasApiKey = isGeminiConfigured();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!productName.trim()) {
      setErrorMessage('Please enter a product name.');
      return;
    }

    if (!hasApiKey) {
      setErrorMessage('Gemini API key is not configured. As per strict audit guidelines, fake or simulated ad copy is disabled. Please configure GEMINI_API_KEY in environment secrets.');
      return;
    }

    setIsLoading(true);
    const prompt = `Write high-converting paid social ad copy for an Indian e-commerce / D2C business running ads on ${adPlatform.toUpperCase()}:
Product: ${productName}
Target Audience: ${targetAudience}
Marketing Angle: ${adAngle} (e.g., Problem-Solution / Social Proof / FOMO Urgency)
Offer Details: ${offerText}

Provide:
1. 3 High-CTR Primary Text Variations (Short punchy, Story hook, Feature list)
2. 3 High-CTR Headlines (under 40 characters for Meta / Google Ads)
3. Call-to-Action recommendation`;

    const res = await generateWithGemini(prompt);
    setIsLoading(false);

    if (res.success && res.content) {
      setGeneratedAd(res.content);
    } else {
      setErrorMessage(res.error || 'Failed to generate ad copy.');
    }
  };

  const handleCopy = () => {
    if (!generatedAd) return;
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
              Paid Ads Copywriter
            </span>
            <span className="text-xs text-slate-500">Facebook, Instagram & Google Ads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Social Media Ad Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate high-CTR promotional ad copies for Meta Ads, Instagram sponsored reels, and Google Shopping.
          </p>
        </div>
      </div>

      {!hasApiKey && (
        <AiApiNoticeBanner toolName="Social Media Ad Generator" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Product / Service Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Wireless Earbuds with 40H Playtime"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Ad Platform
                </label>
                <select
                  value={adPlatform}
                  onChange={(e) => setAdPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="meta">Meta Ads (Facebook & Instagram Feed)</option>
                  <option value="reels">Instagram Reels Video Script</option>
                  <option value="google">Google Search / Performance Max</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Marketing Angle
                </label>
                <select
                  value={adAngle}
                  onChange={(e) => setAdAngle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="problem_solution">Problem-Solution (Pain Point)</option>
                  <option value="fomo_urgent">FOMO & Urgency (Flash Discount)</option>
                  <option value="social_proof">Social Proof (Customer Reviews)</option>
                  <option value="curiosity_lifestyle">Curiosity & Lifestyle Aspiration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. College students, young professionals, mothers"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Special Offer / Hook
              </label>
              <input
                type="text"
                value={offerText}
                onChange={(e) => setOfferText(e.target.value)}
                placeholder="e.g. Flat 50% Off + Free Delivery + COD Available"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500"
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
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Generating with Gemini...' : hasApiKey ? 'Generate High-CTR Ad Copies' : 'Test Form (API Required)'}</span>
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Generated Ad Copy
              </h2>
              {generatedAd && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {generatedAd ? (
              <div className="p-4 bg-indigo-50/40 border border-indigo-200 rounded-xl font-sans text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {generatedAd}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <Target className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Ads Generated Yet</p>
                <p className="text-[11px] text-slate-500">
                  {hasApiKey
                    ? 'Enter campaign details and generate Meta/Google ad copy.'
                    : 'External Gemini API is required. Fake content is disabled.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdSenseBanner slot="social-ad-bottom" format="horizontal" />
    </div>
  );
};
