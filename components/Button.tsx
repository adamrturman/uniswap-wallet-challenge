import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useTheme, spacing, typography, radius } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  fullWidth?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  activeOpacity = 0.85,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: fullWidth ? '100%' : 'auto',
      minWidth: fullWidth ? '100%' : 200,
      height: 56,
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
      elevation: 2,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.primaryDisabled : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.backgroundSecondary,
        };
      case 'disabled':
        return {
          ...baseStyle,
          backgroundColor: colors.primaryDisabled,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.semibold,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: colors.textInverse,
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.inputText,
        };
      case 'disabled':
        return {
          ...baseTextStyle,
          color: colors.textInverse,
        };
      default:
        return baseTextStyle;
    }
  };

  const isDisabled = disabled || variant === 'disabled';

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
