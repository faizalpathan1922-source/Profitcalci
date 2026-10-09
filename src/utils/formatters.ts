export type SupportedCurrency = 'INR' | 'USD';

export function getGlobalCurrency(): SupportedCurrency {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('profitcalci_currency');
    if (saved === 'USD' || saved === 'INR') {
      return saved;
    }
  }
  return 'INR';
}

export function setGlobalCurrency(c: SupportedCurrency): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profitcalci_currency', c);
    window.dispatchEvent(new CustomEvent('profitcalci_currency_change', { detail: c }));
  }
}

export function getCurrencySymbol(currency: SupportedCurrency = getGlobalCurrency()): string {
  return currency === 'USD' ? '$' : '₹';
}

export function formatCurrency(
  val: number,
  currency: SupportedCurrency = getGlobalCurrency(),
  decimals: number = 2
): string {
  if (isNaN(val) || val === null || val === undefined) {
    return currency === 'USD' ? '$0.00' : '₹0.00';
  }
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const locale = currency === 'USD' ? 'en-US' : 'en-IN';
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absVal);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats a number to active currency (INR ₹ or USD $) representation
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
