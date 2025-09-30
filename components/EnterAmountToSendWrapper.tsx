import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useBalance } from '../context/BalanceContext';
import { useTransaction } from '../context/TransactionContext';
import EnterAmountToSend from './EnterAmountToSend';

export function EnterAmountToSendWrapper() {
  const { wallet, watchedAddress } = useWallet();
  const { balances } = useBalance();
  const {
    selectedToken,
    recipientAddress,
    handleAmountContinue,
    handleTokenSelect,
    handleTransactionExecute,
  } = useTransaction();

  if (!selectedToken || !balances) return null;

  return (
    <EnterAmountToSend
      selectedToken={selectedToken}
      onContinue={handleAmountContinue}
      onTransactionExecute={handleTransactionExecute}
      wallet={wallet}
      recipientAddress={recipientAddress}
      balances={balances}
      address={wallet?.address || watchedAddress}
      onTokenSelect={handleTokenSelect}
    />
  );
}
