import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToolSearchModal } from './components/ToolSearchModal';
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { LegalPage } from './pages/LegalPage';
import { PricingPage } from './pages/PricingPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { OfflineIndicator } from './components/OfflineIndicator';

// Tool Components
import { GstCalculator } from './components/tools/GstCalculator';
import { ProfitCalculator } from './components/tools/ProfitCalculator';
import { SellingPriceCalculator } from './components/tools/SellingPriceCalculator';
import { InvoiceGenerator } from './components/tools/InvoiceGenerator';
import { WhatsAppAdGenerator } from './components/tools/WhatsAppAdGenerator';
import { MarketplaceComparison } from './components/tools/MarketplaceComparison';
import { HsnFinder } from './components/tools/HsnFinder';
import { QrBarcodeGenerator } from './components/tools/QrBarcodeGenerator';
import { MarginMarkupCalculator } from './components/tools/MarginMarkupCalculator';
import { ProductDescriptionGenerator } from './components/tools/ProductDescriptionGenerator';
import { DiscountCalculator } from './components/tools/DiscountCalculator';
import { BreakEvenCalculator } from './components/tools/BreakEvenCalculator';
import { MarketplaceProfitCalculator } from './components/tools/MarketplaceProfitCalculator';
import { CodProfitCalculator } from './components/tools/CodProfitCalculator';
import { ReturnLossCalculator } from './components/tools/ReturnLossCalculator';
import { QuotationGenerator } from './components/tools/QuotationGenerator';
import { ReceiptGenerator } from './components/tools/ReceiptGenerator';
import { BulkProfitCalculator } from './components/tools/BulkProfitCalculator';
import { ImageToPdfConverter } from './components/tools/ImageToPdfConverter';
import { InstagramCaptionGenerator } from './components/tools/InstagramCaptionGenerator';
import { ProductTitleGenerator } from './components/tools/ProductTitleGenerator';
import { SocialMediaAdGenerator } from './components/tools/SocialMediaAdGenerator';
import { ShopifyCalculator } from './components/tools/ShopifyCalculator';
import { AdminPage } from './pages/AdminPage';
import { DynamicCalculatorRenderer } from './components/DynamicCalculatorRenderer';
import { useAdminConfig } from './context/AdminConfigContext';
import { ChevronRight, Home, Calculator, TrendingUp, FileText, MessageSquareShare, Share2, CheckCircle2 } from 'lucide-react';
import { TOOLS_LIST } from './data/toolsData';
import { recordRecentlyUsedTool } from './utils/recentTools';
import { shareContent } from './utils/shareTool';
import { getPageMetadata, updateDynamicStructuredData } from './utils/seoConfig';

