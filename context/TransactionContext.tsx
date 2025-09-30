import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from 'react';
import {
  TransactionStatus,
  TransactionData,
  ChainKey,
  TokenKey,
  GasEstimate,
} from '../types';

type TransactionParams = {
  status: TransactionStatus;
  transactionData?: TransactionData;
};

interface TransactionContextType {
  isModalVisible: boolean;
  transactionStatus: TransactionStatus;
  transactionData?: TransactionData;
  selectedToken: {
    chainKey: ChainKey;
    tokenKey: TokenKey;
    balance: number;
    symbol: string;
  } | null;
  recipientAddress: string;
  transactionAmount: string;
  transactionHash: string;
  transactionGasEstimate: GasEstimate | null;
  showTransactionModal: (params: TransactionParams) => void;
  hideTransactionModal: () => void;
  updateTransactionStatus: (params: TransactionParams) => void;
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
  const [selectedToken, setSelectedToken] = useState<{
    chainKey: ChainKey;
    tokenKey: TokenKey;
    balance: number;
    symbol: string;
  } | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transactionAmount, setTransactionAmount] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [transactionGasEstimate, setTransactionGasEstimate] =
    useState<GasEstimate | null>(null);
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

  const handleTokenSelect = (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => {
    setSelectedToken({ chainKey, tokenKey, balance, symbol });
  };

  const handleAmountContinue = (amount: string) => {
    setTransactionAmount(amount);
  };

  const handleTransactionExecute = async (
    amount: string,
    gasEstimate?: GasEstimate,
  ): Promise<{ success: boolean; hash?: string; error?: string }> => {
    // This would be implemented with actual transaction logic
    // For now, return a mock response
    return { success: true, hash: '0x123...' };
  };

  return (
    <TransactionContext.Provider
      value={{
        isModalVisible,
        transactionStatus,
        transactionData,
        selectedToken,
        recipientAddress,
        transactionAmount,
        transactionHash,
        transactionGasEstimate,
        showTransactionModal,
        hideTransactionModal,
        updateTransactionStatus,
        handleTokenSelect,
        handleAmountContinue,
        handleTransactionExecute,
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
