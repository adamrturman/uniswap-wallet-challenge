import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme, typography, spacing } from '../theme';

type BackButtonProps = {
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
};

export default function BackButton({ onPress, style, disabled = false }: BackButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.backButton, style, disabled && styles.disabled]} 
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <Text style={[styles.backArrow, { color: disabled ? colors.textSecondary : colors.text }]}>←</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: spacing.xxl,
    height: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  backArrow: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
  },
});
