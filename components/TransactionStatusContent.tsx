import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme, spacing, typography } from '../theme';
import { TransactionStatus } from '../types';

type TransactionStatusContentProps = {
  status: TransactionStatus;
};

export default function TransactionStatusContent({
  status,
}: TransactionStatusContentProps) {
  const { colors } = useTheme();

  const getStatusTitle = () => {
    switch (status) {
      case 'review':
        return 'Review Transaction';
      case 'pending':
        return 'Transaction in Progress';
      case 'success':
        return 'Transaction Successful!';
      case 'error':
        return 'Transaction Failed';
      default:
        return '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'review':
        return 'Please review the transaction details below before approving.';
      case 'pending':
        return 'Your transaction is being processed. Please wait...';
      case 'success':
        return 'Your transaction has been successfully submitted to the blockchain.';
      case 'error':
        return 'Please check and try again.';
      default:
        return '';
    }
  };

  return (
    <>
      <Text style={[styles.title, { color: colors.text }]}>
        {getStatusTitle()}
      </Text>
      <Text style={[styles.message, { color: colors.text }]}>
        {getStatusMessage()}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing.lg,
  },
});
