import React from 'react';
import { ActivityIndicator } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../theme';
import { TransactionStatus } from './TransactionModal';

type TransactionStatusIconProps = {
  status: TransactionStatus;
};

export default function TransactionStatusIcon({
  status,
}: TransactionStatusIconProps) {
  const { colors } = useTheme();

  switch (status) {
    case 'review':
      return (
        <MaterialIcons name="visibility" size={48} color={colors.primary} />
      );
    case 'pending':
      return <ActivityIndicator size="large" color={colors.primary} />;
    case 'success':
      return (
        <FontAwesome6 name="check-circle" size={48} color={colors.success} />
      );
    case 'error':
      return (
        <MaterialIcons name="error-outline" size={48} color={colors.error} />
      );
    default:
      return null;
  }
}
