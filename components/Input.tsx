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

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.background,
      borderColor: showError 
        ? colors.error 
        : isFocused 
          ? colors.primary 
          : colors.border,
      color: colors.text,
      ...(multiline && {
        minHeight: minHeight || 120,
        maxHeight: maxHeight || 200,
        flex: 1,
      }),
    }
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
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
      
      {showError && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
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