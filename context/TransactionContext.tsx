import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { TransactionStatus, TransactionData } from '../types';

type TransactionParams = {
  status: TransactionStatus;
  transactionData?: TransactionData;
};

interface TransactionContextType {
  isModalVisible: boolean;
  transactionStatus: TransactionStatus;
  transactionData?: TransactionData;
  showTransactionModal: (params: TransactionParams) => void;
  hideTransactionModal: () => void;
  updateTransactionStatus: (params: TransactionParams) => void;
  approveTransaction?: () => Promise<void>;
  setApproveTransaction: (callback: (() => Promise<void>) | undefined) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>('pending');
  const [transactionData, setTransactionData] = useState<
    TransactionData | undefined
  >(undefined);
  const approveTransactionRef = useRef<(() => Promise<void>) | undefined>(
    undefined,
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTransactionModal = ({
    status,
    transactionData,
  }: TransactionParams) => {
    setTransactionStatus(status);
    setTransactionData(transactionData);
    setIsModalVisible(true);
  };

  const hideTransactionModal = () => {
    setIsModalVisible(false);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Reset state after a short delay to allow modal to close
    timeoutRef.current = setTimeout(() => {
      setTransactionStatus('pending');
      setTransactionData(undefined);
      approveTransactionRef.current = undefined;
      timeoutRef.current = null;
    }, 300);
  };

  const updateTransactionStatus = ({
    status,
    transactionData,
  }: TransactionParams) => {
    setTransactionStatus(status);
    if (transactionData) setTransactionData(transactionData);
    // Don't set modal visible here - it should already be visible
  };

  const setApproveTransaction = (
    callback: (() => Promise<void>) | undefined,
  ) => {
    approveTransactionRef.current = callback;
  };

  return (
    <TransactionContext.Provider
      value={{
        isModalVisible,
        transactionStatus,
        transactionData,
        showTransactionModal,
        hideTransactionModal,
        updateTransactionStatus,
        approveTransaction: approveTransactionRef.current,
        setApproveTransaction,
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
