import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, ethers } from 'ethers';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import { useTransaction } from '../context/TransactionContext';
import { usePrice } from '../context/PriceContext';
import { formatTokenAmount } from '../utils/priceUtils';
import Button from './Button';
import EthIcon from './EthIcon';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';
import TokenSelectionModal from './TokenSelectionModal';
import { ChainKey, TokenKey, chainConfig } from '../config/chain';
import { GasEstimate } from '../utils/transactionUtils';
import { AllTokenBalances } from '../utils/balanceUtils';

type EnterAmountToSendProps = {
  selectedToken: {
    chainKey: ChainKey;
    tokenKey: string;
    balance: number;
    symbol: string;
  };
  onContinue?: (amount: string) => void;
  onTransactionExecute?: (amount: string, gasEstimate?: GasEstimate) => Promise<{ success: boolean; hash?: string; error?: string }>;
  wallet?: Wallet | null;
  recipientAddress?: string;
  onLogout?: () => void;
  balances?: AllTokenBalances | null;
  address?: string;
  onTokenSelect?: (chainKey: ChainKey, tokenKey: TokenKey, balance: number, symbol: string) => void;
  onRefreshBalances?: () => Promise<void>;
};

export default function EnterAmountToSend({ 
  selectedToken, 
  onContinue, 
  onTransactionExecute, 
  wallet, 
  recipientAddress,
  onLogout,
  balances,
  address,
  onTokenSelect,
  onRefreshBalances
}: EnterAmountToSendProps) {
  const { colors, themeMode } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const { showTransactionModal, updateTransactionStatus, hideTransactionModal, setApproveTransaction } = useTransaction();
  const { getTokenUsdValueFormatted, priceState } = usePrice();
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isTokenModalVisible, setIsTokenModalVisible] = useState(false);

  const isValidAmount = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (numAmount <= 0 || isNaN(numAmount)) return false;
    
    return numAmount <= selectedToken.balance;
  }, [amount, selectedToken.balance]);

  const showError = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (amount.trim().length === 0 || numAmount <= 0 || isNaN(numAmount)) return false;
    
    return numAmount > selectedToken.balance;
  }, [amount, selectedToken.balance]);

  // Calculate USD value of the entered amount
  const usdValue = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!amount.trim() || numAmount <= 0 || isNaN(numAmount)) return null;
    
    return getTokenUsdValueFormatted(selectedToken.symbol, numAmount);
  }, [amount, selectedToken.symbol, getTokenUsdValueFormatted]);


  const handleApproveTransaction = async (gasEstimate?: GasEstimate) => {
    setIsExecuting(true);
    
    // Close the review modal
    hideTransactionModal();
    
    // Wait a moment for the modal to close
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Open new transaction modal with pending status
    showTransactionModal({ 
      status: 'pending', 
      chainKey: selectedToken.chainKey
    });

    // Add a small delay to ensure the spinner is visible
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (!onTransactionExecute) {
        throw new Error('Transaction execution function not available');
      }
      
      const result = await onTransactionExecute(amount, gasEstimate);
      
      if (result.success && result.hash) {
        // Update modal to show success
        updateTransactionStatus({ 
          status: 'success', 
          hash: result.hash, 
          chainKey: selectedToken.chainKey
        });
        
        // Set the transaction amount before navigating
        onContinue?.(amount);
        
        // Refresh balances before navigating to portfolio
        if (onRefreshBalances) {
          await onRefreshBalances();
        }
        
        // Navigate to portfolio to show updated balances
        navigation.navigate('Portfolio');
      } else {
        // Update modal to show error
        updateTransactionStatus({ 
          status: 'error', 
          error: result.error, 
          chainKey: selectedToken.chainKey
        });
      }
    } catch (error) {
      // Update modal to show error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateTransactionStatus({ 
        status: 'error', 
        error: errorMessage, 
        chainKey: selectedToken.chainKey
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleContinue = async () => {
    if (!isValidAmount || isExecuting) return;

    // Check if we have a wallet to execute transaction
    if (wallet && onTransactionExecute) {
      // Calculate gas estimate now when user clicks Send
      let gasEstimate: GasEstimate | undefined;
      if (wallet && recipientAddress) {
        try {
          const chain = chainConfig[selectedToken.chainKey];
          const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
          
          if (selectedToken.tokenKey === 'native') {
            const { estimateGasForTransaction } = await import('../utils/transactionUtils');
            gasEstimate = await estimateGasForTransaction(
              provider,
              wallet.address,
              recipientAddress,
              amount
            );
          } else {
            const { estimateGasForERC20Transfer } = await import('../utils/transactionUtils');
            const tokenConfig = require('../config/chain').tokenConfig;
            const token = tokenConfig[selectedToken.chainKey][selectedToken.tokenKey];
            
            if (token) {
              gasEstimate = await estimateGasForERC20Transfer(
                provider,
                token.contractAddress,
                wallet.address,
                recipientAddress,
                amount,
                token.decimals
              );
            }
          }
        } catch (gasError) {
          console.error('Gas estimation failed:', gasError);
          // Continue without gas estimate - the transaction execution will handle it
        }
      }

      // Create transaction data object for review
      const transactionData = {
        from: wallet.address,
        to: recipientAddress,
        amount: amount,
        token: {
          symbol: selectedToken.symbol,
          chainKey: selectedToken.chainKey,
        },
        gasEstimate: gasEstimate,
        timestamp: new Date().toISOString(),
      };

      // Set the approve transaction function - this should only be called when user clicks approve
      setApproveTransaction(() => handleApproveTransaction(gasEstimate));
      
      // Show review modal - this should NOT execute the transaction automatically
      showTransactionModal({ 
        status: 'review', 
        chainKey: selectedToken.chainKey,
        transactionData: transactionData
      });
    } else {
      // Fallback to original behavior for watch-only mode
      onContinue?.(amount);
    }
  };

  const handleMaxAmount = () => {
    // Simply use the full balance without gas calculation
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

  const handleTokenSelect = (chainKey: ChainKey, tokenKey: TokenKey, balance: number, symbol: string) => {
    onTokenSelect?.(chainKey, tokenKey, balance, symbol);
  };

  return (
    <ScreenWrapper 
      showLogoutButton={!!(wallet && onLogout)}
      onLogout={onLogout}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

        <View style={styles.content}>
          <Header
            icon="coins"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter amount to send
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <View style={[styles.amountInputContainer, { 
          backgroundColor: colors.background,
          borderColor: showError 
            ? colors.error 
            : isFocused 
              ? colors.primary 
              : colors.border 
        }]}>
              
              <TextInput
                style={[styles.amountInput, { 
                  color: colors.inputText,
                  borderWidth: 0,
                  borderColor: 'transparent'
                }]}
                value={amount}
                onChangeText={handleAmountChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="0"
                placeholderTextColor={colors.placeholderText}
                keyboardType="numeric"
                autoFocus
              />
              
              {/* Token selector positioned inside input */}
              <TouchableOpacity 
                style={[styles.tokenSelector, { 
                  backgroundColor: colors.tokenSelectorBackground, 
                  borderColor: colors.border, 
                  borderWidth: 1,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }]}
                onPress={() => setIsTokenModalVisible(true)}
                activeOpacity={0.7}
              >
                <EthIcon size="small" />
                <Text style={[styles.tokenSymbol, { color: colors.inputText }]}>
                  {selectedToken.symbol}
                </Text>
              </TouchableOpacity>
              
              {/* Balance and Max button positioned inside input */}
              <View style={styles.balanceRow}>
                {/* Left side: Show USD value only when amount is entered */}
                <View style={styles.leftSection}>
                  {amount.trim() && (
                    <Text style={[styles.usdValueText, { color: colors.textSecondary }]}>
                      {priceState.isLoading ? (
                        'Loading...'
                      ) : priceState.error ? (
                        'Price unavailable'
                      ) : usdValue ? (
                        usdValue
                      ) : (
                        'Price unavailable'
                      )}
                    </Text>
                  )}
                </View>
                
                {/* Right side: Balance helper and Max button */}
                <View style={styles.balanceMaxSection}>
                  <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
                    {formatTokenAmount(selectedToken.balance)} {selectedToken.symbol}
                  </Text>
                  <TouchableOpacity
                    style={[styles.maxButton, { 
                      backgroundColor: themeMode === 'dark' ? colors.background : colors.primaryLight,
                      borderColor: colors.border,
                      borderWidth: 1
                    }]}
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
          </View>
          
          {showError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              Amount exceeds your balance of {formatTokenAmount(selectedToken.balance)} {selectedToken.symbol}
            </Text>
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
      
      {/* Token Selection Modal */}
      {balances && (
        <TokenSelectionModal
          visible={isTokenModalVisible}
          onClose={() => setIsTokenModalVisible(false)}
          onTokenSelect={handleTokenSelect}
          balances={balances}
          currentToken={{
            chainKey: selectedToken.chainKey,
            tokenKey: selectedToken.tokenKey as any
          }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginTop: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
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
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  balanceLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  balanceMaxSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  balanceText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
  },
  maxButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
  },
  maxButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  usdValueText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
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
