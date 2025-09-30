import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import { openExplorer } from '../utils/explorerUtils';
import { ChainKey } from '../config/chain';
import { GasEstimate } from '../utils/transactionUtils';
import Button from './Button';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';

type TransactionConfirmationProps = {
  transactionHash: string;
  amount: string;
  tokenSymbol: string;
  recipientAddress: string;
  fromAddress: string;
  chainKey: ChainKey;
  gasEstimate?: GasEstimate | null;
};

export default function TransactionConfirmation({
  transactionHash,
  amount,
  tokenSymbol,
  recipientAddress,
  fromAddress,
  chainKey,
  gasEstimate,
}: TransactionConfirmationProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [showGradient, setShowGradient] = useState(true);

  const handleViewOnExplorer = async () => {
    await openExplorer(transactionHash, chainKey);
  };

  const handleDone = () => {
    navigation.navigate('Portfolio');
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    setShowGradient(!isAtBottom);
  };

  return (
    <ScreenWrapper>
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Header
            icon="check-circle"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Transaction Successful!
              </Text>
            }
          />

          <View
            style={[
              styles.transactionCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.transactionRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Amount
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {amount} {tokenSymbol}
              </Text>
            </View>

            <View style={styles.transactionRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                From
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {fromAddress.slice(0, 6)}...{fromAddress.slice(-4)}
              </Text>
            </View>

            <View style={styles.transactionRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                To
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
              </Text>
            </View>

            <View style={styles.transactionRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Transaction Hash
              </Text>
              <TouchableOpacity
                onPress={handleViewOnExplorer}
                style={styles.hashContainer}
              >
                <Text style={[styles.hashText, { color: colors.primary }]}>
                  {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                </Text>
                <FontAwesome6
                  name="external-link-alt"
                  size={12}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {gasEstimate && (
              <>
                {gasEstimate.gasLimit && (
                  <View style={styles.transactionRow}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Gas Limit
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                      {gasEstimate.gasLimit}
                    </Text>
                  </View>
                )}

                {gasEstimate.gasPrice && (
                  <View style={styles.transactionRow}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Gas Price
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                      {gasEstimate.gasPrice} Gwei
                    </Text>
                  </View>
                )}

                {gasEstimate.maxFeePerGas && (
                  <View style={styles.transactionRow}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Max Fee Per Gas
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                      {gasEstimate.maxFeePerGas} Gwei
                    </Text>
                  </View>
                )}

                {gasEstimate.maxPriorityFeePerGas && (
                  <View style={styles.transactionRow}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Max Priority Fee
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                      {gasEstimate.maxPriorityFeePerGas} Gwei
                    </Text>
                  </View>
                )}

                {gasEstimate.networkFee && (
                  <View style={styles.transactionRow}>
                    <Text
                      style={[styles.label, { color: colors.textSecondary }]}
                    >
                      Network Fee
                    </Text>
                    <Text style={[styles.value, { color: colors.text }]}>
                      {gasEstimate.networkFee} ETH
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.successMessage}>
            <FontAwesome6
              name="check-circle"
              size={48}
              color={colors.success}
            />
            <Text style={[styles.successText, { color: colors.text }]}>
              Your transaction has been successfully submitted to the
              blockchain.
            </Text>
          </View>
        </ScrollView>
        {showGradient && (
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.bottomGradient}
            pointerEvents="none"
          />
        )}
      </View>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xl * 2,
            paddingTop: spacing.xl,
          },
        ]}
      >
        <Button title="Done" onPress={handleDone} variant="primary" fullWidth />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
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
