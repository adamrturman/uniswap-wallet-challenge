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
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme, spacing, typography, radius } from '../theme';

export type TransactionStatus = 'pending' | 'success' | 'error';

export interface TransactionModalProps {
  visible: boolean;
  status: TransactionStatus;
  transactionHash?: string;
  errorMessage?: string;
  chainKey?: string;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TransactionModal({
  visible,
  status,
  transactionHash,
  errorMessage,
  chainKey,
  onClose,
}: TransactionModalProps) {
  const { colors } = useTheme();

  const handleViewExplorer = async () => {
    if (!transactionHash || !chainKey) return;
    
    try {
      const chainConfig = require('./chainConfig').chainConfig;
      const config = chainConfig[chainKey];
      const explorerUrl = `${config.explorerUrl}${transactionHash}`;
      await Linking.openURL(explorerUrl);
    } catch (error) {
      console.error('Failed to open explorer:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <ActivityIndicator size="large" color={colors.primary} />;
      case 'success':
        return <FontAwesome6 name="check-circle" size={48} color={colors.success} />;
      case 'error':
        return <FontAwesome6 name="exclamation-triangle" size={48} color={colors.error} />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
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
      case 'pending':
        return 'Your transaction is being processed. Please wait...';
      case 'success':
        return 'Your transaction has been successfully submitted to the blockchain.';
      case 'error':
        return errorMessage || 'An error occurred while processing your transaction.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
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
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          {/* Close button in top-left corner */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              {getStatusIcon()}
            </View>
            
            <Text style={[styles.title, { color: getStatusColor() }]}>
              {getStatusTitle()}
            </Text>
            
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {getStatusMessage()}
            </Text>

            {status === 'success' && transactionHash && (
              <TouchableOpacity 
                style={[styles.explorerButton, { backgroundColor: colors.primary }]}
                onPress={handleViewExplorer}
              >
                <Text style={[styles.explorerButtonText, { color: colors.background }]}>
                  View transaction on explorer
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
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
});
