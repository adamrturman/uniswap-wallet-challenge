import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import TransactionModal from './TransactionModal';

export default function TransactionModalWrapper() {
  const {
    isModalVisible,
    transactionStatus,
    transactionHash,
    errorMessage,
    chainKey,
    hideTransactionModal,
  } = useTransaction();

  return (
    <TransactionModal
      visible={isModalVisible}
      status={transactionStatus}
      transactionHash={transactionHash}
      errorMessage={errorMessage}
      chainKey={chainKey}
      onClose={hideTransactionModal}
    />
  );
}
