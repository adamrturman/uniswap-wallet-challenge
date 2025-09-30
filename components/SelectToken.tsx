import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet } from 'ethers';
import { ChainKey, TokenKey } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';
import TokenBalance from './TokenBalance';
import {
  AllTokenBalances,
  getTokensWithBalances,
  TokenItem,
} from '../utils/balanceUtils';

export type SelectTokenProps = {
  address: string;
  balances: AllTokenBalances;
  wallet?: Wallet | null;
  onTokenSelect?: (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => void;
  onLogout?: () => void;
};

export default function SelectToken({
  address,
  balances,
  wallet,
  onTokenSelect,
  onLogout,
}: SelectTokenProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();

  // Filter tokens with non-zero balances
  const availableTokens = useMemo(() => {
    return getTokensWithBalances(balances);
  }, [balances]);

  const handleTokenSelect = (token: TokenItem) => {
    onTokenSelect?.(
      token.chainKey,
      token.tokenKey,
      token.balance,
      token.symbol,
    );
    navigation.navigate('EnterAmountToSend');
  };

  return (
    <ScreenWrapper
      showLogoutButton={!!(wallet && onLogout)}
      onLogout={onLogout}
    >
      <View style={styles.content}>
        <Header
          icon="coins"
          text={
            <Text style={[styles.title, { color: colors.text }]}>
              Select a token to send
            </Text>
          }
        />

        <ScrollView
          style={styles.tokenList}
          showsVerticalScrollIndicator={false}
        >
          {availableTokens.map((token) => (
            <TouchableOpacity
              key={`${token.chainKey}-${token.tokenKey}`}
              style={styles.tokenRow}
              onPress={() => handleTokenSelect(token)}
              activeOpacity={0.7}
            >
              <TokenBalance
                balance={{ value: token.balance, state: 'loaded' }}
                tokenName={token.name}
                tokenSymbol={token.symbol}
                tokenIcon={token.tokenIcon}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: spacing.md,
  },
});
