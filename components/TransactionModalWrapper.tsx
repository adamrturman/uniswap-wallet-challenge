import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import TransactionModal from './TransactionModal';

export default function TransactionModalWrapper() {
  const {
    isModalVisible,
    transactionStatus,
    transactionData,
    approveTransaction,
    hideTransactionModal,
  } = useTransaction();

  return (
    <TransactionModal
      visible={isModalVisible}
      status={transactionStatus}
      transactionData={transactionData}
      onExecuteTransaction={approveTransaction}
      onClose={hideTransactionModal}
    />
  );
}
