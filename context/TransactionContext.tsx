import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { TransactionStatus } from '../components/TransactionModal';

type TransactionParams = {
  status: TransactionStatus;
  hash?: string;
  error?: string;
  chainKey?: string;
  transactionData?: any;
};

interface TransactionContextType {
  isModalVisible: boolean;
  transactionStatus: TransactionStatus;
  transactionHash?: string;
  errorMessage?: string;
  chainKey?: string;
  transactionData?: any;
  showTransactionModal: (params: TransactionParams) => void;
  hideTransactionModal: () => void;
  updateTransactionStatus: (params: TransactionParams) => void;
  onApprove?: () => void;
  setOnApprove: (callback: (() => void) | undefined) => void;
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
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [chainKey, setChainKey] = useState<string | undefined>();
  const [transactionData, setTransactionData] = useState<any>(undefined);
  const [onApprove, setOnApproveState] = useState<(() => void) | undefined>(
    undefined,
  );
  const approveTransactionRef = useRef<(() => Promise<void>) | undefined>(
    undefined,
  );

  const showTransactionModal = ({
    status,
    hash,
    error,
    chainKey,
    transactionData,
  }: TransactionParams) => {
    setTransactionStatus(status);
    setTransactionHash(hash);
    setErrorMessage(error);
    setChainKey(chainKey);
    setTransactionData(transactionData);
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
      setTransactionData(undefined);
      setOnApproveState(undefined);
      approveTransactionRef.current = undefined;
    }, 300);
  };

  const updateTransactionStatus = ({
    status,
    hash,
    error,
    chainKey,
    transactionData,
  }: TransactionParams) => {
    setTransactionStatus(status);
    if (hash) setTransactionHash(hash);
    if (error) setErrorMessage(error);
    if (chainKey) setChainKey(chainKey);
    if (transactionData) setTransactionData(transactionData);
    // Don't set modal visible here - it should already be visible
  };

  const setOnApprove = (callback: (() => void) | undefined) => {
    setOnApproveState(callback);
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
        transactionHash,
        errorMessage,
        chainKey,
        transactionData,
        showTransactionModal,
        hideTransactionModal,
        updateTransactionStatus,
        onApprove,
        setOnApprove,
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
