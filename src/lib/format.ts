/**
 * Global Currency and Number Formatter
 * Standard: US-style (comma for thousands, dot for decimals)
 */

export const formatCurrency = (amount: number | string, symbol: string = '$'): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(value)) return `${symbol}0.00`;

  return `${symbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
};

export const formatNumber = (num: number | string): string => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';

  return new Intl.NumberFormat('en-US').format(value);
};
