import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { formatPrice, calculateUsdValue, formatUsdValue } from '../utils/priceUtils';

export type TokenPrice = {
  symbol: string;
  price: number;
  lastUpdated: number;
};

export type PriceState = {
  prices: Record<string, TokenPrice>;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
};

interface PriceContextType {
  priceState: PriceState;
  getTokenPrice: (symbol: string) => number | null;
  getTokenPriceFormatted: (symbol: string) => string;
  getTokenUsdValue: (symbol: string, amount: number) => number | null;
  getTokenUsdValueFormatted: (symbol: string, amount: number) => string;
  refreshPrices: () => Promise<void>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

// CoinGecko API mapping for tokens
const COINGECKO_IDS: Record<string, string> = {
  'ETH': 'Ethereum',
  'POL': 'matic-network',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'WBTC': 'wrapped-bitcoin',
  'OP': 'Optimism',
  'ARB': 'Arbitrum',
  'LINK': 'chainlink',
};

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export function PriceProvider({ children }: { children: ReactNode }) {
  const [priceState, setPriceState] = useState<PriceState>({
    prices: {},
    isLoading: false,
    error: null,
    lastFetch: null,
  });

  const fetchPrices = async () => {
    setPriceState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const tokenIds = Object.values(COINGECKO_IDS).join(',');
      const response = await fetch(
        `${COINGECKO_API_URL}?ids=${tokenIds}&vs_currencies=usd&include_last_updated_at=true`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.status}`);
      }
      
      const data = await response.json();
      const now = Date.now();
      
      // Transform the response to our format
      const prices: Record<string, TokenPrice> = {};
      
      Object.entries(COINGECKO_IDS).forEach(([symbol, coingeckoId]) => {
        const tokenData = data[coingeckoId];
        if (tokenData && tokenData.usd) {
          prices[symbol] = {
            symbol,
            price: tokenData.usd,
            lastUpdated: tokenData.last_updated_at * 1000, // Convert to milliseconds
          };
        }
      });
      
      setPriceState({
        prices,
        isLoading: false,
        error: null,
        lastFetch: now,
      });
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPriceState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch prices',
      }));
    }
  };

  const getTokenPrice = (symbol: string): number | null => {
    const tokenPrice = priceState.prices[symbol];
    return tokenPrice ? tokenPrice.price : null;
  };

  const getTokenPriceFormatted = (symbol: string): string => {
    const price = getTokenPrice(symbol);
    if (price === null) return 'Price unavailable';
    
    return formatPrice(price);
  };

  const getTokenUsdValue = (symbol: string, amount: number): number | null => {
    const price = getTokenPrice(symbol);
    if (price === null) return null;
    
    return calculateUsdValue(amount, price);
  };

  const getTokenUsdValueFormatted = (symbol: string, amount: number): string => {
    const usdValue = getTokenUsdValue(symbol, amount);
    if (usdValue === null) return 'Value unavailable';
    
    return formatUsdValue(usdValue);
  };

  const refreshPrices = async () => {
    await fetchPrices();
  };

  // Fetch prices on mount and set up periodic refresh
  useEffect(() => {
    fetchPrices();
    
    // Refresh prices every 5 minutes
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <PriceContext.Provider
      value={{
        priceState,
        getTokenPrice,
        getTokenPriceFormatted,
        getTokenUsdValue,
        getTokenUsdValueFormatted,
        refreshPrices,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
}
