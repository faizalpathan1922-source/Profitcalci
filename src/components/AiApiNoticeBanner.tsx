import React from 'react';
import { AlertCircle, Key, ExternalLink, ShieldAlert } from 'lucide-react';

interface AiApiNoticeBannerProps {
  toolName: string;
}

export const AiApiNoticeBanner: React.FC<AiApiNoticeBannerProps> = ({ toolName }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 text-slate-800 space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
            <span>Gemini API Key Required</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
              Configuration Notice
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-900/90 mt-1">
            <strong>{toolName}</strong> uses the official Google Gemini API to generate genuine, high-converting copy.
            In compliance with strict production guidelines, <em>no fake or simulated text is generated</em> when the external API is unconfigured.
          </p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xs border border-amber-200 rounded-xl p-4 text-xs space-y-2">
        <p className="font-bold text-amber-950">How to configure the API:</p>
        <ol className="list-decimal list-inside space-y-1 text-slate-700">
          <li>
            Get a free API key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
            >
              Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </li>
          <li>
            Add <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono font-bold">VITE_GEMINI_API_KEY</code> or{' '}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono font-bold">GEMINI_API_KEY</code> to your environment variables or secrets.
          </li>
          <li>Restart the app to activate real-time Gemini generation.</li>
        </ol>
      </div>
    </div>
  );
};
