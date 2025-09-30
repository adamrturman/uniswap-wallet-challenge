import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography, radius } from '../theme';
import { TransactionData } from './types';
import { truncateAddress } from '../utils/addressUtils';

type TransactionDetailsProps = {
  transactionData: TransactionData;
  onCopyAddress?: (address: string) => void;
};

export default function TransactionDetails({
  transactionData,
  onCopyAddress,
}: TransactionDetailsProps) {
  const { colors } = useTheme();

  const handleCopyAddress = (address: string) => {
    if (onCopyAddress) {
      onCopyAddress(address);
    }
  };

  return (
    <View
      style={[
        styles.transactionDataContainer,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <Text style={[styles.transactionDataTitle, { color: colors.text }]}>
        Transaction Details:
      </Text>
      <View style={styles.transactionDetails}>
        {transactionData.from && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              From
            </Text>
            <View style={styles.transactionValueContainer}>
              <Text style={[styles.transactionValue, { color: colors.text }]}>
                {truncateAddress(transactionData.from)}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyAddress(transactionData.from)}
              >
                <Ionicons
                  name="copy-outline"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {transactionData.to && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              To
            </Text>
            <View style={styles.transactionValueContainer}>
              <Text style={[styles.transactionValue, { color: colors.text }]}>
                {truncateAddress(transactionData.to)}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyAddress(transactionData.to)}
              >
                <Ionicons
                  name="copy-outline"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {transactionData.amount && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              Amount
            </Text>
            <Text style={[styles.transactionValue, { color: colors.text }]}>
              {transactionData.amount}
            </Text>
          </View>
        )}
        {transactionData.tokenSymbol && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              Token
            </Text>
            <Text style={[styles.transactionValue, { color: colors.text }]}>
              {transactionData.tokenSymbol}
            </Text>
          </View>
        )}
        {transactionData.gasEstimate && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              Network Fee
            </Text>
            <Text style={[styles.transactionValue, { color: colors.text }]}>
              {transactionData.gasEstimate.networkFee} ETH
            </Text>
          </View>
        )}
        {transactionData.chainKey && (
          <View style={styles.transactionRow}>
            <Text
              style={[styles.transactionLabel, { color: colors.textSecondary }]}
            >
              Network
            </Text>
            <Text style={[styles.transactionValue, { color: colors.text }]}>
              {transactionData.chainKey}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionDataContainer: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  transactionDataTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  transactionDetails: {
    gap: spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  transactionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  transactionValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    flex: 2,
    textAlign: 'right',
  },
  transactionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  copyButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
});
