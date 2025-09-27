import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Wallet } from 'ethers';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChainKey } from './config/chain';
import { fetchChainBalances, createInitialChainBalances, ChainBalances } from './utils/balanceUtils';
import { NavigationType } from './types';
import Landing from './components/Landing';
import EnterWatchAddress from './components/EnterWatchAddress';
import EnterRecoveryPhrase from './components/EnterRecoveryPhrase';
import EnterRecipientAddress from './components/EnterRecipientAddress';
import SelectToken from './components/SelectToken';
import EnterAmountToSend from './components/EnterAmountToSend';
import Portfolio from './components/Portfolio';
import TransactionConfirmation from './components/TransactionConfirmation';
import { ThemeProvider } from './theme';
import { TransactionProvider } from './context/TransactionContext';
import TransactionModalWrapper from './components/TransactionModalWrapper';

const Stack = createNativeStackNavigator();

export default function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [watchedAddress, setWatchedAddress] = useState<string>('');
  const [balances, setBalances] = useState<ChainBalances | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<{
    chainKey: ChainKey;
    balance: number;
    symbol: string;
  } | null>(null);
  const [transactionAmount, setTransactionAmount] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Dev mode: Set up mock data for testing
  const handleDevNavigation = () => {
    setSelectedToken({
      chainKey: 'sepolia',
      balance: 0.399,
      symbol: 'ETH',
    });
  };

  const handleWatchAddressContinue = (address: string, watchedAddressBalances: ChainBalances) => {
    setWatchedAddress(address);
    setBalances(watchedAddressBalances);
    // Clear wallet state when entering watch mode
    setWallet(null);
  };

  const handleRecoveryPhraseContinue = async (phrase: string) => {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      // Clear watched address when entering wallet mode
      setWatchedAddress('');
      
      // Set initial loading state and navigate immediately
      const initialBalances = createInitialChainBalances();
      setBalances(initialBalances);
      
      // Fetch balances in the background
      const fetchedBalances = await fetchChainBalances(walletFromPhrase.address);
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
    setTransactionAmount(amount);
    // TODO: Navigate to transaction confirmation screen
  };

  const handleTransactionExecute = async (amount: string): Promise<{ success: boolean; hash?: string; error?: string }> => {
    if (!wallet || !selectedToken || !recipientAddress) {
      console.error('Missing required transaction data');
      return { success: false, error: 'Missing required transaction data' };
    }

    try {
      const { sendNativeTransaction } = await import('./utils/transactionUtils');
      const chainConfig = require('./components/chainConfig').chainConfig;
      const config = chainConfig[selectedToken.chainKey];
      
      const result = await sendNativeTransaction(
        wallet,
        recipientAddress,
        amount,
        config.rpcUrl
      );

      if (result.success && result.hash) {
        setTransactionHash(result.hash);
        console.log('Transaction hash set:', result.hash);
        console.log('Current state:', { transactionHash: result.hash, selectedToken, recipientAddress, transactionAmount });
        // Navigate to success screen or show success toast
        return { success: true, hash: result.hash };
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Transaction execution failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const handleRefetchBalances = async () => {
    const addressToRefetch = wallet?.address;
    if (!addressToRefetch) return;
    
    try {
      const fetchedBalances = await fetchChainBalances(addressToRefetch);
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Failed to refetch balances:', error);
    }
  };

  const handleLogout = (navigation: NavigationType) => {
    // Clear wallet state
    setWallet(null);
    setBalances(null);
    setRecipientAddress('');
    setSelectedToken(null);
    setTransactionAmount('');
    setTransactionHash('');
    
    // Navigate back to landing page
    navigation.navigate('Landing');
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TransactionProvider>
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
                {({ navigation }) => <EnterRecipientAddress onContinue={handleRecipientAddressContinue} onLogout={() => handleLogout(navigation)} wallet={wallet} />}
              </Stack.Screen>
              <Stack.Screen name="SelectToken">
                {({ navigation }) => balances ? (
                  <SelectToken
                    address={watchedAddress}
                    balances={balances}
                    wallet={wallet}
                    onTokenSelect={handleTokenSelect}
                    onLogout={() => handleLogout(navigation)}
                  />
                ) : null}
              </Stack.Screen>
              <Stack.Screen name="EnterAmountToSend">
                {({ navigation }) => selectedToken ? (
                  <EnterAmountToSend
                    selectedToken={selectedToken}
                    onContinue={handleAmountContinue}
                    onTransactionExecute={handleTransactionExecute}
                    wallet={wallet}
                    recipientAddress={recipientAddress}
                    onLogout={() => handleLogout(navigation)}
                  />
                ) : null}
              </Stack.Screen>
              <Stack.Screen name="Portfolio">
                {({ navigation }) => balances ? (
                  <Portfolio
                    address={wallet?.address || watchedAddress}
                    balances={balances}
                    wallet={wallet}
                    onRefetchBalances={handleRefetchBalances}
                    onLogout={() => handleLogout(navigation)}
                  />
                ) : null}
              </Stack.Screen>
              <Stack.Screen name="TransactionConfirmation">
                {() => {
                  console.log('TransactionConfirmation render check:', {
                    transactionHash,
                    selectedToken,
                    recipientAddress,
                    transactionAmount,
                    allPresent: !!(transactionHash && selectedToken && recipientAddress && transactionAmount)
                  });
                  return transactionHash && selectedToken && recipientAddress && transactionAmount ? (
                    <TransactionConfirmation
                      transactionHash={transactionHash}
                      amount={transactionAmount}
                      tokenSymbol={selectedToken.symbol}
                      recipientAddress={recipientAddress}
                      fromAddress={watchedAddress}
                      onRefetchBalances={handleRefetchBalances}
                    />
                  ) : null;
                }}
              </Stack.Screen>
            </Stack.Navigator>
            <TransactionModalWrapper />
          </NavigationContainer>
        </TransactionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
