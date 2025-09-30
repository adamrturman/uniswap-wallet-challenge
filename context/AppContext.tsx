import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Wallet } from 'ethers';
import { ChainKey, TokenKey } from '../config/chain';
import {
  createInitialAllTokenBalances,
  fetchAllTokenBalances,
  AllTokenBalances,
  clearBalanceCache,
} from '../utils/balanceUtils';
import {
  sendNativeTransaction,
  sendERC20Transaction,
  ERC20TransferParams,
  GasEstimate,
} from '../utils/transactionUtils';
import { chainConfig, tokenConfig } from '../config/chain';
import { NavigationType } from '../types';

interface AppContextType {
  // State
  wallet: Wallet | null;
  watchedAddress: string;
  balances: AllTokenBalances | null;
  recipientAddress: string;
  selectedToken: {
    chainKey: ChainKey;
    tokenKey: TokenKey;
    balance: number;
    symbol: string;
  } | null;
  transactionAmount: string;
  transactionHash: string;
  transactionGasEstimate: GasEstimate | null;

  // Setters
  setWallet: (wallet: Wallet | null) => void;
  setWatchedAddress: (address: string) => void;
  setBalances: (balances: AllTokenBalances | null) => void;
  setRecipientAddress: (address: string) => void;
  setSelectedToken: (
    token: {
      chainKey: ChainKey;
      tokenKey: TokenKey;
      balance: number;
      symbol: string;
    } | null,
  ) => void;
  setTransactionAmount: (amount: string) => void;
  setTransactionHash: (hash: string) => void;
  setTransactionGasEstimate: (gasEstimate: GasEstimate | null) => void;

  // Event Handlers
  handleWatchAddressContinue: (
    address: string,
    watchedAddressBalances: AllTokenBalances,
  ) => Promise<void>;
  handleRecoveryPhraseContinue: (phrase: string) => Promise<void>;
  handleRecipientAddressContinue: (address: string) => void;
  handleTokenSelect: (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => void;
  handleAmountContinue: (amount: string) => void;
  handleTransactionExecute: (
    amount: string,
    gasEstimate?: GasEstimate,
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  refreshBalances: () => Promise<void>;
  handleLogout: (navigation: NavigationType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<AllTokenBalances | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<{
    chainKey: ChainKey;
    tokenKey: TokenKey;
    balance: number;
    symbol: string;
  } | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [transactionGasEstimate, setTransactionGasEstimate] =
    useState<GasEstimate | null>(null);

  const handleWatchAddressContinue = async (
    address: string,
    watchedAddressBalances: AllTokenBalances,
  ) => {
    setWatchedAddress(address);
    setBalances(watchedAddressBalances);
    // Clear wallet state when entering watch mode
    setWallet(null);

    try {
      const fetchedBalances = await fetchAllTokenBalances(address);
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Failed to fetch balances for watched address:', error);
    }
  };

  const handleRecoveryPhraseContinue = async (phrase: string) => {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      // Clear watched address when entering wallet mode
      setWatchedAddress('');

      // Set initial loading state and navigate immediately
      const initialBalances = createInitialAllTokenBalances();
      setBalances(initialBalances);

      // Fetch balances in the background with parallel execution
      const fetchedBalances = await fetchAllTokenBalances(
        walletFromPhrase.address,
      );
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Error creating wallet from recovery phrase:', error);
    }
  };

  const handleRecipientAddressContinue = (address: string) => {
    setRecipientAddress(address);
  };

  const handleTokenSelect = (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => {
    setSelectedToken({
      chainKey,
      tokenKey,
      balance,
      symbol,
    });
  };

  const handleAmountContinue = (amount: string) => {
    setTransactionAmount(amount);
    // TODO: Navigate to transaction confirmation screen
  };

  const handleTransactionExecute = async (
    amount: string,
    gasEstimate?: GasEstimate,
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    if (!wallet || !selectedToken || !recipientAddress) {
      console.error('Missing required transaction data');
      return { success: false, error: 'Missing required transaction data' };
    }

    try {
      const config = chainConfig[selectedToken.chainKey];

      let result;

      // Handle native token transactions
      const nativeSymbol = chainConfig[selectedToken.chainKey].symbol;
      if (selectedToken.tokenKey === nativeSymbol) {
        result = await sendNativeTransaction(
          wallet,
          recipientAddress,
          amount,
          config.rpcUrl,
          gasEstimate,
        );
      } else {
        // Handle ERC20 token transactions
        const token =
          tokenConfig[selectedToken.chainKey][selectedToken.tokenKey];
        if (!token) {
          return { success: false, error: 'Token configuration not found' };
        }

        const transferParams: ERC20TransferParams = {
          tokenAddress: token.contractAddress,
          toAddress: recipientAddress,
          amount: amount,
          decimals: token.decimals,
        };

        result = await sendERC20Transaction(
          wallet,
          transferParams,
          config.rpcUrl,
          gasEstimate,
        );
      }

      if (result.success && result.hash) {
        setTransactionHash(result.hash);
        // Store the gas estimate for the confirmation screen
        if (gasEstimate) {
          setTransactionGasEstimate(gasEstimate);
        }
        // Navigate to success screen or show success toast
        return { success: true, hash: result.hash };
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const refreshBalances = async () => {
    const currentAddress = wallet?.address || watchedAddress;
    if (!currentAddress) return;

    try {
      // Clear cache to ensure fresh data is fetched
      clearBalanceCache(currentAddress);
      const fetchedBalances = await fetchAllTokenBalances(currentAddress);
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const handleLogout = (navigation: NavigationType) => {
    // Clear wallet state
    setWallet(null);
    setBalances(null);
    setRecipientAddress('');
    setSelectedToken(null);
    setTransactionAmount('');
    setTransactionHash('');
    setTransactionGasEstimate(null);

    // Navigate back to landing page
    navigation.navigate('Landing');
  };

  const value: AppContextType = {
    // State
    wallet,
    watchedAddress,
    balances,
    recipientAddress,
    selectedToken,
    transactionAmount,
    transactionHash,
    transactionGasEstimate,

    // Setters
    setWallet,
    setWatchedAddress,
    setBalances,
    setRecipientAddress,
    setSelectedToken,
    setTransactionAmount,
    setTransactionHash,
    setTransactionGasEstimate,

    // Event Handlers
    handleWatchAddressContinue,
    handleRecoveryPhraseContinue,
    handleRecipientAddressContinue,
    handleTokenSelect,
    handleAmountContinue,
    handleTransactionExecute,
    refreshBalances,
    handleLogout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
