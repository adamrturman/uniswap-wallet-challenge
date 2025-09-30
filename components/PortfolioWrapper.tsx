import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useBalance } from '../context/BalanceContext';
import Portfolio from './Portfolio';

export function PortfolioWrapper() {
  const { wallet, watchedAddress, handleLogout } = useWallet();
  const { balances } = useBalance();

  if (!balances) return null;

  return (
    <Portfolio
      address={wallet?.address || watchedAddress}
      balances={balances}
      wallet={wallet}
      onLogout={() => handleLogout({ navigate: () => {}, goBack: () => {} })}
    />
  );
}
