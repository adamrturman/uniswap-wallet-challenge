import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import EnterRecoveryPhrase from './components/EnterRecoveryPhrase';
import Portfolio from './components/Portfolio';
import { ChainKey } from './components/chainConfig';
import { providers, utils, BigNumber, BigNumberish, Wallet } from 'ethers';
import { chainConfig } from './components/chainConfig';
import { ThemeProvider, useTheme } from './theme';

async function fetchEthBalanceWei(address: string): Promise<BigNumber> {
  const provider = new providers.JsonRpcProvider('https://cloudflare-eth.com');
  const balance = await provider.getBalance(address);
  return balance; // BigNumber (wei)
}

function formatEther(wei: BigNumberish): string {
  return utils.formatEther(wei);
}

async function fetchBalancesForAllChains(address: string): Promise<Record<ChainKey, number>> {
  const balances: Record<ChainKey, number> = {
    ethereum: 0,
    optimism: 0,
    arbitrum: 0,
    polygon: 0,
    sepolia: 0
  };

  // Fetch balances for all chains in parallel
  const promises = Object.keys(chainConfig).map(async (chainKey) => {
    try {
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey as ChainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      balances[chainKey as ChainKey] = balanceEth;
    } catch (error) {
      console.error(`Error fetching balance for ${chainKey}:`, error);
      balances[chainKey as ChainKey] = 0;
    }
  });

  await Promise.all(promises);
  return balances;
}

function AppContent() {
  const [route, setRoute] = useState<'landing' | 'enterWatch' | 'enterRecoveryPhrase' | 'portfolio'>('landing');
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<Record<ChainKey, number> | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const { colors } = useTheme();

  function handleContinue(address: string, nextBalances: Record<ChainKey, number>) {
    setWatchedAddress(address);
    setBalances(nextBalances);
    setRoute('portfolio');
  }

  async function handleRecoveryPhraseContinue(phrase: string) {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      setWatchedAddress(walletFromPhrase.address);
      
      // Fetch real balances for all chains
      const fetchedBalances = await fetchBalancesForAllChains(walletFromPhrase.address);
      setBalances(fetchedBalances);
      setRoute('portfolio');
    } catch (error) {
      console.error('Error creating wallet from recovery phrase:', error);
    }
  }



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {route === 'landing' && (
        <Landing
          onImportWallet={() => setRoute('enterRecoveryPhrase')}
          onWatchAddress={() => setRoute('enterWatch')}
        />
      )}
      {route === 'enterWatch' && (
        <EnterWatchAddress
          onBack={() => setRoute('landing')}
          onContinue={handleContinue}
        />
      )}
      {route === 'enterRecoveryPhrase' && (
        <EnterRecoveryPhrase
          onBack={() => setRoute('landing')}
          onContinue={handleRecoveryPhraseContinue}
        />
      )}
      {route === 'portfolio' && balances && (
        <Portfolio
          address={watchedAddress}
          balances={balances}
          wallet={wallet}
          onBack={() => setRoute('enterWatch')}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
