import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, spacing, typography, radius } from '../theme';
import TokenBalance from './TokenBalance';
import { AllTokenBalances } from '../utils/balanceUtils';
import { chainConfig, ChainKey, chainOrder, TokenKey } from '../config/chain';
import { TokenIcon } from './types';

export type TokenSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onTokenSelect: (chainKey: ChainKey, tokenKey: TokenKey, balance: number, symbol: string) => void;
  balances: AllTokenBalances;
  currentToken?: {
    chainKey: ChainKey;
    tokenKey: TokenKey;
  };
};

type TokenItem = {
  chainKey: ChainKey;
  tokenKey: TokenKey;
  name: string;
  symbol: string;
  balance: number;
  tokenIcon: TokenIcon;
};

export default function TokenSelectionModal({ 
  visible, 
  onClose, 
  onTokenSelect, 
  balances, 
  currentToken 
}: TokenSelectionModalProps) {
  const { colors } = useTheme();

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
          tokenKey: config.symbol as TokenKey,
          name: config.nativeTokenDisplay,
          symbol: config.symbol,
          balance: chainBalances.native.value,
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
          // Skip native token as it's handled separately
          const nativeSymbol = chainConfig[chainKey].symbol;
          if (tokenKey === nativeSymbol) return;
          
          const tokenBalance = chainBalances.tokens[tokenKey];
          if (tokenBalance && tokenBalance.value > 0) {
            const token = tokenConfig[chainKey][tokenKey];
            if (token) {
              tokens.push({
                chainKey,
                tokenKey,
                name: token.name,
                symbol: token.symbol,
                balance: tokenBalance.value,
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
    onTokenSelect(token.chainKey, token.tokenKey, token.balance, token.symbol);
    onClose();
  };

  const isCurrentToken = (token: TokenItem) => {
    return currentToken && 
           currentToken.chainKey === token.chainKey && 
           currentToken.tokenKey === token.tokenKey;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Select a token
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tokenList} showsVerticalScrollIndicator={false}>
          {availableTokens.map((token) => (
            <TouchableOpacity
              key={`${token.chainKey}-${token.tokenKey}`}
              style={[
                styles.tokenRow,
                isCurrentToken(token) && { backgroundColor: colors.primaryLight }
              ]}
              onPress={() => handleTokenSelect(token)}
              activeOpacity={0.7}
            >
              <View style={styles.tokenInfo}>
                <TokenBalance
                  balance={{ value: token.balance, state: 'loaded' }}
                  tokenName={token.name}
                  tokenSymbol={token.symbol}
                  tokenIcon={token.tokenIcon}
                />
              </View>
              {isCurrentToken(token) && (
                <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.selectedText, { color: colors.background }]}>
                    ✓
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  closeButton: {
    padding: spacing.sm,
  },
  tokenList: {
    flex: 1,
  },
  tokenRow: {
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: 0,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  tokenInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
});
