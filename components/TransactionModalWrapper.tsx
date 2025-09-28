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
    transactionData,
    onApprove,
    approveTransaction,
    hideTransactionModal,
  } = useTransaction();

  return (
    <TransactionModal
      visible={isModalVisible}
      status={transactionStatus}
      transactionHash={transactionHash}
      errorMessage={errorMessage}
      chainKey={chainKey}
      transactionData={transactionData}
      onApprove={onApprove}
      onExecuteTransaction={approveTransaction}
      onClose={hideTransactionModal}
    />
  );
}
