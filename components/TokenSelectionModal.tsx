import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, spacing, typography, radius } from '../theme';
import TokenBalance from './TokenBalance';
import {
  AllTokenBalances,
  getTokensWithBalances,
  TokenItem,
} from '../utils/balanceUtils';
import { ChainKey, TokenKey } from '../config/chain';

export type TokenSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  onTokenSelect: (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => void;
  balances: AllTokenBalances;
  currentToken?: {
    chainKey: ChainKey;
    tokenKey: TokenKey;
  };
};

export default function TokenSelectionModal({
  visible,
  onClose,
  onTokenSelect,
  balances,
  currentToken,
}: TokenSelectionModalProps) {
  const { colors, themeMode } = useTheme();
  const [localCurrentToken, setLocalCurrentToken] = useState(currentToken);

  // Update local state when modal opens with the current token
  useEffect(() => {
    if (visible) {
      setLocalCurrentToken(currentToken);
    }
  }, [visible, currentToken]);

  // Filter tokens with non-zero balances
  const availableTokens = useMemo(() => {
    return getTokensWithBalances(balances);
  }, [balances]);

  const handleTokenSelect = (token: TokenItem) => {
    onTokenSelect(token.chainKey, token.tokenKey, token.balance, token.symbol);
    onClose();
  };

  const isCurrentToken = (token: TokenItem) => {
    return (
      localCurrentToken &&
      localCurrentToken.chainKey === token.chainKey &&
      localCurrentToken.tokenKey === token.tokenKey
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[
          styles.overlay,
          {
            backgroundColor:
              themeMode === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
          },
        ]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background, shadowColor: colors.shadow },
          ]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              Select a token
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.tokenList}
            showsVerticalScrollIndicator={false}
          >
            {availableTokens.map((token) => (
              <TouchableOpacity
                key={`${token.chainKey}-${token.tokenKey}`}
                style={[
                  styles.tokenRow,
                  isCurrentToken(token) && {
                    backgroundColor:
                      themeMode === 'dark'
                        ? colors.backgroundSecondary
                        : colors.primaryLight,
                  },
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
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectedText,
                        { color: colors.background },
                      ]}
                    >
                      ✓
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: radius.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
  },
  closeButton: {
    padding: spacing.sm,
  },
  tokenList: {
    maxHeight: 300,
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
