import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Wallet } from 'ethers';
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
import TransactionConfirmation from './components/TransactionConfirmation';
import { ThemeProvider } from './theme';
import { TransactionProvider } from './context/TransactionContext';
import TransactionModalWrapper from './components/TransactionModalWrapper';

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

  const handleWatchAddressContinue = (address: string, watchedAddressBalances: Record<ChainKey, number>) => {
    setWatchedAddress(address);
    setBalances(watchedAddressBalances);
  };

  const handleRecoveryPhraseContinue = async (phrase: string) => {
    try {
      const walletFromPhrase = Wallet.fromMnemonic(phrase);
      setWallet(walletFromPhrase);
      
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
    if (!watchedAddress) return;
    
    try {
      const fetchedBalances = await fetchBalancesForAllChains(watchedAddress);
      setBalances(fetchedBalances);
    } catch (error) {
      console.error('Failed to refetch balances:', error);
    }
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
                    onTransactionExecute={handleTransactionExecute}
                    wallet={wallet}
                    recipientAddress={recipientAddress}
                  />
                ) : null}
              </Stack.Screen>
              <Stack.Screen name="Portfolio">
                {() => balances ? (
                  <Portfolio
                    address={watchedAddress}
                    balances={balances}
                    wallet={wallet}
                    onRefetchBalances={handleRefetchBalances}
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
