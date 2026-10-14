import { TOOLS_LIST } from '../data/toolsData';

export interface PageMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath: string;
  schemaType?: 'WebApplication' | 'WebSite' | 'ItemPage';
  toolName?: string;
}

const STATIC_PAGE_SEO: Record<string, PageMetadata> = {
  '/': {
    title: 'ProfitCalci - Free Business Calculators & GST Tools for Indian Sellers',
    description: 'Free business toolkit for Indian sellers and retailers. Free GST calculator, net profit calculator, selling price calculator, invoice generator, and marketing tools.',
    canonicalPath: '/',
    schemaType: 'WebSite',
  },
  '/tools': {
    title: 'Business Toolkit & Calculators Directory | ProfitCalci',
    description: 'Explore 20+ free business calculators, GST tools, invoice generators, COD loss calculators, and copywriting tools designed for Indian sellers.',
    canonicalPath: '/tools',
    schemaType: 'WebSite',
  },
  '/about': {
    title: 'About ProfitCalci - Empowering Indian Small Businesses & E-Commerce',
    description: 'Learn about ProfitCalci mission to provide 100% free, accurate, private, and localized business calculators for Indian sellers and retailers.',
    canonicalPath: '/about',
    schemaType: 'WebSite',
  },
  '/faq': {
    title: 'Frequently Asked Questions (FAQ) - GST, Profit & Fees | ProfitCalci',
    description: 'Find answers to common questions about GST calculations, Meesho/Amazon seller fees, profit margins, COD return loss, and invoice generation.',
    canonicalPath: '/faq',
    schemaType: 'WebSite',
  },
  '/contact': {
    title: 'Contact Us & Feedback | ProfitCalci',
    description: 'Have questions, suggestions, or feature requests for ProfitCalci? Get in touch with our team for quick support.',
    canonicalPath: '/contact',
    schemaType: 'WebSite',
  },
  '/pricing': {
    title: '100% Free Forever - No Hidden Fees | ProfitCalci',
    description: 'ProfitCalci is completely free for Indian sellers, D2C startups, and shopkeepers. No subscriptions, no lock-in, no registration required.',
    canonicalPath: '/pricing',
    schemaType: 'WebSite',
  },
  '/resources': {
    title: 'Seller Resources, GST Guides & Growth Calculators | ProfitCalci',
    description: 'Curated seller guides, e-commerce profit strategies, HSN lookup directories, and tax filing resources for Indian businesses.',
    canonicalPath: '/resources',
    schemaType: 'WebSite',
  },
  '/privacy': {
    title: 'Privacy Policy - Zero-Data Retention | ProfitCalci',
    description: 'Read ProfitCalci privacy commitment. All calculation figures, invoices, and inputs are processed strictly client-side on your device.',
    canonicalPath: '/privacy',
    schemaType: 'WebSite',
  },
  '/terms': {
    title: 'Terms of Service | ProfitCalci',
    description: 'Terms of service, usage guidelines, and disclaimers for using ProfitCalci free business calculators and document generators.',
    canonicalPath: '/terms',
    schemaType: 'WebSite',
  },
  '/disclaimer': {
    title: 'Disclaimer & Financial Notice | ProfitCalci',
    description: 'Important financial and tax calculation disclaimer for users of ProfitCalci business tools and calculators.',
    canonicalPath: '/disclaimer',
    schemaType: 'WebSite',
  },
};

