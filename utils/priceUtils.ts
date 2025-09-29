/**
 * Utility functions for price calculations and formatting
 */

export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateUsdValue = (tokenAmount: number, tokenPrice: number): number => {
  return tokenAmount * tokenPrice;
};

export const formatUsdValue = (usdValue: number): string => {
  return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatTokenAmount = (amount: number): string => {
  if (amount >= 1) {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  } else if (amount >= 0.01) {
    return amount.toFixed(4);
  } else {
    return amount.toFixed(8);
  }
};

