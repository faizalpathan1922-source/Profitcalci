export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'gst' | 'marketplaces' | 'invoicing' | 'privacy';
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'what-is-profitcalci',
    category: 'general',
    question: 'What is ProfitCalci?',
    answer: 'ProfitCalci is a free business calculator and tools platform designed for Indian sellers, entrepreneurs, retailers and small businesses. It brings together practical tools including GST calculations, marketplace fee & profit estimators, selling price planners, professional GST tax invoice generation, and WhatsApp promotional copy generators in one fast, free, mobile-friendly interface.',
  },
  {
    id: 'are-calculators-free',
    category: 'general',
    question: 'Are the calculators free?',
    answer: 'Yes! All core calculators and tools on ProfitCalci are 100% free to use with no hidden charges, mandatory sign-ups, or credit card requirements. We believe Indian small businesses and MSMEs deserve fast, accessible business utilities without paywalls.',
  },
  {
    id: 'are-gst-calculations-official',
    category: 'gst',
    question: 'Are the GST calculations official?',
    answer: 'No. ProfitCalci provides mathematical estimations and informational calculations based on standard Indian GST tax provisions (CGST, SGST, IGST, and prevailing tax slabs 0%, 3%, 5%, 12%, 18%, 28%). While our formulas reflect current statutory rules, these calculations do not constitute official government tax returns or legal advice. Businesses should always verify tax filings with qualified Chartered Accountants (CAs), GST practitioners, or the official GST portal (gst.gov.in).',
  },
  {
    id: 'can-i-use-for-business',
    category: 'general',
    question: 'Can I use ProfitCalci for my business?',
    answer: 'Absolutely. Indian online sellers, retail shopkeepers, D2C brands, wholesalers, and freelance professionals use ProfitCalci to price their products profitably, calculate margin buffers, plan sales on e-commerce platforms, draft customer invoices, and create marketing copy.',
  },
  {
    id: 'are-marketplace-profit-calculations-exact',
    category: 'marketplaces',
    question: 'Are marketplace profit calculations exact?',
    answer: 'Marketplace calculations provide close realistic estimations based on published category referral commission rates, standard closing fees, and logistics brackets. However, actual marketplace payouts may fluctuate depending on weight discrepancies (dead weight vs volumetric weight), shipping zone (local, regional, national), seller tier benefits, GST TCS deductions, ad spend, and variable RTO/customer return rates.',
  },
  {
    id: 'can-i-download-invoices',
    category: 'invoicing',
    question: 'Can I download invoices?',
    answer: 'Yes! The Invoice Generator allows you to instantly print your formatted GST tax invoice or save it directly as a clean PDF using your browser\'s Print dialog (Print to PDF). The layout is optimized for standard A4 paper with proper borders, HSN breakdowns, state codes, UPI QR code, and signature fields.',
  },
  {
    id: 'affiliation-disclaimer',
    category: 'general',
    question: 'Is ProfitCalci affiliated with Meesho or Amazon?',
    answer: 'No. ProfitCalci is an independent platform and is not affiliated, endorsed by, or connected with Meesho (Fashnear Technologies), Amazon India, Flipkart, GST authorities, the Ministry of Finance, or any government organization. All brand names and trademarks belong to their respective owners.',
  },
  {
    id: 'data-privacy',
    category: 'privacy',
    question: 'Does ProfitCalci save my customer data or business prices?',
    answer: 'No. ProfitCalci calculations and invoices run securely inside your browser. Your customer names, pricing, and business details are not stored on external servers or sold to third parties. When you close or clear your tab, your entered private details remain under your control.',
  },
];
