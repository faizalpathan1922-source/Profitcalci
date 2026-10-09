import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, Copy, Check, MessageSquare, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';
import { AdSenseBanner } from '../components/AdSenseBanner';

interface ContactPageProps {
  onNavigate?: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [queryType, setQueryType] = useState('Feature Request / New Tool');
  const [message, setMessage] = useState('');
  
  // Toast & submission states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const officialEmail = 'support@profitcalci.in';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate clean dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Thank you! Your message has been received.');
      setShowToast(true);

      // Reset form
      setFullName('');
      setEmail('');
      setQueryType('Feature Request / New Tool');
      setMessage('');

      // Auto dismiss toast after 4 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-page-enter">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-900 text-white rounded-2xl shadow-2xl border border-emerald-700/60 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{toastMessage}</p>
            <p className="text-xs text-emerald-200">Our support team will get back to you shortly.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-2 text-emerald-300 hover:text-white text-xs font-bold p-1 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Seller Support & Inquiries</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Have questions, feedback, or a request for a new calculator? Reach out to the ProfitCalci team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Support Info Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Contact Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We are dedicated to helping Indian merchants and sellers calculate clean profits.
              </p>
            </div>

            <div className="space-y-4">
              {/* Support Email */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Support Email
                  </span>
                  <a
                    href={`mailto:${officialEmail}`}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block transition-colors"
                  >
                    {officialEmail}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline mt-1 cursor-pointer transition-all active:scale-95"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied to clipboard' : 'Copy email address'}</span>
                  </button>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Response Time
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                    We typically respond to seller queries within 24–48 business hours.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Headquarters
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    Based in Maharashtra, India.
                  </p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Independent Indian seller tools platform
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Guarantee Banner */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free & Independent Service</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                ProfitCalci does not charge fees for any calculators, invoice builders, or tools. If anyone asks you for money on behalf of ProfitCalci, please report it immediately.
              </p>
            </div>
          </div>

          {/* Quick FAQ Helper Card */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-3xl border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>Looking for Quick Answers?</span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
              Check our Frequently Asked Questions for quick answers on Meesho 0% fees, GST slabs, RTO formula calculations, and invoice downloads.
            </p>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/faq')}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <span>Browse Seller FAQs →</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback & Query Form (Right Column) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Send us a Message
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Fill out the form below. Whether it&apos;s a marketplace rate update, suggestion, or bug report, we read every note.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ramesh.seller@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                We will send our reply to this email address. We never spam.
              </span>
            </div>

            {/* Query Type */}
            <div>
              <label htmlFor="contact-query-type" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Query Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="contact-query-type"
                required
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
              >
                <option value="Feature Request / New Tool">Feature Request / New Tool</option>
                <option value="Calculation Issue / Bug">Calculation Issue / Bug</option>
                <option value="Business & Collaboration">Business & Collaboration</option>
                <option value="General Query">General Query</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your question, feedback, or calculator feature request in detail..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              />
            </div>

            {/* Submit Button with physical tactile click feedback */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl transition-all duration-150 ease-out shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* AdSense Placement */}
      <AdSenseBanner slot="9012485721" format="horizontal" />
    </div>
  );
};
