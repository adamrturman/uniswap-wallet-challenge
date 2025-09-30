import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import ChainTokenIcon from './ChainTokenIcon';
import Skeleton from './Skeleton';
import { ChainBalance } from '../utils/balanceUtils';
import { TokenIcon } from './types';
import { usePrice } from '../context/PriceContext';
import { formatTokenAmount } from '../utils/priceUtils';

export type TokenBalanceProps = {
  balance: ChainBalance;
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: TokenIcon;
};

export default function TokenBalance({
  balance,
  tokenName,
  tokenSymbol,
  tokenIcon,
}: TokenBalanceProps) {
  const { colors } = useTheme();
  const { getTokenPrice, getTokenPriceFormatted, getTokenUsdValueFormatted } =
    usePrice();

  // Extract baseIcon and overlayIcon from the tokenIcon object
  const { baseIcon, overlayIcon } = tokenIcon;

  const renderIcon = () => {
    // If there's an overlay, use ChainTokenIcon
    if (overlayIcon) {
      return (
        <ChainTokenIcon
          baseIcon={baseIcon}
          overlayIcon={overlayIcon}
          style={styles.tokenIcon}
        />
      );
    }

    // If baseIcon is a component (like EthIcon)
    if (typeof baseIcon === 'function') {
      const Component = baseIcon;
      return <Component style={styles.tokenIcon} />;
    }

    // If baseIcon is an image source
    return (
      <Image source={baseIcon} style={styles.tokenIcon} resizeMode="contain" />
    );
  };

  const renderBalance = () => {
    if (balance.state === 'loading') {
      return <Skeleton />;
    }

    if (balance.state === 'error') {
      return (
        <Text style={[styles.chainBalance, { color: colors.textSecondary }]}>
          Error loading
        </Text>
      );
    }

    const balanceValue = Number(balance.value);
    const tokenPrice = getTokenPrice(tokenSymbol);
    const usdValue = tokenPrice ? balanceValue * tokenPrice : null;

    return (
      <View style={styles.balanceContainer}>
        <Text
          style={[
            styles.chainBalance,
            {
              color: balanceValue === 0 ? colors.textSecondary : colors.text,
            },
          ]}
        >
          {formatTokenAmount(balanceValue)} {tokenSymbol}
        </Text>
        {usdValue !== null && balanceValue > 0 && (
          <Text style={[styles.usdValue, { color: colors.textSecondary }]}>
            {getTokenUsdValueFormatted(tokenSymbol, balanceValue)}
          </Text>
        )}
      </View>
    );
  };

  const tokenPrice = getTokenPrice(tokenSymbol);

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {renderIcon()}
        <View style={styles.tokenInfo}>
          <Text style={[styles.chainName, { color: colors.text }]}>
            {tokenName}
          </Text>
          {tokenPrice !== null && (
            <Text style={[styles.usdValue, { color: colors.textSecondary }]}>
              {getTokenPriceFormatted(tokenSymbol)}
            </Text>
          )}
        </View>
      </View>
      {renderBalance()}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tokenInfo: {
    flex: 1,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  chainName: {
    fontSize: typography.sizes.base,
  },
  chainBalance: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
  },
  usdValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    marginTop: 2,
  },
  tokenIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
});
