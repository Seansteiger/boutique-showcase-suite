/**
 * Central utility for multicurrency conversions and formatting in Scented White-Label store.
 * Prices in the database are stored in the base currency (e.g., ZAR).
 */

export interface CurrencySettings {
  currency?: string;
  currencySymbol?: string;
  currencyMultiplier?: number;
}

/**
 * Formats a raw numeric price using the active White-Label store currency configurations.
 * 
 * @param amount - The raw base price (stored in base currency, e.g. ZAR)
 * @param settings - The Convex/localStorage settings configuration
 * @returns Formatted currency string (e.g., "R 1,650.00" or "$ 85.90")
 */
export function formatPrice(amount: number, settings?: CurrencySettings | null): string {
  const symbol = settings?.currencySymbol || "R";
  const multiplier = settings?.currencyMultiplier !== undefined ? settings.currencyMultiplier : 1.0;
  
  const convertedAmount = amount * multiplier;
  
  // Format with standard commas/decimals
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
  
  return `${symbol}${formattedNumber}`;
}
