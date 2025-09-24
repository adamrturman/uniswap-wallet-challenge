import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme, typography } from '../theme';

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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.semibold,
  },
});
