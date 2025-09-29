import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';

type TransactionConfirmationProps = {
  transactionHash: string;
  amount: string;
  tokenSymbol: string;
  recipientAddress: string;
  fromAddress: string;
};

export default function TransactionConfirmation({
  transactionHash,
  amount,
  tokenSymbol,
  recipientAddress,
  fromAddress,
}: TransactionConfirmationProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();

  const handleViewOnExplorer = () => {
    // TODO: Open blockchain explorer with transaction hash
    console.log('View transaction on explorer:', transactionHash);
  };

  const handleDone = () => {
    navigation.navigate('Portfolio');
  };

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        <Header
          icon="check-circle"
          text={
            <Text style={[styles.title, { color: colors.text }]}>
              Transaction Successful!
            </Text>
          }
        />

        <View style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.transactionRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {amount} {tokenSymbol}
            </Text>
          </View>
          
          <View style={styles.transactionRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>From</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {fromAddress.slice(0, 6)}...{fromAddress.slice(-4)}
            </Text>
          </View>
          
          <View style={styles.transactionRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>To</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
            </Text>
          </View>
          
          <View style={styles.transactionRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Transaction Hash</Text>
            <TouchableOpacity onPress={handleViewOnExplorer} style={styles.hashContainer}>
              <Text style={[styles.hashText, { color: colors.primary }]}>
                {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </Text>
              <FontAwesome6 name="external-link-alt" size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.successMessage}>
          <FontAwesome6 name="check-circle" size={48} color={colors.success} />
          <Text style={[styles.successText, { color: colors.text }]}>
            Your transaction has been successfully submitted to the blockchain.
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { 
        paddingHorizontal: spacing.xl, 
        paddingBottom: spacing.xl * 2, 
        paddingTop: spacing.xl 
      }]}>
        <Button
          title="Done"
          onPress={handleDone}
          variant="primary"
          fullWidth
        />
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
  transactionCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  value: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  hashText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  successMessage: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  successText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: typography.lineHeights.lg,
  },
  footer: {
    marginTop: 'auto',
  },
});
