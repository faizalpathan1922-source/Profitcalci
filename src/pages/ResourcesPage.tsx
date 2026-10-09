import React from 'react';
import { BookOpen, ArrowRight, ShieldCheck, TrendingDown, Percent, FileCheck } from 'lucide-react';

interface ResourcesPageProps {
  onSelectTool: (slug: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onSelectTool }) => {
  const articles = [
    {
      title: 'How to Factor in RTO Return Losses on Meesho & COD Orders',
      category: 'E-commerce Margins',
      readTime: '4 min read',
      excerpt: 'Most Indian sellers price solely on referral fee and forget that 15% to 25% of Cash-on-Delivery orders return to origin. Learn how to absorb return courier costs without losing money.',
      toolSlug: 'profit-calculator',
      toolLabel: 'Use Profit Calculator',
    },
    {
      title: 'Intra-State vs Inter-State GST: When to Charge CGST vs IGST',
      category: 'Tax Compliance',
      readTime: '5 min read',
      excerpt: 'Understand how Place of Supply determines whether your invoice must split into 50% CGST + 50% SGST or 100% IGST, and avoid common errors on tax invoices.',
      toolSlug: 'gst-calculator',
      toolLabel: 'Use GST Calculator',
    },
    {
      title: 'Reverse Pricing: Finding Your Safe Listing Price on Amazon India',
      category: 'Pricing Strategy',
      readTime: '3 min read',
      excerpt: 'Step-by-step mathematical guide to reverse-engineer your required selling price given your product cost, target margin, closing fees, and logistics brackets.',
      toolSlug: 'selling-price-calculator',
      toolLabel: 'Use Selling Price Tool',
    },
    {
      title: 'Writing High-Converting WhatsApp Broadcast Messages in Hinglish',
      category: 'Marketing & Sales',
      readTime: '3 min read',
      excerpt: 'Why conversational Hinglish and WhatsApp markdown bolding (*bold*) yield 3x higher click-through and reply rates for Indian fashion and electronics resellers.',
      toolSlug: 'whatsapp-ad-generator',
      toolLabel: 'Use WhatsApp Ad Tool',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Title */}
      <div className="text-center">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          Knowledge & Guides
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Seller Guides & Resources
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Practical strategies and tips to run a profitable online and retail business in India.
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <div
            key={article.title}
            className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-2">
                <span>{article.category}</span>
                <span>•</span>
                <span className="text-slate-400">{article.readTime}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {article.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Free Seller Resource</span>
              <button
                type="button"
                onClick={() => onSelectTool(article.toolSlug)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>{article.toolLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
