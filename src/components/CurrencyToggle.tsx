import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowRightLeft, Globe, Info } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { SupportedCurrency, CURRENCIES } from '../utils/formatters';

interface CurrencyToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const {
    currency,
    currencySymbol,
    currencyInfo,
    isConvertEnabled,
    setCurrency,
    setIsConvertEnabled,
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currencyList = Object.values(CURRENCIES);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        title={`Change display currency (Current: ${currency} ${currencySymbol})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm leading-none" role="img" aria-label={currencyInfo.name}>
          {currencyInfo.flag}
        </span>
        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
          {currencySymbol}
        </span>
        <span className="tracking-tight uppercase font-bold text-slate-700 dark:text-slate-200">
          {currency}
        </span>
        {showLabel && (
          <span className="hidden sm:inline text-[11px] font-normal text-slate-500 dark:text-slate-400">
            {currencyInfo.name}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Select Currency
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {currencyList.length} Currencies
            </span>
          </div>

          {/* Currency Options List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-0.5">
            {currencyList.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none" role="img" aria-label={c.name}>
                      {c.flag}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.code}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          ({c.symbol})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                        {c.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.code !== 'INR' && (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        1 {c.code} ≈ ₹{c.rateAgainstINR}
                      </span>
                    )}
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto FX Conversion Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={isConvertEnabled}
                onChange={(e) => setIsConvertEnabled(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
              />
              <div className="text-[11px] text-slate-600 dark:text-slate-300 select-none leading-tight">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                  Auto-convert tool calculations
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Converts ₹ values to {currency} using current benchmark exchange rates.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
