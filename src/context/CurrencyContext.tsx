import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedCurrency,
  getGlobalCurrency,
  setGlobalCurrency as setGlobalStorageCurrency,
  getCurrencySymbol,
  formatCurrency,
} from '../utils/formatters';

interface CurrencyContextType {
  currency: SupportedCurrency;
  currencySymbol: string;
  setCurrency: (c: SupportedCurrency) => void;
  toggleCurrency: () => void;
  formatAmount: (val: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => getGlobalCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: any) => {
      if (e?.detail && (e.detail === 'INR' || e.detail === 'USD')) {
        setCurrencyState(e.detail);
      }
    };
    window.addEventListener('profitcalci_currency_change', handleCurrencyChange);
    return () => window.removeEventListener('profitcalci_currency_change', handleCurrencyChange);
  }, []);

  const setCurrency = (c: SupportedCurrency) => {
    setCurrencyState(c);
    setGlobalStorageCurrency(c);
  };

  const toggleCurrency = () => {
    const next = currency === 'INR' ? 'USD' : 'INR';
    setCurrency(next);
  };

  const currencySymbol = getCurrencySymbol(currency);

  const formatAmount = (val: number, decimals: number = 2) => {
    return formatCurrency(val, currency, decimals);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        setCurrency,
        toggleCurrency,
        formatAmount,
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
    return {
      currency: curr,
      currencySymbol: getCurrencySymbol(curr),
      setCurrency: (c) => setGlobalStorageCurrency(c),
      toggleCurrency: () => {
        const next = curr === 'INR' ? 'USD' : 'INR';
        setGlobalStorageCurrency(next);
      },
      formatAmount: (val, decimals = 2) => formatCurrency(val, curr, decimals),
    };
  }
  return context;
};
