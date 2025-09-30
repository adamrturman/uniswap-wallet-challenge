import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet } from 'ethers';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChainKey,
  chainOrder,
  TokenKey,
  chainConfig,
  tokenConfig,
} from '../config/chain';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import { truncateAddress } from '../utils/addressUtils';
import Button from './Button';
import Header from './Header';
import ChainSelectorGroup from './ChainSelectorGroup';
import TokenBalance from './TokenBalance';
import ScreenWrapper from './ScreenWrapper';
import {
  AllTokenBalances,
  getTokensWithBalances,
  BalanceLoadingState,
} from '../utils/balanceUtils';
import { usePrice } from '../context/PriceContext';

export type PortfolioProps = {
  address: string;
  balances: AllTokenBalances;
  wallet?: Wallet | null;
  onLogout?: () => void;
};

export default function Portfolio({
  address,
  balances,
  wallet,
  onLogout,
}: PortfolioProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const { getTokenUsdValue } = usePrice();
  const [selected, setSelected] = useState<'all' | 'active' | ChainKey>('all');
  const [sortByUsd, setSortByUsd] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showGradient, setShowGradient] = useState(true);

  // Removed automatic balance refetching on focus to prevent 429 errors

  const handleSendTransaction = () => {
    if (!wallet) {
      Alert.alert('Error', 'Wallet not available');
      return;
    }

    // Navigate to EnterRecipientAddress screen
    navigation.navigate('EnterRecipientAddress');
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(address);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setShowGradient(!isAtBottom);
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
      balanceState: BalanceLoadingState;
      chainIcon: any;
      tokenIcon: any;
      usdValue?: number;
    }> = [];

    // Handle active balances filtering
    if (selected === 'active') {
      const activeTokens = getTokensWithBalances(balances);

      const mappedTokens = activeTokens.map((token) => {
        const usdValue = getTokenUsdValue(token.symbol, token.balance);
        return {
          chainKey: token.chainKey,
          tokenKey: token.tokenKey,
          name: token.name,
          symbol: token.symbol,
          balance: token.balance,
          balanceState: 'loaded' as const,
          chainIcon: chainConfig[token.chainKey].chainIcon,
          tokenIcon: token.tokenIcon,
          usdValue: usdValue || 0,
        };
      });

      // Apply USD sorting to active tokens if enabled
      if (sortByUsd) {
        return [...mappedTokens].sort(
          (a, b) => (b.usdValue || 0) - (a.usdValue || 0),
        );
      }

      return mappedTokens;
    }

    const keys =
      selected === 'all'
        ? orderedKeys
        : orderedKeys.filter((k) => k === selected);

    keys.forEach((chainKey) => {
      const chainBalances = balances[chainKey];
      if (!chainBalances) return;

      const config = chainConfig[chainKey];

      // Add native token (always show, regardless of balance)
      const nativeBalance = chainBalances.native?.value || 0;
      const nativeUsdValue = getTokenUsdValue(config.symbol, nativeBalance);

      tokens.push({
        chainKey,
        tokenKey: config.symbol as TokenKey,
        name: config.nativeTokenDisplay,
        symbol: config.symbol,
        balance: nativeBalance,
        balanceState: chainBalances.native?.state || 'loading',
        chainIcon: config.chainIcon,
        tokenIcon: config.nativeTokenIcon,
        usdValue: nativeUsdValue || 0,
      });

      // Add ERC-20 tokens (show all, regardless of balance)
      if (chainBalances.tokens) {
        // Get available tokens for this chain
        const availableTokens = Object.keys(
          tokenConfig[chainKey],
        ) as TokenKey[];
        const tokenKeys: TokenKey[] = availableTokens;

        tokenKeys.forEach((tokenKey) => {
          const tokenBalance = chainBalances.tokens[tokenKey];
          const token = tokenConfig[chainKey][tokenKey];
          if (token) {
            const balance = tokenBalance?.value || 0;
            const usdValue = getTokenUsdValue(token.symbol, balance);

            tokens.push({
              chainKey,
              tokenKey,
              name: token.name,
              symbol: token.symbol,
              balance,
              balanceState: tokenBalance?.state || 'loading',
              chainIcon: chainConfig[chainKey].chainIcon,
              tokenIcon: token.icon,
              usdValue: usdValue || 0,
            });
          }
        });
      }
    });

    // Sort by USD value if enabled
    if (sortByUsd) {
      return [...tokens].sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));
    }

    return tokens;
  }, [orderedKeys, selected, balances, sortByUsd, getTokenUsdValue]);

  return (
    <ScreenWrapper
      showLogoutButton={!!(wallet && onLogout)}
      onLogout={onLogout}
    >
      <View style={styles.addressCard}>
        <Header
          icon="wallet"
          text={
            <View style={styles.addressContainer}>
              <Text style={[styles.addressText, { color: colors.text }]}>
                {truncateAddress(address)}
              </Text>
              <TouchableOpacity
                onPress={handleCopyAddress}
                style={styles.copyButton}
                activeOpacity={0.7}
              >
                <FontAwesome6
                  name={copySuccess ? 'circle-check' : 'copy'}
                  size={12}
                  color={copySuccess ? colors.success : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          }
        />
      </View>

      <ChainSelectorGroup selected={selected} onSelectionChange={setSelected} />

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortByUsd(!sortByUsd)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.sortButtonText, { color: colors.textSecondary }]}
          >
            {'USD Value ' + (sortByUsd ? '↑' : '↓')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
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
        {showGradient && (
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.bottomGradient}
            pointerEvents="none"
          />
        )}
      </View>

      {/* Send button - only show if wallet is available */}
      {wallet && (
        <View
          style={{
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xl * 2,
            paddingTop: spacing.xl,
          }}
        >
          <Button
            title="Send"
            onPress={handleSendTransaction}
            variant="primary"
            fullWidth
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  addressCard: {
    marginTop: 0,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  addressText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
  },
  copyButton: {
    padding: 0,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  sortContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    alignItems: 'flex-end',
  },
  sortButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
  },
});
