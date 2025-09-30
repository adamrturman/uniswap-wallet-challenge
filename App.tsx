import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { PriceProvider } from './context/PriceContext';
import { AppProvider, useAppContext } from './context/AppContext';
import TransactionModalWrapper from './components/TransactionModalWrapper';

const Stack = createNativeStackNavigator();

function App() {
  const {
    wallet,
    watchedAddress,
    balances,
    recipientAddress,
    selectedToken,
    transactionAmount,
    transactionHash,
    transactionGasEstimate,
    handleWatchAddressContinue,
    handleRecoveryPhraseContinue,
    handleRecipientAddressContinue,
    handleTokenSelect,
    handleAmountContinue,
    handleTransactionExecute,
    refreshBalances,
    handleLogout,
  } = useAppContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Landing">{() => <Landing />}</Stack.Screen>
        <Stack.Screen name="EnterWatchAddress">
          {() => <EnterWatchAddress onContinue={handleWatchAddressContinue} />}
        </Stack.Screen>
        <Stack.Screen name="EnterRecoveryPhrase">
          {() => (
            <EnterRecoveryPhrase onContinue={handleRecoveryPhraseContinue} />
          )}
        </Stack.Screen>
        <Stack.Screen name="EnterRecipientAddress">
          {({ navigation }) => (
            <EnterRecipientAddress
              onContinue={handleRecipientAddressContinue}
              onLogout={() => handleLogout(navigation)}
              wallet={wallet}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SelectToken">
          {({ navigation }) =>
            balances ? (
              <SelectToken
                address={watchedAddress}
                balances={balances}
                wallet={wallet}
                onTokenSelect={handleTokenSelect}
                onLogout={() => handleLogout(navigation)}
              />
            ) : null
          }
        </Stack.Screen>
        <Stack.Screen name="EnterAmountToSend">
          {({ navigation }) =>
            selectedToken ? (
              <EnterAmountToSend
                selectedToken={selectedToken}
                onContinue={handleAmountContinue}
                onTransactionExecute={handleTransactionExecute}
                wallet={wallet}
                recipientAddress={recipientAddress}
                onLogout={() => handleLogout(navigation)}
                balances={balances}
                address={wallet?.address || watchedAddress}
                onTokenSelect={handleTokenSelect}
                onRefreshBalances={refreshBalances}
              />
            ) : null
          }
        </Stack.Screen>
        <Stack.Screen name="Portfolio">
          {({ navigation }) =>
            balances ? (
              <Portfolio
                address={wallet?.address || watchedAddress}
                balances={balances}
                wallet={wallet}
                onLogout={() => handleLogout(navigation)}
              />
            ) : null
          }
        </Stack.Screen>
        <Stack.Screen name="TransactionConfirmation">
          {() => {
            return transactionHash &&
              selectedToken &&
              recipientAddress &&
              transactionAmount ? (
              <TransactionConfirmation
                transactionHash={transactionHash}
                amount={transactionAmount}
                tokenSymbol={selectedToken.symbol}
                recipientAddress={recipientAddress}
                fromAddress={watchedAddress}
                chainKey={selectedToken.chainKey}
                gasEstimate={transactionGasEstimate}
              />
            ) : null;
          }}
        </Stack.Screen>
      </Stack.Navigator>
      <TransactionModalWrapper />
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PriceProvider>
          <TransactionProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </TransactionProvider>
        </PriceProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
