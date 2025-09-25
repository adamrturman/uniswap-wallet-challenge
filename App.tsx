import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Wallet } from 'ethers';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChainKey } from './components/chainConfig';
import { fetchBalancesForAllChains } from './utils/balanceUtils';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import EnterRecoveryPhrase from './components/EnterRecoveryPhrase';
import EnterRecipientAddress from './components/EnterRecipientAddress';
import SelectToken from './components/SelectToken';
import EnterAmountToSend from './components/EnterAmountToSend';
import Portfolio from './components/Portfolio';
import { ThemeProvider } from './theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<Record<ChainKey, number> | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<{
    chainKey: ChainKey;
    balance: number;
    symbol: string;
  } | null>(null);

  // Dev mode: Set up mock data for testing
  const handleDevNavigation = () => {
    setSelectedToken({
      chainKey: 'sepolia',
      balance: 0.399,
      symbol: 'ETH',
    });
  };

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

  const handleRecipientAddressContinue = (address: string) => {
    setRecipientAddress(address);
  };

  const handleTokenSelect = (chainKey: ChainKey, balance: number) => {
    const chainConfig = require('./components/chainConfig').chainConfig;
    const config = chainConfig[chainKey];
    
    setSelectedToken({
      chainKey,
      balance,
      symbol: config.symbol,
    });
  };

  const handleAmountContinue = (amount: string) => {
    console.log('Amount to send:', amount, 'Token:', selectedToken);
    // TODO: Navigate to transaction confirmation screen
  };

  return (
    <SafeAreaProvider>
      <RootSiblingParent>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Landing"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Landing">
                {() => <Landing onDevNavigation={handleDevNavigation} />}
              </Stack.Screen>
              <Stack.Screen name="EnterWatchAddress">
                {() => <EnterWatchAddress onContinue={handleWatchAddressContinue} />}
              </Stack.Screen>
              <Stack.Screen name="EnterRecoveryPhrase">
                {() => <EnterRecoveryPhrase onContinue={handleRecoveryPhraseContinue} />}
              </Stack.Screen>
              <Stack.Screen name="EnterRecipientAddress">
                {() => <EnterRecipientAddress onContinue={handleRecipientAddressContinue} />}
              </Stack.Screen>
              <Stack.Screen name="SelectToken">
                {() => balances ? (
                  <SelectToken
                    address={watchedAddress}
                    balances={balances}
                    wallet={wallet}
                    onTokenSelect={handleTokenSelect}
                  />
                ) : null}
              </Stack.Screen>
              <Stack.Screen name="EnterAmountToSend">
                {() => selectedToken ? (
                  <EnterAmountToSend
                    selectedToken={selectedToken}
                    onContinue={handleAmountContinue}
                  />
                ) : null}
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
      </RootSiblingParent>
    </SafeAreaProvider>
  );
}
