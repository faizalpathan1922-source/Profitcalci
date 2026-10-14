export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstINR: number; // 1 unit in INR (e.g. 1 USD = 86.50 INR)
  locale: string;
}

export const CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rateAgainstINR: 1, locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateAgainstINR: 86.50, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateAgainstINR: 92.50, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateAgainstINR: 110.00, locale: 'en-GB' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateAgainstINR: 23.55, locale: 'en-AE' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', rateAgainstINR: 62.50, locale: 'en-CA' },
};

export function getGlobalCurrency(): SupportedCurrency {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('profitcalci_currency') as SupportedCurrency;
    if (saved && CURRENCIES[saved]) {
      return saved;
    }
  }
  return 'INR';
}

export function isCurrencyConversionEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('profitcalci_fx_convert');
    if (saved !== null) {
      return saved === 'true';
    }
  }
  return true;
}

export function setCurrencyConversionEnabled(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profitcalci_fx_convert', String(enabled));
    window.dispatchEvent(
      new CustomEvent('profitcalci_currency_change', {
        detail: { currency: getGlobalCurrency(), convert: enabled },
      })
    );
  }
}

export function setGlobalCurrency(c: SupportedCurrency): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profitcalci_currency', c);
    window.dispatchEvent(
      new CustomEvent('profitcalci_currency_change', {
        detail: { currency: c, convert: isCurrencyConversionEnabled() },
      })
    );
  }
}

export function getCurrencySymbol(currency: SupportedCurrency = getGlobalCurrency()): string {
  return CURRENCIES[currency]?.symbol || '₹';
}

export function convertFromINR(val: number, targetCurrency: SupportedCurrency = getGlobalCurrency()): number {
  if (isNaN(val) || val === null || val === undefined) return 0;
  if (targetCurrency === 'INR') return val;
  const rate = CURRENCIES[targetCurrency]?.rateAgainstINR || 1;
  return val / rate;
}

export function convertToINR(val: number, sourceCurrency: SupportedCurrency = getGlobalCurrency()): number {
  if (isNaN(val) || val === null || val === undefined) return 0;
  if (sourceCurrency === 'INR') return val;
  const rate = CURRENCIES[sourceCurrency]?.rateAgainstINR || 1;
  return val * rate;
}

export function formatCurrency(
  val: number,
  currency: SupportedCurrency = getGlobalCurrency(),
  decimals: number = 2
): string {
  if (isNaN(val) || val === null || val === undefined) {
    const sym = getCurrencySymbol(currency);
    return `${sym}0.00`;
  }

  const isConvert = isCurrencyConversionEnabled();
  const effectiveVal = isConvert && currency !== 'INR' ? convertFromINR(val, currency) : val;

  const isNegative = effectiveVal < 0;
  const absVal = Math.abs(effectiveVal);

  const currInfo = CURRENCIES[currency] || CURRENCIES.INR;
  try {
    const formatted = new Intl.NumberFormat(currInfo.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(absVal);

    return isNegative ? `-${formatted}` : formatted;
  } catch {
    const sym = currInfo.symbol;
    const num = absVal.toFixed(decimals);
    return isNegative ? `-${sym}${num}` : `${sym}${num}`;
  }
}

/**
 * Formats a number to active currency representation
 */
export function formatINR(val: number, decimals: number = 2): string {
  return formatCurrency(val, getGlobalCurrency(), decimals);
}

/**
 * Formats number without currency symbol for inputs or counts
 */
export function formatNumberIN(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

/**
 * Safe numeric parser for form inputs (strips commas, currency symbols)
 */
export function parseSafeNumber(val: any, fallback: number = 0): number {
  if (typeof val === 'number') {
    return isNaN(val) ? fallback : val;
  }
  if (!val && val !== 0) return fallback;
  const cleaned = String(val).replace(/,/g, '').replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Ensures parsed number is strictly non-negative (>= 0)
 */
export function parsePositiveNumber(val: any, fallback: number = 0): number {
  const parsed = parseSafeNumber(val, fallback);
  return Math.max(0, parsed);
}

/**
 * Converts numeric amount to Indian Rupee words for GST Tax Invoices
 * e.g., 1250 -> "Rupees One Thousand Two Hundred Fifty Only"
 */
export function numberToWordsINR(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const singleDigits = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return singleDigits[n];
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    return tens[ten] + (unit !== 0 ? ' ' + singleDigits[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let str = '';
    if (hundred > 0) {
      str += singleDigits[hundred] + ' Hundred';
    }
    if (rest > 0) {
      if (str !== '') str += ' ';
      str += convertTwoDigits(rest);
    }
    return str;
  }

  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  let word = '';

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const hundredAndBelow = rupees % 1000;

  if (crore > 0) {
    word += convertThreeDigits(crore) + ' Crore ';
  }
  if (lakh > 0) {
    word += convertThreeDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    word += convertThreeDigits(thousand) + ' Thousand ';
  }
  if (hundredAndBelow > 0) {
    word += convertThreeDigits(hundredAndBelow);
  }

  if (word.trim() === '') {
    word = 'Zero';
  }

  let finalStr = 'Rupees ' + word.trim();

  if (paise > 0) {
    finalStr += ' and ' + convertTwoDigits(paise) + ' Paise';
  }

  return finalStr + ' Only';
}
