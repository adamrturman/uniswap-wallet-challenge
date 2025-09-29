import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Wallet } from 'ethers';
import { chainConfig, ChainKey, chainOrder, TokenKey, tokenConfig } from '../config/chain';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import BackButton from './BackButton';
import Header from './Header';
import LogoutButton from './LogoutButton';
import { ChainBalances, AllTokenBalances } from '../utils/balanceUtils';

export type SelectTokenProps = {
  address: string;
  balances: AllTokenBalances;
  wallet?: Wallet | null;
  onTokenSelect?: (chainKey: ChainKey, tokenKey: TokenKey | 'native', balance: number) => void;
  onLogout?: () => void;
};

type TokenItem = {
  chainKey: ChainKey;
  tokenKey: TokenKey | 'native';
  name: string;
  symbol: string;
  balance: number;
  chainIcon: any;
  tokenIcon: any;
};

export default function SelectToken({ address, balances, wallet, onTokenSelect, onLogout }: SelectTokenProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();

  // Filter tokens with non-zero balances
  const availableTokens = useMemo(() => {
    const tokens: TokenItem[] = [];
    
    chainOrder.forEach((chainKey) => {
      const chainBalances = balances[chainKey];
      if (!chainBalances) return;

      // Add native token if it has a balance
      if (chainBalances.native && chainBalances.native.value > 0) {
        const config = chainConfig[chainKey];
        tokens.push({
          chainKey,
          tokenKey: 'native',
          name: config.nativeTokenDisplay,
          symbol: config.symbol,
          balance: chainBalances.native.value,
          chainIcon: config.chainIcon,
          tokenIcon: config.nativeTokenIcon,
        });
      }

      // Add ERC-20 tokens if they have balances
      if (chainBalances.tokens) {
        const tokenConfig = require('../config/chain').tokenConfig;
        // Get available tokens for this chain
        const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
        const tokenKeys: TokenKey[] = availableTokens;
        
        tokenKeys.forEach((tokenKey) => {
          const tokenBalance = chainBalances.tokens[tokenKey];
          if (tokenBalance && tokenBalance.value > 0) {
            const token = tokenConfig[chainKey][tokenKey];
            if (token) {
              const chainConfigData = chainConfig[chainKey];
              tokens.push({
                chainKey,
                tokenKey,
                name: token.name,
                symbol: token.symbol,
                balance: tokenBalance.value,
                chainIcon: chainConfigData.chainIcon,
                tokenIcon: token.icon,
              });
            }
          }
        });
      }
    });
    
    return tokens;
  }, [balances]);

  const handleTokenSelect = (token: TokenItem) => {
    onTokenSelect?.(token.chainKey, token.tokenKey, token.balance);
    navigation.navigate('EnterAmountToSend');
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        {wallet && onLogout && (
          <LogoutButton onPress={onLogout} />
        )}
      </View>

      <View style={styles.content}>
        <Header
          icon="coins"
          text={
            <Text style={[styles.title, { color: colors.text }]}>
              Select a token to send
            </Text>
          }
        />

        <ScrollView style={styles.tokenList} showsVerticalScrollIndicator={false}>
          {availableTokens.map((token) => (
            <TouchableOpacity
              key={`${token.chainKey}-${token.tokenKey}`}
              style={[styles.tokenRow, { borderBottomColor: colors.border }]}
              onPress={() => handleTokenSelect(token)}
              activeOpacity={0.7}
            >
              <View style={styles.tokenLeft}>
                <Image 
                  source={token.tokenIcon} 
                  style={styles.tokenIcon} 
                />
                <View style={styles.tokenInfo}>
                  <Text style={[styles.tokenName, { color: colors.text }]}>
                    {token.name}
                  </Text>
                  {(token.chainKey !== 'ethereum' || token.tokenKey !== 'native') && (
                    <Text style={[styles.chainName, { color: colors.textSecondary }]}>
                      {token.chainKey === 'optimism' ? 'Optimism' : 
                       token.chainKey === 'arbitrum' ? 'Arbitrum' : 
                       token.chainKey === 'polygon' ? 'Polygon' : 
                       token.chainKey === 'sepolia' ? 'Sepolia' :
                       token.chainKey}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.tokenRight}>
                <Text style={[styles.tokenBalance, { color: colors.text }]}>
                  {token.balance.toFixed(4)} {token.symbol}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: typography.lineHeights.xl,
  },
  tokenList: {
    flex: 1,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tokenIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  chainName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    marginTop: 2,
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenBalance: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
});
