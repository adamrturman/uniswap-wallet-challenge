import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import ChainTokenIcon from './ChainTokenIcon';
import Skeleton from './Skeleton';
import { ChainBalance } from '../utils/balanceUtils';

export type TokenBalanceProps = {
  balance: ChainBalance;
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: any;
};

export default function TokenBalance({ 
  balance, 
  tokenName, 
  tokenSymbol, 
  tokenIcon 
}: TokenBalanceProps) {
  const { colors } = useTheme();
  
  // Handle both old format (direct icon) and new format (combo icon)
  const { baseIcon, overlayIcon } = tokenIcon && typeof tokenIcon === 'object' && 'baseIcon' in tokenIcon 
    ? tokenIcon 
    : { baseIcon: tokenIcon, overlayIcon: undefined };

  const renderIcon = () => {
    // If there's an overlay, use ChainTokenIcon
    if (overlayIcon) {
      return <ChainTokenIcon baseIcon={baseIcon} overlayIcon={overlayIcon} style={styles.tokenIcon} />;
    }
    
    // If baseIcon is a component (like EthIcon)
    if (typeof baseIcon === 'function') {
      const Component = baseIcon;
      return <Component style={styles.tokenIcon} />;
    }
    
    // If baseIcon is an image source
    return <Image source={baseIcon} style={styles.tokenIcon} resizeMode="contain" />;
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
    
    return (
      <Text style={[styles.chainBalance, { 
        color: Number(balance.value) === 0 ? colors.textSecondary : colors.text 
      }]}>
        {Number(balance.value).toFixed(8)} {tokenSymbol}
      </Text>
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {renderIcon()}
        <Text style={[styles.chainName, { color: colors.text }]}>
          {tokenName}
        </Text>
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
  chainName: {
    fontSize: typography.sizes.base,
  },
  chainBalance: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
  },
  tokenIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
});
