import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import Portfolio from './components/Portfolio';
import { ChainKey } from './components/chainConfig';
import { providers, utils, BigNumber, BigNumberish } from 'ethers';

async function fetchEthBalanceWei(address: string): Promise<BigNumber> {
  const provider = new providers.JsonRpcProvider('https://cloudflare-eth.com');
  const balance = await provider.getBalance(address);
  return balance; // BigNumber (wei)
}

function formatEther(wei: BigNumberish): string {
  return utils.formatEther(wei);
}

export default function App() {
  const [route, setRoute] = useState<'landing' | 'enterWatch' | 'portfolio'>('landing');
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<Record<ChainKey, number> | null>(null);

  function handleContinue(address: string, nextBalances: Record<ChainKey, number>) {
    setWatchedAddress(address);
    setBalances(nextBalances);
    setRoute('portfolio');
  }

  return (
    <View style={styles.container}>
      {route === 'landing' && (
        <Landing
          onImportWallet={() => console.log('Import wallet pressed')}
          onWatchAddress={() => setRoute('enterWatch')}
        />
      )}
      {route === 'enterWatch' && (
        <EnterWatchAddress
          onBack={() => setRoute('landing')}
          onContinue={handleContinue}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
