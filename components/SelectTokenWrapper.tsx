import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useBalance } from '../context/BalanceContext';
import { useTransaction } from '../context/TransactionContext';
import SelectToken from './SelectToken';

export function SelectTokenWrapper() {
  const { wallet, watchedAddress, handleLogout } = useWallet();
  const { balances } = useBalance();
  const { handleTokenSelect } = useTransaction();

  if (!balances) return null;

  return (
    <SelectToken
      address={watchedAddress}
      balances={balances}
      wallet={wallet}
      onTokenSelect={handleTokenSelect}
      onLogout={() => handleLogout({ navigate: () => {}, goBack: () => {} })}
    />
  );
}
