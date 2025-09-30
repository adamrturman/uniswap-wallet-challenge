import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useTransaction } from '../context/TransactionContext';
import TransactionConfirmation from './TransactionConfirmation';

export function TransactionConfirmationWrapper() {
  const { watchedAddress } = useWallet();
  const {
    selectedToken,
    recipientAddress,
    transactionAmount,
    transactionHash,
    transactionGasEstimate,
  } = useTransaction();

  if (
    !transactionHash ||
    !selectedToken ||
    !recipientAddress ||
    !transactionAmount
  ) {
    return null;
  }

  return (
    <TransactionConfirmation
      transactionHash={transactionHash}
      amount={transactionAmount}
      tokenSymbol={selectedToken.symbol}
      recipientAddress={recipientAddress}
      fromAddress={watchedAddress}
      chainKey={selectedToken.chainKey}
      gasEstimate={transactionGasEstimate}
    />
  );
}
