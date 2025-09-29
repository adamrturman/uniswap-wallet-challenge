import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { useTheme, spacing, typography, radius } from '../theme';

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isValid: boolean;
  errorMessage: string;
  multiline?: boolean;
  minHeight?: number;
  maxHeight?: number;
  keyboardType?: 'default' | 'visible-password';
  returnKeyType?: 'done' | 'next';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  textAlignVertical?: 'top' | 'center' | 'bottom';
};

export default function Input({
  value,
  onChangeText,
  placeholder,
  isValid,
  errorMessage,
  multiline = false,
  minHeight,
  maxHeight,
  keyboardType = Platform.select({ ios: 'default', android: 'visible-password' }),
  returnKeyType = 'done',
  autoCapitalize = 'none',
  autoCorrect = false,
  textAlignVertical = 'center',
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const showError = value.trim().length > 0 && !isValid;

  const containerStyle = [
    styles.container,
    {
      borderColor: showError 
        ? colors.error 
        : isFocused 
          ? colors.primary 
          : colors.border,
    }
  ];

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.background,
      color: colors.text,
      ...(multiline && {
        minHeight: minHeight || 120,
        maxHeight: maxHeight || 200,
        flex: 1,
      }),
    }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={containerStyle}>
        <TextInput
          style={[inputStyle, {
            borderWidth: 0,
            borderColor: 'transparent'
          }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
        />
      </View>
       {/* This space is intentionally left blank to preserve layout white space */}
      <Text style={[styles.errorText, { 
        color: showError ? colors.error : 'transparent',
        minHeight: showError ? undefined : typography.sizes.sm + spacing.xs
      }]}>
        {showError ? errorMessage : ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    width: '100%',
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  input: {
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: typography.sizes.base,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
  },
});