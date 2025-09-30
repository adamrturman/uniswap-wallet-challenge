import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography, radius } from '../theme';
import { TransactionData } from '../types';
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
              {transactionData.amount} {transactionData.token?.symbol || 'ETH'}
            </Text>
          </View>
        )}
        {transactionData.gasEstimate && (
          <>
            {transactionData.gasEstimate.gasLimit && (
              <View style={styles.transactionRow}>
                <Text
                  style={[
                    styles.transactionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Gas Limit
                </Text>
                <Text style={[styles.transactionValue, { color: colors.text }]}>
                  {transactionData.gasEstimate.gasLimit}
                </Text>
              </View>
            )}
            {transactionData.gasEstimate.gasPrice && (
              <View style={styles.transactionRow}>
                <Text
                  style={[
                    styles.transactionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Gas Price
                </Text>
                <Text style={[styles.transactionValue, { color: colors.text }]}>
                  {transactionData.gasEstimate.gasPrice} Gwei
                </Text>
              </View>
            )}
            {transactionData.gasEstimate.networkFee && (
              <View style={styles.transactionRow}>
                <Text
                  style={[
                    styles.transactionLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Network Fee
                </Text>
                <Text style={[styles.transactionValue, { color: colors.text }]}>
                  {transactionData.gasEstimate.networkFee} ETH
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionDataContainer: {
    width: '100%',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  transactionDataTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  transactionDetails: {
    width: '100%',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  transactionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  transactionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  transactionValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    textAlign: 'right',
    flex: 1,
  },
  copyButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
