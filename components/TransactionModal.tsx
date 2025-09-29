import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme, spacing, typography, radius } from '../theme';

export type TransactionStatus = 'review' | 'pending' | 'success' | 'error';

export interface TransactionModalProps {
  visible: boolean;
  status: TransactionStatus;
  transactionHash?: string;
  errorMessage?: string;
  chainKey?: string;
  transactionData?: any;
  onApprove?: () => void;
  onClose: () => void;
  onExecuteTransaction?: () => Promise<void>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TransactionModal({
  visible,
  status,
  transactionHash,
  errorMessage,
  chainKey,
  transactionData,
  onApprove,
  onClose,
  onExecuteTransaction,
}: TransactionModalProps) {
  const { colors } = useTheme();

  const handleViewExplorer = async () => {
    if (!transactionHash || !chainKey) return;
    
    try {
      const chainConfig = require('../config/chain').chainConfig;
      const config = chainConfig[chainKey];
      const explorerUrl = `${config.explorerUrl}${transactionHash}`;
      await Linking.openURL(explorerUrl);
    } catch (error) {
      console.error('Failed to open explorer:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'review':
        return <MaterialIcons name="visibility" size={48} color={colors.primary} />;
      case 'pending':
        return <ActivityIndicator size="large" color={colors.primary} />;
      case 'success':
        return <FontAwesome6 name="check-circle" size={48} color={colors.success} />;
      case 'error':
        return <MaterialIcons name="error-outline" size={48} color={colors.error} />;
      default:
        return null;
    }
  };

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

  const getStatusColor = () => {
    switch (status) {
      case 'review':
        return colors.primary;
      case 'pending':
        return colors.primary;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      default:
        return colors.text;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { 
          backgroundColor: colors.backgroundSecondary,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }]}>
          {/* Close button in top-left corner */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                {getStatusIcon()}
              </View>
              
              <Text style={[styles.title, { color: colors.text }]}>
                {getStatusTitle()}
              </Text>
              
              <Text style={[styles.message, { color: colors.text }]}>
                {getStatusMessage()}
              </Text>

              {status === 'review' && transactionData && (
                <View style={[styles.transactionDataContainer, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.transactionDataTitle, { color: colors.text }]}>
                    Transaction Details:
                  </Text>
                  <ScrollView style={styles.transactionDataScroll}>
                    <Text style={[styles.transactionDataText, { color: colors.textSecondary }]}>
                      {JSON.stringify(transactionData, null, 2)}
                    </Text>
                  </ScrollView>
                </View>
              )}

              {status === 'review' && (
                <TouchableOpacity 
                  style={[styles.approveButton, { backgroundColor: colors.success }]}
                  onPress={async () => {
                    console.log('Approve button pressed in modal');
                    console.log('Approving transaction...');
                    
                    if (onExecuteTransaction) {
                      console.log('Executing transaction...');
                      await onExecuteTransaction();
                    } else {
                      console.log('No transaction execution function provided');
                    }
                  }}
                >
                  <Text style={[styles.approveButtonText, { color: colors.textInverse }]}>
                    Approve Transaction
                  </Text>
                </TouchableOpacity>
              )}

              {status === 'success' && transactionHash && (
                <TouchableOpacity 
                  style={[styles.explorerButton, { backgroundColor: colors.primary }]}
                  onPress={handleViewExplorer}
                >
                  <Text style={[styles.explorerButtonText, { color: colors.textInverse }]}>
                    View transaction on explorer
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    borderRadius: radius.xl,
    padding: spacing.xl,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeIcon: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    zIndex: 1,
    padding: spacing.sm,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  explorerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  explorerButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
  transactionDataContainer: {
    width: '100%',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  transactionDataTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  transactionDataScroll: {
    maxHeight: 200,
  },
  transactionDataText: {
    fontSize: typography.sizes.xs,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  approveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.md,
  },
  approveButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
});