// Rich custom titles for each tool tailored for Indian search keywords
const TOOL_TITLE_OVERRIDES: Record<string, { title: string; extraKeywords: string }> = {
  'gst-calculator': {
    title: 'GST Calculator India - CGST, SGST & IGST Split | ProfitCalci',
    extraKeywords: 'Calculate 5%, 12%, 18%, 28% GST inclusive and exclusive amounts with step-by-step tax computation.',
  },
  'profit-calculator': {
    title: 'Net Profit & Margin Calculator for Sellers | ProfitCalci',
    extraKeywords: 'Calculate net profit, profit margin percentage, and markup on cost with shipping, packaging, and deductions.',
  },
  'selling-price-calculator': {
    title: 'Selling Price Calculator - Target Margin & Markup | ProfitCalci',
    extraKeywords: 'Reverse calculate your target retail selling price from cost price, shipping, overheads, and desired profit margin.',
  },
  'discount-calculator': {
    title: 'Discount Calculator - Flat Off & Percentage Savings | ProfitCalci',
    extraKeywords: 'Compute discounted price, exact money saved, and bulk quantity totals from percentage or flat discounts.',
  },
  'break-even-calculator': {
    title: 'Break-Even Calculator - Units & Revenue Required | ProfitCalci',
    extraKeywords: 'Calculate break-even units and target turnover to cover fixed operating expenses and variable unit costs.',
  },
  'marketplace-profit-calculator': {
    title: 'Marketplace Profit Calculator - Meesho, Amazon & Flipkart | ProfitCalci',
    extraKeywords: 'Calculate net seller payouts across Amazon Easy Ship, Flipkart FBF, and Meesho 0% commission models.',
  },
  'shopify-calculator': {
    title: 'Shopify & D2C Profit Calculator - CAC, ROAS & PG Fees | ProfitCalci',
    extraKeywords: 'Model Shopify D2C store profitability with Meta/Google ad CAC, Razorpay/Cashfree fees, courier shipping, and RTO.',
  },
  'cod-profit-calculator': {
    title: 'COD Profit Calculator - RTO Return Rate & Reverse Freight | ProfitCalci',
    extraKeywords: 'Analyze true cash-on-delivery profits after courier RTO return rate percentage and reverse logistics freight.',
  },
  'return-loss-calculator': {
    title: 'E-commerce Return Loss Calculator - RTO Financial Drain | ProfitCalci',
    extraKeywords: 'Quantify monthly money lost to courier freight, packaging wastage, and product damages on customer returns.',
  },
  'invoice-generator': {
    title: 'Free GST Invoice Generator - PDF Download & Print | ProfitCalci',
    extraKeywords: 'Create GST-compliant tax invoices with HSN codes, state tax splits, UPI QR code, and instant A4 PDF download.',
  },
  'quotation-generator': {
    title: 'Free Quotation & Price Estimate Generator - PDF | ProfitCalci',
    extraKeywords: 'Generate professional business quotations and proforma estimates with validity dates and print ready layout.',
  },
  'receipt-generator': {
    title: 'Payment Receipt Generator - Cash & UPI Payment Voucher | ProfitCalci',
    extraKeywords: 'Issue formal cash payment vouchers and transaction receipts with amount in words and authorized sign.',
  },
  'bulk-profit-calculator': {
    title: 'Bulk Profit Calculator - Multi-Product Batch Margins | ProfitCalci',
    extraKeywords: 'Calculate overall portfolio margins and total profit across multi-product inventory batches and wholesale lots.',
  },
  'qr-code-generator': {
    title: 'Instant QR Code Generator - UPI, URL & WhatsApp QR | ProfitCalci',
    extraKeywords: 'Generate customizable high-resolution QR codes for UPI payments, website URLs, and WhatsApp chats.',
  },
  'image-to-pdf': {
    title: 'Image to PDF Converter - Convert JPG & PNG to A4 PDF | ProfitCalci',
    extraKeywords: 'Convert product photos, bills, receipts, and invoices into a high-quality printable A4 PDF document.',
  },
  'whatsapp-ad-generator': {
    title: 'WhatsApp Ad & Broadcast Message Generator | ProfitCalci',
    extraKeywords: 'Create high-converting WhatsApp promotional messages, festive sale broadcasts, and flash deal copy.',
  },
  'instagram-caption-generator': {
    title: 'Instagram Caption Generator - E-commerce Reels & Posts | ProfitCalci',
    extraKeywords: 'Create engaging Instagram captions with hooks, emojis, calls to action, and trending Indian hashtags.',
  },
  'product-description-generator': {
    title: 'Amazon & Meesho Product Description Generator | ProfitCalci',
    extraKeywords: 'Generate SEO bullet points and high-converting product descriptions for Amazon, Flipkart, and Meesho listings.',
  },
  'product-title-generator': {
    title: 'SEO Product Title Generator for Marketplace Listings | ProfitCalci',
    extraKeywords: 'Create keyword-rich product titles optimized for Amazon, Flipkart, and Meesho search ranking algorithms.',
  },
  'social-media-ad-generator': {
    title: 'Social Media Ad Copy Generator - Facebook & Instagram Ads | ProfitCalci',
    extraKeywords: 'Generate high CTR ad hooks and compelling promotional copy for Meta ads and Google Shopping.',
  },
  'marketplace-comparison': {
    title: 'Marketplace Comparison Tool - Meesho vs Amazon vs Flipkart | ProfitCalci',
    extraKeywords: 'Compare net margins side-by-side across Meesho, Amazon India, Flipkart, and Shopify D2C store.',
  },
  'hsn-finder': {
    title: 'HSN Code & GST Rate Finder - Search 4 & 6-Digit Codes | ProfitCalci',
    extraKeywords: 'Lookup HSN and SAC codes with applicable GST slabs for textiles, apparel, electronics, and goods.',
  },
  'margin-calculator': {
    title: 'Gross Margin & Markup Calculator with Formula | ProfitCalci',
    extraKeywords: 'Convert between gross profit margin percentage and cost markup percentage with bi-directional formula.',
  },
};

