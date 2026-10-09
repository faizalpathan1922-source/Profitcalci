import React from 'react';
import { ShieldCheck, AlertTriangle, FileText, Lock, Cookie, CheckCircle2 } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer' | 'cookie-policy';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. DISCLAIMER PAGE */}
      {type === 'disclaimer' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
              Legal Notice
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Disclaimer
            </h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
          </div>

          {/* Mandatory Specific Disclaimer Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <span>General Calculation & Financial Disclaimer</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-amber-950 leading-relaxed">
              "ProfitCalci provides informational calculations and tools. Results may vary based on user inputs, platform fees, taxes, shipping charges and other factors. Users should verify tax, accounting and legal matters with qualified professionals or official sources."
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-sm text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900">1. Not Official Advice</h3>
            <p>
              The calculations, rates, HSN codes, and invoice templates made available through ProfitCalci are provided for quick mathematical estimations and drafting convenience only. None of the materials or calculations generated on this site constitute formal legal, taxation, or certified accounting advice.
            </p>

            <h3 className="text-base font-bold text-slate-900">2. Marketplace Disclaimers</h3>
            <p>
              Any references to third-party marketplaces, including Meesho, Amazon India, Flipkart, JioMart, or courier partners (e.g. Delhivery, Shadowfax, Xpressbees), are purely for descriptive utility. Commission rates, closing fees, return freight charges, and logistics tariffs fluctuate frequently and vary by individual seller tier. Always verify current schedule charges on your respective seller central dashboards.
            </p>

            <h3 className="text-base font-bold text-slate-900">3. Non-Affiliation Declaration</h3>
            <p>
              ProfitCalci is an independent platform and is not affiliated with Meesho, Amazon, Flipkart, GST authorities, or any government organization.
            </p>
          </div>
        </div>
      )}

      {/* 2. TERMS AND CONDITIONS */}
      {type === 'terms' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Terms of Service
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Terms and Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-sm text-slate-700 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
            <p>
              By accessing and using ProfitCalci (profitcalci.in), you acknowledge and agree to be bound by these Terms of Service. If you do not accept these terms, you should refrain from using our tools and calculators.
            </p>

            <h3 className="text-base font-bold text-slate-900">2. Permitted Use</h3>
            <p>
              ProfitCalci is provided free of charge for Indian merchants, retail businesses, online resellers, and commercial entities to perform estimates, calculate profit margins, and prepare tax invoices. You agree not to misuse or attempt to disrupt the platform infrastructure.
            </p>

            <h3 className="text-base font-bold text-slate-900">3. Disclaimer of Warranties</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium text-xs sm:text-sm">
              "ProfitCalci provides informational calculations and tools. Results may vary based on user inputs, platform fees, taxes, shipping charges and other factors. Users should verify tax, accounting and legal matters with qualified professionals or official sources."
            </div>

            <h3 className="text-base font-bold text-slate-900">4. Advertising and Third-Party Links</h3>
            <p>
              Our website may display commercial advertisements provided by Google AdSense and third-party advertising partners. We do not endorse or take responsibility for goods, services, or claims advertised by third-party sponsors.
            </p>

            <h3 className="text-base font-bold text-slate-900">5. Modifications to Service</h3>
            <p>
              We reserve the right to improve, update, or modify any calculator algorithm or feature without prior notice to maintain compliance with changing Indian tax structures.
            </p>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY (WITH STRICT GOOGLE ADSENSE COMPLIANCE) */}
      {type === 'privacy' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Data Protection & Privacy
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Compliant with Google AdSense, GDPR, CCPA, and Indian DPDP Act 2023 • Last Updated: October 2026
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Privacy First Commitment:</span>
                Your sensitive product costs, profit margins, client details, and invoice contents are processed directly in your local browser session and are never sold or rented to third-party data brokers.
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">1. Google AdSense & Third-Party Advertising Vendors</h3>
              <p className="mb-2">
                We use <strong>Google AdSense</strong> to display advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on ProfitCalci.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
                <li>
                  Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold underline"
                  >
                    Google Ads Settings (https://adssettings.google.com)
                  </a>.
                </li>
                <li>
                  Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold underline"
                  >
                    www.aboutads.info
                  </a>.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">2. Cookies and Web Beacons</h3>
              <p>
                ProfitCalci uses cookies to store information about visitors' preferences, to record user-specific information on which pages the site visitor accesses or visits, and to personalize or customize our web page content based upon visitors' browser type or other information that the visitor sends via their browser.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">3. Financial Calculation & Business Data Isolation</h3>
              <p>
                When you input numbers into our GST Calculator, Profit Calculator, or Invoice Generator, all computation scripts execute exclusively on your local client device. Your private unit costs, sales volumes, GSTINs, and customer addresses are not stored on our permanent database servers.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">4. Indian Digital Personal Data Protection (DPDP) Act 2023 Compliance</h3>
              <p>
                For users located in the Republic of India, we strictly abide by the principles of data minimization and purposeful processing. Any voluntary contact inquiries submitted through our contact form are processed solely to provide customer support and are not used for unsolicited promotional marketing.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">5. Children's Information</h3>
              <p>
                ProfitCalci is an enterprise business utility designed for commercial entrepreneurs. We do not knowingly collect any personally identifiable information from children under the age of 13.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">6. Independent Platform Disclaimer</h3>
              <p>
                ProfitCalci is an independent platform and is not affiliated with Meesho, Amazon, Flipkart, GST authorities or any government organization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. COOKIE POLICY */}
      {type === 'cookie-policy' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Cookie Transparency
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Cookie Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">Detailed AdSense & Analytics Cookie Disclosures</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
            <p>
              This Cookie Policy explains how ProfitCalci uses cookies and similar tracking technologies to recognize you when you visit our website, including when serving ads via Google AdSense.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block text-sm">1. Strictly Necessary Cookies</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Required to remember your session preferences, UI calculator inputs, and theme selections. These cannot be switched off.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block text-sm">2. Advertising & AdSense Cookies</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Placed by Google AdSense and its authorized advertising network to deliver relevant advertisements tailored to your interests and prevent the same ad from showing repetitively.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block text-sm">3. Performance & Analytical Cookies</strong>
                <p className="text-xs text-slate-600 mt-1">
                  Help us understand how visitors interact with calculator tools, measure page load speeds, and identify any formula calculation errors.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">How can you manage or disable cookies?</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                You can change your browser settings to reject cookies or delete cookies that have already been saved. If you choose to reject cookies, you can still access and use all our calculators and tools freely.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
