import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import ChainTokenIcon from './ChainTokenIcon';
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
            <View style={[styles.amountInputContainer, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                autoFocus
              />
              <View style={[styles.tokenSelector, { backgroundColor: colors.pillBackground }]}>
                {(() => {
                  const chain = chainConfig[selectedToken.chainKey];
                  const { baseIcon, overlayIcon } = chain.nativeTokenIcon;
                  
                  if (overlayIcon) {
                    return <ChainTokenIcon overlayIcon={overlayIcon} style={styles.tokenIcon} />;
                  }
                  
                  if (typeof baseIcon === 'function') {
                    const Component = baseIcon;
                    return <Component style={styles.tokenIcon} />;
                  }
                  
                  return <Image source={baseIcon} style={styles.tokenIcon} resizeMode="contain" />;
                })()}
                <Text style={[styles.tokenSymbol, { color: colors.text }]}>
                  {selectedToken.symbol}
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
                {selectedToken.balance.toFixed(4)} {selectedToken.symbol}
              </Text>
              <TouchableOpacity
                style={[styles.maxButton, { backgroundColor: colors.primary }]}
                onPress={handleMaxAmount}
                activeOpacity={0.8}
              >
                <Text style={[styles.maxButtonText, { color: colors.textInverse }]}>
                  Max
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.lg,
    backgroundColor: '#ffffff',
    minHeight: 80,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    gap: spacing.sm,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tokenSymbol: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
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
  footer: {
    marginTop: 'auto',
  },
});
