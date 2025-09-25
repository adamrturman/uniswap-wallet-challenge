import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { chainConfig, ChainKey } from './chainConfig';
import { useTheme, spacing, typography } from '../theme';
import EthIcon from './EthIcon';
import ChainTokenIcon from './ChainTokenIcon';
import arbitrumIcon from '../assets/arb-logo-official.png';
import optimismIcon from '../assets/optimism.png';

export type TokenBalanceProps = {
  chainKey: ChainKey;
  balance: number;
};

export default function TokenBalance({ chainKey, balance }: TokenBalanceProps) {
  const { colors } = useTheme();
  const chain = chainConfig[chainKey];

  const renderTokenIcon = () => {
    // Check if it's the EthIcon component
    if (chainKey === 'ethereum' && chain.nativeTokenIcon === EthIcon) {
      return <EthIcon size="medium" style={styles.tokenIcon} />;
    }
    
    // Check if it's the ChainTokenIcon component
    if ((chainKey === 'arbitrum' || chainKey === 'optimism' || chainKey === 'sepolia') && chain.nativeTokenIcon === 'ChainTokenIcon') {
      if (chainKey === 'arbitrum') {
        return <ChainTokenIcon overlayIcon={arbitrumIcon} style={styles.tokenIcon} />;
      }
      if (chainKey === 'optimism') {
        return <ChainTokenIcon overlayIcon={optimismIcon} style={styles.tokenIcon} />;
      }
      if (chainKey === 'sepolia') {
        return <ChainTokenIcon style={styles.tokenIcon} />;
      }
    }
    
    // For other chains, use Image component
    return (
      <Image 
        source={chain.nativeTokenIcon} 
        style={styles.tokenIcon} 
      />
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {renderTokenIcon()}
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
