/**
 * Utility functions for price calculations and formatting
 */

export const formatPrice = (price: number): string => {
  if (price >= 1) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
};

export const calculateUsdValue = (tokenAmount: number, tokenPrice: number): number => {
  return tokenAmount * tokenPrice;
};

export const formatUsdValue = (usdValue: number): string => {
  if (usdValue >= 1000) {
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  } else if (usdValue >= 1) {
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
  } else if (usdValue >= 0.01) {
    return `$${usdValue.toFixed(4)}`;
  } else {
    return `$${usdValue.toFixed(6)}`;
  }
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

export const getPriceChangeColor = (priceChange: number): 'positive' | 'negative' | 'neutral' => {
  if (priceChange > 0) return 'positive';
  if (priceChange < 0) return 'negative';
  return 'neutral';
};
