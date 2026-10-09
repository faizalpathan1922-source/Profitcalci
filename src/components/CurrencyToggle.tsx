import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface CurrencyToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <button
      type="button"
      onClick={toggleCurrency}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        currency === 'INR'
          ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      } ${className}`}
      title={`Current Currency: ${currency} (${currency === 'INR' ? '₹' : '$'}). Click to switch.`}
      aria-label={`Switch currency between INR and USD. Currently ${currency}.`}
    >
      <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-white dark:bg-slate-900 shadow-2xs font-extrabold text-[11px]">
        {currency === 'INR' ? '₹' : '$'}
      </span>
      <span className="tracking-tight uppercase">
        {currency}
      </span>
      {showLabel && (
        <span className="text-[11px] font-medium opacity-80 pl-0.5">
          ({currency === 'INR' ? 'Rupee' : 'Dollar'})
        </span>
      )}
    </button>
  );
};
