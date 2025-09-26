import React, { useMemo, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, ethers } from 'ethers';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import { useTransaction } from '../context/TransactionContext';
import Button from './Button';
import BackButton from './BackButton';
import EthIcon from './EthIcon';
import Header from './Header';
import LogoutButton from './LogoutButton';
import { ChainKey, chainConfig } from './chainConfig';

type EnterAmountToSendProps = {
  selectedToken: {
    chainKey: ChainKey;
    balance: number;
    symbol: string;
  };
  onContinue?: (amount: string) => void;
  onTransactionExecute?: (amount: string) => Promise<{ success: boolean; hash?: string; error?: string }>;
  wallet?: Wallet | null;
  recipientAddress?: string;
  onLogout?: () => void;
};

export default function EnterAmountToSend({ 
  selectedToken, 
  onContinue, 
  onTransactionExecute, 
  wallet, 
  recipientAddress,
  onLogout
}: EnterAmountToSendProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const { showTransactionModal, updateTransactionStatus } = useTransaction();
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const [networkFee, setNetworkFee] = useState<string | null>(null);

  const isValidAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || isNaN(numAmount)) return false;
    
    // If we don't have gas fee data, use simple balance check
    if (!networkFee) {
      return numAmount <= selectedToken.balance;
    }
    
    // Check if amount + gas fees exceeds balance
    const totalCost = numAmount + parseFloat(networkFee);
    return totalCost <= selectedToken.balance;
  }, [amount, selectedToken.balance, networkFee]);

  const showError = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (amount.trim().length === 0 || numAmount <= 0 || isNaN(numAmount)) return false;
    
    // Show error if amount exceeds balance
    if (!networkFee) {
      return numAmount > selectedToken.balance;
    }
    
    // Check if amount + gas fees exceeds balance
    const totalCost = numAmount + parseFloat(networkFee);
    return totalCost > selectedToken.balance;
  }, [amount, selectedToken.balance, networkFee]);

  const shouldShowTransactionDetails = useMemo(() => {
    const numAmount = parseFloat(amount);
    return recipientAddress && amount && numAmount > 0 && !isNaN(numAmount);
  }, [recipientAddress, amount]);

  // Gas estimation function
  const estimateGas = async () => {
    if (!wallet || !recipientAddress || !amount || parseFloat(amount) <= 0) {
      setGasEstimate(null);
      setGasPrice(null);
      setNetworkFee(null);
      return;
    }

    try {
      const chain = chainConfig[selectedToken.chainKey];
      const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
      
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Get fee data
      const feeData = await provider.getFeeData();
      
      // Estimate gas for the transaction
      const gasEstimate = await provider.estimateGas({
        to: recipientAddress,
        value: amountInWei,
        from: wallet.address,
      });
      
      setGasEstimate(gasEstimate.toString());
      setGasPrice(feeData.gasPrice ? ethers.utils.formatUnits(feeData.gasPrice, 'gwei') : null);
      
      // Calculate network fee in ETH
      if (feeData.gasPrice) {
        const totalFee = gasEstimate.mul(feeData.gasPrice);
        const networkFeeInEth = ethers.utils.formatEther(totalFee);
        setNetworkFee(networkFeeInEth);
      } else {
        setNetworkFee(null);
      }
    } catch (error) {
      console.error('Gas estimation failed:', error);
      setGasEstimate(null);
      setGasPrice(null);
      setNetworkFee(null);
    }
  };

  // Estimate gas when amount or recipient changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      estimateGas();
    }, 500); // Debounce the estimation

    return () => clearTimeout(timeoutId);
  }, [amount, recipientAddress, selectedToken.chainKey, wallet]);

  const handleContinue = async () => {
    if (!isValidAmount || isExecuting) return;

    // Check if we have a wallet to execute transaction
    if (wallet && onTransactionExecute) {
      setIsExecuting(true);
      
      // Show transaction in progress modal
      showTransactionModal({ status: 'pending', chainKey: selectedToken.chainKey });

      try {
        const result = await onTransactionExecute(amount);
        
        if (result.success && result.hash) {
          // Update modal to show success
          updateTransactionStatus({ status: 'success', hash: result.hash, chainKey: selectedToken.chainKey });
          
          // Set the transaction amount before navigating
          onContinue?.(amount);
          
          // Navigate to portfolio to show updated balances
          navigation.navigate('Portfolio');
        } else {
          // Update modal to show error
          updateTransactionStatus({ status: 'error', error: result.error, chainKey: selectedToken.chainKey });
        }
      } catch (error) {
        // Update modal to show error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateTransactionStatus({ status: 'error', error: errorMessage, chainKey: selectedToken.chainKey });
      } finally {
        setIsExecuting(false);
      }
    } else {
      // Fallback to original behavior for watch-only mode
      onContinue?.(amount);
    }
  };

  const handleMaxAmount = async () => {
    if (!wallet || !recipientAddress) {
      // If no wallet or recipient, just use the full balance
      setAmount(selectedToken.balance.toString());
      return;
    }

    try {
      const chain = chainConfig[selectedToken.chainKey];
      const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
      const connectedWallet = wallet.connect(provider);
      
      // Get fee data
      const feeData = await provider.getFeeData();
      
      if (!feeData.gasPrice) {
        // If we can't get gas price, use the full balance
        setAmount(selectedToken.balance.toString());
        return;
      }

      // Estimate gas for a transaction with the full balance
      const fullBalanceInWei = ethers.utils.parseEther(selectedToken.balance.toString());
      const gasEstimate = await provider.estimateGas({
        to: recipientAddress,
        value: fullBalanceInWei,
        from: wallet.address,
      });
      
      // Calculate total gas cost
      const totalGasCost = gasEstimate.mul(feeData.gasPrice);
      const gasCostInEth = parseFloat(ethers.utils.formatEther(totalGasCost));
      
      // Calculate max amount by subtracting gas cost from balance
      const maxAmount = Math.max(0, selectedToken.balance - gasCostInEth);
      
      // Set the amount to the calculated max (with some buffer for safety)
      const safeMaxAmount = Math.max(0, maxAmount - 0.0001); // Small buffer to ensure transaction succeeds
      setAmount(safeMaxAmount.toFixed(8));
      
    } catch (error) {
      console.error('Error calculating max amount with gas:', error);
      // Fallback to full balance if gas calculation fails
      setAmount(selectedToken.balance.toString());
    }
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
          {wallet && onLogout && (
            <LogoutButton onPress={onLogout} />
          )}
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
                  {selectedToken.balance.toFixed(8)} {selectedToken.symbol}
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
              Total cost exceeds your balance of {selectedToken.balance.toFixed(8)} {selectedToken.symbol}
            </Text>
          )}

          {/* Transaction Details Section */}
          {shouldShowTransactionDetails && (
            <View style={[styles.transactionDetails, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>To</Text>
                <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                  {recipientAddress?.slice(0, 6)}...{recipientAddress?.slice(-4)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {parseFloat(amount).toFixed(8)} {selectedToken.symbol}
                </Text>
              </View>
              
              {networkFee && gasEstimate && gasPrice && isValidAmount && (
                <>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Network Fee</Text>
                    <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                      {parseFloat(networkFee).toFixed(8)} ETH ({chainConfig[selectedToken.chainKey].name})
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Gas</Text>
                    <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                      {parseInt(gasEstimate).toLocaleString()} × {parseFloat(gasPrice).toFixed(2)} gwei
                    </Text>
                  </View>
                  
                  <View style={[styles.detailRow, styles.totalRow]}>
                    <Text style={[styles.detailLabel, styles.totalLabel, { color: colors.text }]}>Total</Text>
                    <Text style={[styles.detailValue, styles.totalValue, { color: colors.text }]}>
                      {(parseFloat(amount) + parseFloat(networkFee)).toFixed(8)} {selectedToken.symbol}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        <View style={[styles.footer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title={isExecuting ? "Sending..." : "Send"}
            onPress={handleContinue}
            variant={isValidAmount && !isExecuting ? 'primary' : 'disabled'}
            disabled={!isValidAmount || isExecuting}
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
  transactionDetails: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  totalValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  footer: {
    marginTop: 'auto',
  },
});
