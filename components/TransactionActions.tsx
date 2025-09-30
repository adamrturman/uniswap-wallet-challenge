import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, spacing } from '../theme';
import Button from './Button';
import { TransactionStatus } from './TransactionModal';

type TransactionActionsProps = {
  status: TransactionStatus;
  onApprove?: () => Promise<void>;
  onClose: () => void;
  isExecuting?: boolean;
};

export default function TransactionActions({
  status,
  onApprove,
  onClose,
  isExecuting = false,
}: TransactionActionsProps) {
  const { colors } = useTheme();

  const renderActions = () => {
    switch (status) {
      case 'review':
        return (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginRight,
              ])}
            />
            <Button
              title="Approve Transaction"
              onPress={onApprove || (() => {})}
              variant="primary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginLeft,
              ])}
            />
          </View>
        );
      case 'pending':
        return (
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              style={styles.singleButton}
            />
          </View>
        );
      case 'success':
        return (
          <View style={styles.buttonContainer}>
            <Button
              title="View on Explorer"
              onPress={() => {
                // TODO: Implement explorer navigation
                console.log('Navigate to explorer');
              }}
              variant="secondary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginRight,
              ])}
            />
            <Button
              title="Done"
              onPress={onClose}
              variant="primary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginLeft,
              ])}
            />
          </View>
        );
      case 'error':
        return (
          <View style={styles.buttonContainer}>
            <Button
              title="Try Again"
              onPress={onApprove || (() => {})}
              variant="primary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginRight,
              ])}
              disabled={isExecuting}
            />
            <Button
              title="Close"
              onPress={onClose}
              variant="secondary"
              style={StyleSheet.flatten([
                styles.button,
                styles.buttonMarginLeft,
              ])}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderActions()}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    minWidth: 120,
  },
  singleButton: {
    flex: 1,
    maxWidth: 200,
  },
  buttonMarginRight: {
    marginRight: spacing.sm,
  },
  buttonMarginLeft: {
    marginLeft: spacing.sm,
  },
});
