import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme, typography, spacing } from '../theme';

type BackButtonProps = {
  onPress?: () => void;
  style?: any;
};

export default function BackButton({ onPress, style }: BackButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.backArrow, { color: colors.text }]}>←</Text>
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
  backArrow: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
  },
});
