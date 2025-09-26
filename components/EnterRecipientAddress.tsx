import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers, Wallet } from 'ethers';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import Input from './Input';
import LogoutButton from './LogoutButton';

type EnterRecipientAddressProps = {
  onContinue?: (address: string) => void;
  onLogout?: () => void;
  wallet?: Wallet | null;
};

export default function EnterRecipientAddress({ onContinue, onLogout, wallet }: EnterRecipientAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [address, setAddress] = useState('');

  const isValid = useMemo(() => ethers.utils.isAddress(address), [address]);

  const handleContinue = () => {
    if (!isValid) return;

    const trimmedAddress = address.trim();
    setAddress(trimmedAddress);

    // Call the continue handler
    onContinue?.(trimmedAddress);
    
    // Navigate to SelectToken screen
    navigation.navigate('SelectToken');
    
    // Clear the input field for when user comes back
    setAddress('');
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          {wallet && onLogout && (
            <LogoutButton onPress={onLogout} />
          )}
        </View>

        <View style={styles.content}>
          <Header
            icon="send"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter recipient address
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <Input
              value={address}
              onChangeText={setAddress}
              placeholder="Type or paste recipient address"
              isValid={isValid}
              errorMessage="Invalid wallet address. Please check and try again."
            />
          </View>
        </View>

        <View style={[styles.footer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Continue"
            onPress={handleContinue}
            variant={isValid ? 'primary' : 'disabled'}
            disabled={!isValid}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginTop: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: typography.lineHeights.xl,
  },
  inputContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
  },
});
