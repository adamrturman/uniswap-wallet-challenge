import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { chainConfig, ChainKey } from './chainConfig';
import { useTheme, spacing, typography } from '../theme';

export type TokenBalanceProps = {
  chainKey: ChainKey;
  balance: number;
};

export default function TokenBalance({ chainKey, balance }: TokenBalanceProps) {
  const { colors } = useTheme();
  const chain = chainConfig[chainKey];

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Image 
          source={chain.nativeTokenIcon} 
          style={styles.tokenIcon} 
        />
        <Text style={[styles.chainName, { color: colors.text }]}>
          {chain.nativeTokenName}
        </Text>
      </View>
      <Text style={[styles.chainBalance, { color: colors.text }]}>
        {Number(balance).toFixed(4)} {chain.symbol}
      </Text>
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
    fontWeight: typography.weights.semibold,
  },
  tokenIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
});