export default function App() {
  const { allManagedTools, activeTools } = useAdminConfig();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/tool/')) {
        recordRecentlyUsedTool(path.replace('/tool/', ''));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Also record if initial load was on a tool path
  useEffect(() => {
    if (currentPath.startsWith('/tool/')) {
      recordRecentlyUsedTool(currentPath.replace('/tool/', ''));
    }
  }, []);

  // Full Technical SEO & Dynamic Meta/Schema Updates
  useEffect(() => {
    const meta = getPageMetadata(currentPath);

    // 1. Dynamic Document Title
    document.title = meta.title;

    // 2. Dynamic Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);

    // 3. Dynamic OpenGraph & Twitter Cards
    const updateOrCreateMeta = (attribute: 'property' | 'name', attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogTitle = meta.ogTitle || meta.title;
    const ogDesc = meta.ogDescription || meta.description;
    const canonicalUrl = `https://profitcalci.in${meta.canonicalPath === '/' ? '' : meta.canonicalPath}/`;

    updateOrCreateMeta('property', 'og:title', ogTitle);
    updateOrCreateMeta('property', 'og:description', ogDesc);
    updateOrCreateMeta('property', 'og:url', canonicalUrl);
    updateOrCreateMeta('name', 'twitter:title', ogTitle);
    updateOrCreateMeta('name', 'twitter:description', ogDesc);

    // 4. Dynamic Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Update Dynamic Schema (SoftwareApplication for individual tools)
    updateDynamicStructuredData(meta);
  }, [currentPath]);

  const navigateTo = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTool = (slug: string) => {
    recordRecentlyUsedTool(slug);
    navigateTo(`/tool/${slug}`);
  };

  // Determine which page or tool component to render
  const renderContent = () => {
    // 1. Tool routes
    if (currentPath.startsWith('/tool/')) {
      const slug = currentPath.replace('/tool/', '');
      const toolMeta = allManagedTools.find((t) => t.slug === slug) || TOOLS_LIST.find((t) => t.slug === slug);

      let ToolComponent = null;
      switch (slug) {
        case 'gst-calculator':
          ToolComponent = <GstCalculator />;
          break;
        case 'profit-calculator':
          ToolComponent = <ProfitCalculator />;
          break;
        case 'selling-price-calculator':
          ToolComponent = <SellingPriceCalculator />;
          break;
        case 'discount-calculator':
          ToolComponent = <DiscountCalculator />;
          break;
        case 'break-even-calculator':
          ToolComponent = <BreakEvenCalculator />;
          break;
        case 'marketplace-profit-calculator':
          ToolComponent = <MarketplaceProfitCalculator />;
          break;
        case 'cod-profit-calculator':
          ToolComponent = <CodProfitCalculator />;
          break;
        case 'return-loss-calculator':
          ToolComponent = <ReturnLossCalculator />;
          break;
        case 'invoice-generator':
          ToolComponent = <InvoiceGenerator />;
          break;
        case 'quotation-generator':
          ToolComponent = <QuotationGenerator />;
          break;
        case 'receipt-generator':
          ToolComponent = <ReceiptGenerator />;
          break;
        case 'bulk-profit-calculator':
          ToolComponent = <BulkProfitCalculator />;
          break;
        case 'qr-code-generator':
        case 'qr-barcode-generator':
          ToolComponent = <QrBarcodeGenerator />;
          break;
        case 'image-to-pdf':
          ToolComponent = <ImageToPdfConverter />;
          break;
        case 'whatsapp-ad-generator':
          ToolComponent = <WhatsAppAdGenerator />;
          break;
        case 'instagram-caption-generator':
          ToolComponent = <InstagramCaptionGenerator />;
          break;
        case 'product-description':
        case 'product-description-generator':
          ToolComponent = <ProductDescriptionGenerator />;
          break;
        case 'product-title-generator':
          ToolComponent = <ProductTitleGenerator />;
          break;
        case 'social-media-ad-generator':
          ToolComponent = <SocialMediaAdGenerator />;
          break;
        case 'marketplace-comparison':
          ToolComponent = <MarketplaceComparison />;
          break;
        case 'hsn-finder':
          ToolComponent = <HsnFinder />;
          break;
        case 'margin-calculator':
          ToolComponent = <MarginMarkupCalculator />;
          break;
        case 'shopify-calculator':
          ToolComponent = <ShopifyCalculator />;
          break;
        default: {
          // Check if this is a custom calculator created via the Admin form builder
          const customTool = allManagedTools.find((t) => t.slug === slug);
          if (customTool && customTool.isCustomCreated) {
            ToolComponent = <DynamicCalculatorRenderer tool={customTool} />;
          } else {
            ToolComponent = (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Tool Not Found</h2>
                <p className="text-xs text-slate-500 mt-2">The requested calculator could not be found or has been unpublished.</p>
                <button
                  onClick={() => navigateTo('/tools')}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Browse All Tools
                </button>
              </div>
            );
          }
          break;
        }
      }

      return (
        <div className="space-y-6">
          {/* Breadcrumbs & Quick Share Bar */}
          <div className="flex items-center justify-between max-w-4xl mx-auto px-1 no-print gap-2">
            <nav className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-0">
              <button
                onClick={() => navigateTo('/')}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 dark:text-slate-600 shrink-0" />
              <button
                onClick={() => navigateTo('/tools')}
                className="hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer shrink-0"
              >
                Tools
              </button>
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 dark:text-slate-600 shrink-0" />
              <span className="text-slate-900 dark:text-white font-bold truncate max-w-[140px] sm:max-w-xs md:max-w-md">
                {toolMeta?.name || slug}
              </span>
            </nav>

            <button
              type="button"
              onClick={async () => {
                const url = window.location.href;
                const toolName = toolMeta?.name || 'Business Calculator';
                const desc = toolMeta?.description || 'Free calculator for Indian merchants';
                const res = await shareContent({
                  title: `${toolName} - ProfitCalci`,
                  text: `Calculate ${toolName} easily on ProfitCalci: ${desc}`,
                  url,
                });
                if (res.copiedToClipboard) {
                  setGlobalToast(`"${toolName}" link copied to clipboard!`);
                  setTimeout(() => setGlobalToast(null), 3000);
                } else if (res.shared) {
                  setGlobalToast(`Shared successfully!`);
                  setTimeout(() => setGlobalToast(null), 3000);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800 transition-all cursor-pointer active:scale-95 shrink-0 shadow-2xs"
              title="Share this calculator with business contacts"
              aria-label="Share tool"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Tool</span>
            </button>
          </div>

          {ToolComponent}
        </div>
      );
    }

    // 2. Specific Page routes
    switch (currentPath) {
      case '/tools':
        return <ToolsPage onSelectTool={handleSelectTool} />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage onNavigate={navigateTo} />;
      case '/faq':
        return <FaqPage />;
      case '/privacy':
        return <LegalPage type="privacy" />;
      case '/terms':
        return <LegalPage type="terms" />;
      case '/disclaimer':
        return <LegalPage type="disclaimer" />;
      case '/cookie-policy':
        return <LegalPage type="cookie-policy" />;
      case '/pricing':
        return <PricingPage onSelectTool={handleSelectTool} />;
      case '/resources':
        return <ResourcesPage onSelectTool={handleSelectTool} />;
      case '/admin':
        return <AdminPage onNavigate={navigateTo} />;
      case '/':
      default:
        return <HomePage onSelectTool={handleSelectTool} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Share Toast Notification */}
      {globalToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white dark:bg-emerald-950 dark:text-emerald-100 rounded-2xl shadow-2xl border border-slate-700 dark:border-emerald-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Main Content Area with generous comfortable bottom spacing for mobile */}
      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
        <div key={currentPath} className="animate-page-enter">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Floating Quick Navigation Bar (Bottom of screen) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-3 z-30 shadow-lg no-print transition-colors">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button
            onClick={() => navigateTo('/')}
            className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
              currentPath === '/' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => handleSelectTool('gst-calculator')}
            className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
              currentPath === '/tool/gst-calculator' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span>GST</span>
          </button>
          <button
            onClick={() => handleSelectTool('profit-calculator')}
            className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
              currentPath === '/tool/profit-calculator' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <TrendingUp className="w-4 h-4 mb-0.5" />
            <span>Profit</span>
          </button>
          <button
            onClick={() => handleSelectTool('invoice-generator')}
            className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
              currentPath === '/tool/invoice-generator' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Invoice</span>
          </button>
          <button
            onClick={() => handleSelectTool('whatsapp-ad-generator')}
            className={`flex flex-col items-center py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
              currentPath === '/tool/whatsapp-ad-generator' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <MessageSquareShare className="w-4 h-4 mb-0.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Quick Search Modal */}
      <ToolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* AdSense Cookie Consent Banner */}
      <CookieConsentBanner onNavigate={navigateTo} />

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
