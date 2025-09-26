import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TransactionStatus } from '../components/TransactionModal';

type TransactionParams = {
  status: TransactionStatus;
  hash?: string;
  error?: string;
  chainKey?: string;
};

interface TransactionContextType {
  isModalVisible: boolean;
  transactionStatus: TransactionStatus;
  transactionHash?: string;
  errorMessage?: string;
  chainKey?: string;
  showTransactionModal: (params: TransactionParams) => void;
  hideTransactionModal: () => void;
  updateTransactionStatus: (params: TransactionParams) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('pending');
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [chainKey, setChainKey] = useState<string | undefined>();

  const showTransactionModal = ({ status, hash, error, chainKey }: TransactionParams) => {
    setTransactionStatus(status);
    setTransactionHash(hash);
    setErrorMessage(error);
    setChainKey(chainKey);
    setIsModalVisible(true);
  };

  const hideTransactionModal = () => {
    setIsModalVisible(false);
    // Reset state after a short delay to allow modal to close
    setTimeout(() => {
      setTransactionStatus('pending');
      setTransactionHash(undefined);
      setErrorMessage(undefined);
      setChainKey(undefined);
    }, 300);
  };

  const updateTransactionStatus = ({ status, hash, error, chainKey }: TransactionParams) => {
    setTransactionStatus(status);
    if (hash) setTransactionHash(hash);
    if (error) setErrorMessage(error);
    if (chainKey) setChainKey(chainKey);
  };

  return (
    <TransactionContext.Provider
      value={{
        isModalVisible,
        transactionStatus,
        transactionHash,
        errorMessage,
        chainKey,
        showTransactionModal,
        hideTransactionModal,
        updateTransactionStatus,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}
