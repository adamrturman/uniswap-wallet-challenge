import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
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
  const [route, setRoute] = useState<'landing' | 'enterWatch'>('landing');

  async function handleContinue(address: string) {
    try {
      const wei = await fetchEthBalanceWei(address);
      const eth = formatEther(wei);
      console.log({
        chain: 'ethereum-mainnet',
        address,
        balanceWei: wei.toString(),
        balanceEth: eth,
      });
    } catch (e) {
      console.warn('Failed to fetch balance', e);
    }
  }

  return (
    <View style={styles.container}>
      {route === 'landing' ? (
        <Landing
          onImportWallet={() => console.log('Import wallet pressed')}
          onWatchAddress={() => setRoute('enterWatch')}
        />
      ) : (
        <EnterWatchAddress
          onBack={() => setRoute('landing')}
          onContinue={(address) => handleContinue(address)}
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
