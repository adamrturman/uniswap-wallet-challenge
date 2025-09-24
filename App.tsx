import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import EnterRecoveryPhrase from './components/EnterRecoveryPhrase';
import Portfolio from './components/Portfolio';
import { ChainKey } from './components/chainConfig';
import { providers, utils, BigNumber, BigNumberish, Wallet } from 'ethers';
import { ThemeProvider, useTheme } from './theme';

async function fetchEthBalanceWei(address: string): Promise<BigNumber> {
  const provider = new providers.JsonRpcProvider('https://cloudflare-eth.com');
  const balance = await provider.getBalance(address);
  return balance; // BigNumber (wei)
}

function formatEther(wei: BigNumberish): string {
  return utils.formatEther(wei);
}

function AppContent() {
  const [route, setRoute] = useState<'landing' | 'enterWatch' | 'enterRecoveryPhrase' | 'portfolio'>('landing');
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<Record<ChainKey, number> | null>(null);
  const { colors } = useTheme();

  function handleContinue(address: string, nextBalances: Record<ChainKey, number>) {
    setWatchedAddress(address);
    setBalances(nextBalances);
    setRoute('portfolio');
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
          onContinue={(phrase) => console.log('Recovery phrase entered:', phrase)}
        />
      )}
      {route === 'portfolio' && balances && (
        <Portfolio
          address={watchedAddress}
          balances={balances}
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