/**
 * Returns complete SEO metadata for any given pathname in the app
 */
export function getPageMetadata(pathname: string): PageMetadata {
  const cleanPath = pathname.split('?')[0].split('#')[0] || '/';

  // 1. Static pages
  if (STATIC_PAGE_SEO[cleanPath]) {
    return STATIC_PAGE_SEO[cleanPath];
  }

  // 2. Tool routes: /tool/:slug
  if (cleanPath.startsWith('/tool/')) {
    const slug = cleanPath.replace('/tool/', '');
    const tool = TOOLS_LIST.find((t) => t.slug === slug);
    const override = TOOL_TITLE_OVERRIDES[slug];

    if (tool) {
      const title = override ? override.title : `${tool.name} India - Free Business Calculator | ProfitCalci`;
      const description = `${tool.description} ${override ? override.extraKeywords : ''}`.trim();

      return {
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        canonicalPath: `/tool/${slug}`,
        schemaType: 'WebApplication',
        toolName: tool.name,
      };
    }
  }

  // Fallback default
  return {
    title: 'ProfitCalci - Free Business Calculators & Tools for Indian Sellers',
    description: 'Free business calculators and tools for Indian sellers, retailers, and small businesses.',
    canonicalPath: cleanPath,
    schemaType: 'WebSite',
  };
}

/**
 * Injects or updates dynamic SoftwareApplication / WebApplication JSON-LD schema
 */
export function updateDynamicStructuredData(meta: PageMetadata) {
  const SCRIPT_ID = 'profitcalci-dynamic-jsonld';
  let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (meta.schemaType === 'WebApplication' && meta.toolName) {
    const fullUrl = `https://profitcalci.in${meta.canonicalPath}`;
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${fullUrl}#webapp`,
      name: `${meta.toolName} - ProfitCalci`,
      url: fullUrl,
      description: meta.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      inLanguage: 'en-IN',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ProfitCalci',
        url: 'https://profitcalci.in/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://profitcalci.in/logo.png',
        },
      },
    };

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData, null, 2);
  } else {
    // If navigating to home or non-tool page, remove the tool-specific schema so the root WebSite schema takes precedence
    if (scriptElement) {
      scriptElement.remove();
    }
  }
}
