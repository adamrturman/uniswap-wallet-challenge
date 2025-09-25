import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import ChainTokenIcon from './ChainTokenIcon';
import EthIcon from './EthIcon';
import { ChainKey, chainConfig } from './chainConfig';

type EnterAmountToSendProps = {
  selectedToken: {
    chainKey: ChainKey;
    balance: number;
    symbol: string;
  };
  onContinue?: (amount: string) => void;
};

export default function EnterAmountToSend({ selectedToken, onContinue }: EnterAmountToSendProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isValidAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    return numAmount > 0 && numAmount <= selectedToken.balance;
  }, [amount, selectedToken.balance]);

  const showError = useMemo(() => {
    const numAmount = parseFloat(amount);
    // Only show error if we have a positive number that exceeds balance
    return amount.trim().length > 0 && numAmount > 0 && numAmount > selectedToken.balance;
  }, [amount, selectedToken.balance]);

  const handleContinue = () => {
    if (!isValidAmount) return;

    onContinue?.(amount);
    // TODO: Navigate to next screen (transaction confirmation)
  };

  const handleMaxAmount = () => {
    setAmount(selectedToken.balance.toString());
  };

  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericText.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setAmount(numericText);
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerCenter}>
            <View style={[styles.questionIcon, { backgroundColor: colors.primaryLight }]}>
              <FontAwesome6 name="question" size={16} color={colors.textInverse} />
            </View>
          </View>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Enter amount to send
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={[styles.amountInputContainer, { 
          borderColor: showError 
            ? colors.error 
            : isFocused 
              ? colors.primary 
              : colors.border 
        }]}>
              <TextInput
                style={[styles.amountInput, { 
                  color: colors.text,
                  borderWidth: 0,
                  outline: 'none',
                  borderColor: 'transparent'
                }]}
                value={amount}
                onChangeText={handleAmountChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                autoFocus
              />
              
              {/* Token selector positioned inside input */}
              <View style={[styles.tokenSelector, { backgroundColor: '#ffffff', borderColor: colors.border, borderWidth: 1 }]}>
                <EthIcon size="small" />
                <Text style={[styles.tokenSymbol, { color: colors.text }]}>
                  {selectedToken.symbol}
                </Text>
              </View>
              
              {/* Balance and Max button positioned inside input */}
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
                  {selectedToken.balance.toFixed(4)} {selectedToken.symbol}
                </Text>
                <TouchableOpacity
                  style={[styles.maxButton, { backgroundColor: colors.primaryLight }]}
                  onPress={handleMaxAmount}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.maxButtonText, { color: colors.primary }]}>
                    Max
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {showError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              Amount exceeds your balance of {selectedToken.balance.toFixed(4)} {selectedToken.symbol}
            </Text>
          )}
        </View>

        <View style={[styles.footer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Send"
            onPress={handleContinue}
            variant={isValidAmount ? 'primary' : 'disabled'}
            disabled={!isValidAmount}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40, // Same width as back button for balance
  },
  questionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginTop: 0,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    lineHeight: typography.lineHeights.xl,
  },
  inputContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  amountInputContainer: {
    position: 'relative',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.lg,
    backgroundColor: '#ffffff',
    minHeight: 120,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: typography.weights.medium,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingRight: 120, // Make space for token selector
    paddingBottom: 30, // Make space for balance row
    borderRadius: radius.lg, // Match the container border radius
  },
  tokenSelector: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tokenSymbol: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  balanceRow: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  balanceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
  },
  maxButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
  },
  maxButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
});
