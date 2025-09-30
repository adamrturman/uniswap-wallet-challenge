import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Wallet } from 'ethers';
import { NavigationType } from '../types';

interface WalletContextType {
  // State
  wallet: Wallet | null;
  watchedAddress: string;

  // Setters
  setWallet: (wallet: Wallet | null) => void;
  setWatchedAddress: (address: string) => void;

  // Actions
  handleRecoveryPhraseContinue: (phrase: string) => Promise<void>;
  handleWatchAddressContinue: (address: string) => Promise<void>;
  handleLogout: (navigation: NavigationType) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [watchedAddress, setWatchedAddress] = useState<string>('');

  const handleRecoveryPhraseContinue = async (phrase: string) => {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      // Clear watched address when entering wallet mode
      setWatchedAddress('');
    } catch (error) {
      console.error('Error creating wallet from recovery phrase:', error);
    }
  };

  const handleWatchAddressContinue = async (address: string) => {
    setWatchedAddress(address);
    // Clear wallet state when entering watch mode
    setWallet(null);
  };

  const handleLogout = (navigation: NavigationType) => {
    // Clear wallet state
    setWallet(null);
    setWatchedAddress('');
    // Navigate back to landing page
    navigation.navigate('Landing');
  };

  const value: WalletContextType = {
    // State
    wallet,
    watchedAddress,

    // Setters
    setWallet,
    setWatchedAddress,

    // Actions
    handleRecoveryPhraseContinue,
    handleWatchAddressContinue,
    handleLogout,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
