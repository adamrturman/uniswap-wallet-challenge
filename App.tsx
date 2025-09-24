import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Wallet } from 'ethers';
import { ChainKey } from './components/chainConfig';
import { fetchBalancesForAllChains } from './utils/balanceUtils';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import EnterRecoveryPhrase from './components/EnterRecoveryPhrase';
import EnterRecipientAddress from './components/EnterRecipientAddress';
import Portfolio from './components/Portfolio';
import { ThemeProvider } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<Record<ChainKey, number> | null>(null);

  const handleWatchAddressContinue = (address: string, nextBalances: Record<ChainKey, number>) => {
    setWatchedAddress(address);
    setBalances(nextBalances);
    setWallet(null); // Clear wallet when watching address
  };

  const handleRecoveryPhraseContinue = async (phrase: string) => {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      setWatchedAddress(walletFromPhrase.address);
      
      const fetchedBalances = await fetchBalancesForAllChains(walletFromPhrase.address);
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Error creating wallet from recovery phrase:', error);
    }
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="EnterWatchAddress">
            {() => <EnterWatchAddress onContinue={handleWatchAddressContinue} />}
          </Stack.Screen>
          <Stack.Screen name="EnterRecoveryPhrase">
            {() => <EnterRecoveryPhrase onContinue={handleRecoveryPhraseContinue} />}
          </Stack.Screen>
          <Stack.Screen name="EnterRecipientAddress">
            {() => <EnterRecipientAddress onContinue={(address) => console.log('Recipient address:', address)} />}
          </Stack.Screen>
          <Stack.Screen name="Portfolio">
            {() => balances ? (
              <Portfolio
                address={watchedAddress}
                balances={balances}
                wallet={wallet}
              />
            ) : null}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
