/**
 * Utility functions for price calculations and formatting
 */

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateUsdValue = (
  tokenAmount: number,
  tokenPrice: number,
): number => {
  return tokenAmount * tokenPrice;
};

export const formatUsdValue = (usdValue: number): string => {
  return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
