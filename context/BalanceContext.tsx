import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TokenBalances } from '../types';
import {
  createInitialTokenBalances,
  fetchAllTokenBalances,
  clearBalanceCache,
} from '../utils/balanceUtils';

interface BalanceContextType {
  // State
  balances: TokenBalances | null;

  // Setters
  setBalances: (balances: TokenBalances | null) => void;

  // Actions
  refreshBalances: (address: string) => Promise<void>;
  fetchBalancesForAddress: (address: string) => Promise<TokenBalances>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({
  children,
}) => {
  const [balances, setBalances] = useState<TokenBalances | null>(null);

  const fetchBalancesForAddress = async (
    address: string,
  ): Promise<TokenBalances> => {
    try {
      const fetchedBalances = await fetchAllTokenBalances(address);
      setBalances(fetchedBalances);
      return fetchedBalances;
    } catch (error) {
      console.error('Failed to fetch balances for address:', error);
      // Return initial balances on error
      const initialBalances = createInitialTokenBalances();
      setBalances(initialBalances);
      return initialBalances;
    }
  };

  const refreshBalances = async (address: string) => {
    try {
      // Clear cache to ensure fresh data is fetched
      clearBalanceCache(address);
      await fetchBalancesForAddress(address);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const value: BalanceContextType = {
    // State
    balances,

    // Setters
    setBalances,

    // Actions
    refreshBalances,
    fetchBalancesForAddress,
  };

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  );
};
