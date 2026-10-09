import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';

interface CookieConsentBannerProps {
  onNavigate: (path: string) => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onNavigate }) => {
  const [accepted, setAccepted] = useState<boolean>(true); // default true until checked

  useEffect(() => {
    const isConsentGiven = localStorage.getItem('profitcalci_cookie_consent');
    if (!isConsentGiven) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('profitcalci_cookie_consent', 'accepted');
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('profitcalci_cookie_consent', 'essential_only');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md text-slate-200 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300 no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-white block">AdSense & Cookie Policy Notice</span>
            <p className="text-slate-400 text-xs mt-0.5">
              ProfitCalci and our advertising partners (including Google AdSense) use cookies to serve personalized ads based on your visits to this and other websites, analyze traffic, and ensure tool functionality. Read our{' '}
              <button
                onClick={() => onNavigate('/privacy')}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                Privacy Policy
              </button>{' '}
              and{' '}
              <button
                onClick={() => onNavigate('/cookie-policy')}
                className="text-emerald-400 underline hover:text-emerald-300"
              >
                Cookie Disclosures
              </button>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDecline}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
