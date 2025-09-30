import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme, spacing, radius } from '../theme';
import { TransactionData } from './types';
import TransactionStatusIcon from './TransactionStatusIcon';
import TransactionStatusContent from './TransactionStatusContent';
import TransactionDetails from './TransactionDetails';
import TransactionActions from './TransactionActions';

export type TransactionStatus = 'review' | 'pending' | 'success' | 'error';

export interface TransactionModalProps {
  visible: boolean;
  status: TransactionStatus;
  transactionData?: TransactionData;
  onClose: () => void;
  onExecuteTransaction?: () => Promise<void>;
}

const { height: screenHeight } = Dimensions.get('window');

export default function TransactionModal({
  visible,
  status,
  transactionData,
  onClose,
  onExecuteTransaction,
}: TransactionModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.backgroundSecondary,
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
              elevation: 8,
            },
          ]}
        >
          {/* Close button in top-left corner */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                <TransactionStatusIcon status={status} />
              </View>

              <TransactionStatusContent status={status} />

              {status === 'review' && transactionData && (
                <TransactionDetails
                  transactionData={transactionData}
                  onCopyAddress={(address) => {
                    // TODO: Implement clipboard functionality
                    console.log('Copy address:', address);
                  }}
                />
              )}

              <TransactionActions
                status={status}
                onApprove={onExecuteTransaction}
                onClose={onClose}
              />
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
    padding: spacing.md,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    borderRadius: radius.xl,
    padding: spacing.lg,
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
    marginBottom: spacing.md,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
