import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedCurrency,
  CurrencyInfo,
  CURRENCIES,
  getGlobalCurrency,
  setGlobalCurrency as setGlobalStorageCurrency,
  isCurrencyConversionEnabled,
  setCurrencyConversionEnabled,
  getCurrencySymbol,
  formatCurrency,
  convertFromINR,
  convertToINR,
} from '../utils/formatters';

interface CurrencyContextType {
  currency: SupportedCurrency;
  currencySymbol: string;
  currencyInfo: CurrencyInfo;
  isConvertEnabled: boolean;
  setCurrency: (c: SupportedCurrency) => void;
  toggleCurrency: () => void;
  setIsConvertEnabled: (enabled: boolean) => void;
  formatAmount: (val: number, decimals?: number) => string;
  convertAmount: (val: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => getGlobalCurrency());
  const [isConvertEnabled, setIsConvertState] = useState<boolean>(() => isCurrencyConversionEnabled());

  useEffect(() => {
    const handleCurrencyChange = (e: any) => {
      if (e?.detail) {
        if (typeof e.detail === 'string' && CURRENCIES[e.detail as SupportedCurrency]) {
          setCurrencyState(e.detail as SupportedCurrency);
        } else if (e.detail.currency && CURRENCIES[e.detail.currency as SupportedCurrency]) {
          setCurrencyState(e.detail.currency);
          if (typeof e.detail.convert === 'boolean') {
            setIsConvertState(e.detail.convert);
          }
        }
      }
    };
    window.addEventListener('profitcalci_currency_change', handleCurrencyChange);
    return () => window.removeEventListener('profitcalci_currency_change', handleCurrencyChange);
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    setGlobalStorageCurrency(c);
  };

  const setIsConvertEnabled = (enabled: boolean) => {
    setIsConvertState(enabled);
    setCurrencyConversionEnabled(enabled);
  };

  const toggleCurrency = () => {
    const order: SupportedCurrency[] = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD'];
    const currentIndex = order.indexOf(currency);
    const next = order[(currentIndex + 1) % order.length];
    setCurrency(next);
  };

  const currencySymbol = getCurrencySymbol(currency);
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.INR;

  const formatAmount = (val: number, decimals: number = 2) => {
    return formatCurrency(val, currency, decimals);
  };

  const convertAmount = (val: number) => {
    return isConvertEnabled && currency !== 'INR' ? convertFromINR(val, currency) : val;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        currencyInfo,
        isConvertEnabled,
        setCurrency,
        toggleCurrency,
        setIsConvertEnabled,
        formatAmount,
        convertAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    const curr = getGlobalCurrency();
    const currInfo = CURRENCIES[curr] || CURRENCIES.INR;
    const isConv = isCurrencyConversionEnabled();
    return {
      currency: curr,
      currencySymbol: getCurrencySymbol(curr),
      currencyInfo: currInfo,
      isConvertEnabled: isConv,
      setCurrency: (c) => setGlobalStorageCurrency(c),
      toggleCurrency: () => {
        const order: SupportedCurrency[] = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD'];
        const next = order[(order.indexOf(curr) + 1) % order.length];
        setGlobalStorageCurrency(next);
      },
      setIsConvertEnabled: (enabled) => setCurrencyConversionEnabled(enabled),
      formatAmount: (val, decimals = 2) => formatCurrency(val, curr, decimals),
      convertAmount: (val) => (isConv && curr !== 'INR' ? convertFromINR(val, curr) : val),
    };
  }
  return context;
};
