import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import Header from './Header';
import ScreenWrapper from './ScreenWrapper';
import AddressInput from './AddressInput';
import AddressHistory from './AddressHistory';
import { resolveAddress } from '../utils/addressUtils';
import {
  AllTokenBalances,
  createInitialAllTokenBalances,
} from '../utils/balanceUtils';
import { useAddressHistory } from '../hooks/useAddressHistory';

type EnterWatchAddressProps = {
  onContinue?: (address: string, balances: AllTokenBalances) => void;
};

export default function EnterWatchAddress({
  onContinue,
}: EnterWatchAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const { saveAddressToHistory } = useAddressHistory();
  const [address, setAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsValidAddress(isValid);
  };

  const handleContinue = async () => {
    if (!address.trim() || !isValidAddress) return;

    const trimmedInput = address.trim();
    setAddress(trimmedInput);

    try {
      // Resolve address (handles ENS names)
      const finalAddress = await resolveAddress(trimmedInput);
      if (!finalAddress) {
        return;
      }

      // Save the original input (ENS name or address) to history
      await saveAddressToHistory(trimmedInput);

      // Set initial loading state and navigate immediately
      const initialBalances = createInitialAllTokenBalances();
      onContinue?.(finalAddress, initialBalances);
      navigation.navigate('Portfolio');

      // Clear the input field for when user comes back
      setAddress('');
    } catch (error) {
      console.error('Failed to resolve address:', error);
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const copyAddressToClipboard = async (address: string) => {
    try {
      await Clipboard.setStringAsync(address);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <Header
            icon="person"
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter a wallet address
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <AddressInput
              value={address}
              onChangeText={handleAddressChange}
              onValidationChange={handleValidationChange}
            />

            <AddressHistory
              onAddressSelect={handleAddressSelect}
              onCopyAddress={copyAddressToClipboard}
            />
          </View>
        </View>

        <View
          style={[
            styles.footer,
            {
              paddingHorizontal: spacing.xl,
              paddingBottom: spacing.xl * 2,
              paddingTop: spacing.xl,
            },
          ]}
        >
          <Button
            title="Continue"
            onPress={handleContinue}
            variant={isValidAddress ? 'primary' : 'disabled'}
            disabled={!isValidAddress}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
