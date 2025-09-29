import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Wallet } from 'ethers';
import { ChainKey, chainOrder, TokenKey } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import ChainSelectorGroup from './ChainSelectorGroup';
import TokenBalance from './TokenBalance';
import LogoutButton from './LogoutButton';
import { AllTokenBalances } from '../utils/balanceUtils';

export type PortfolioProps = {
  address: string;
  balances: AllTokenBalances;
  wallet?: Wallet | null;
  onLogout?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 5)}...${v.slice(-5)}`;
}

export default function Portfolio({ address, balances, wallet, onLogout }: PortfolioProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  // Removed automatic balance refetching on focus to prevent 429 errors

  const handleSendTransaction = () => {
    if (!wallet) {
      Alert.alert('Error', 'Wallet not available');
      return;
    }

    // Navigate to EnterRecipientAddress screen
    navigation.navigate('EnterRecipientAddress');
  };


  const orderedKeys = useMemo(() => chainOrder, []);

  // Create a list of all tokens (native + ERC-20) with their balance states
  const allTokens = useMemo(() => {
    const tokens: Array<{
      chainKey: ChainKey;
      tokenKey: TokenKey;
      name: string;
      symbol: string;
      balance: number;
      balanceState: 'loading' | 'loaded' | 'error';
      chainIcon: any;
      tokenIcon: any;
    }> = [];

    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    
    
    keys.forEach((chainKey) => {
      const chainBalances = balances[chainKey];
      if (!chainBalances) return;

      const chainConfig = require('../config/chain').chainConfig;
      const config = chainConfig[chainKey];

      // Add native token (always show, regardless of balance)
      tokens.push({
        chainKey,
        tokenKey: config.symbol as TokenKey,
        name: config.nativeTokenDisplay,
        symbol: config.symbol,
        balance: chainBalances.native?.value || 0,
        balanceState: chainBalances.native?.state || 'loading',
        chainIcon: config.chainIcon,
        tokenIcon: config.nativeTokenIcon,
      });

      // Add ERC-20 tokens (show all, regardless of balance)
      if (chainBalances.tokens) {
        const tokenConfig = require('../config/chain').tokenConfig;
        // Get available tokens for this chain
        const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
        const tokenKeys: TokenKey[] = availableTokens;
        
        tokenKeys.forEach((tokenKey) => {
          const tokenBalance = chainBalances.tokens[tokenKey];
          const token = tokenConfig[chainKey][tokenKey];
          if (token) {
            tokens.push({
              chainKey,
              tokenKey,
              name: token.name,
              symbol: token.symbol,
              balance: tokenBalance?.value || 0,
              balanceState: tokenBalance?.state || 'loading',
              chainIcon: chainConfig[chainKey].chainIcon,
              tokenIcon: token.icon,
            });
          }
        });
      }
    });

    return tokens;
  }, [orderedKeys, selected, balances]);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        {wallet && onLogout && (
          <LogoutButton onPress={onLogout} />
        )}
      </View>

      <View style={styles.addressCard}>
        <Header
          icon="wallet"
          text={
            <Text style={[styles.addressText, { color: colors.text }]}>
              {truncateAddress(address)}
            </Text>
          }
        />
      </View>

      <ChainSelectorGroup
        selected={selected}
        onSelectionChange={setSelected}
      />

      <ScrollView style={styles.list}>
        {allTokens.map((token) => (
          <TokenBalance
            key={`${token.chainKey}-${token.tokenKey}`}
            balance={{ value: token.balance, state: token.balanceState }}
            tokenName={token.name}
            tokenSymbol={token.symbol}
            tokenIcon={token.tokenIcon}
          />
        ))}
      </ScrollView>

      {/* Send button - only show if wallet is available */}
      {wallet && (
        <View style={[styles.sendButtonContainer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Send"
            onPress={handleSendTransaction}
            variant="primary"
            fullWidth
          />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  addressCard: {
    marginTop: 0,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  addressText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xxl,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  sendButtonContainer: {
    // Spacing will be applied via theme values
  },
});