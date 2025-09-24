import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { chainConfig, ChainKey } from './chainConfig';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import HeaderIcon, { EyeIcon } from './HeaderIcon';

type EnterWatchAddressProps = {
  onContinue?: (address: string, balances: Record<ChainKey, number>) => void;
};

export default function EnterWatchAddress({ onContinue }: EnterWatchAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [balances, setBalances] = useState<Record<ChainKey, number>>({ ethereum: 0, polygon: 0, optimism: 0, arbitrum: 0, sepolia: 0 });

  const isValid = useMemo(() => ethers.utils.isAddress(address), [address]);
  
  // Determine if we should show an error
  const showError = address.trim().length > 0 && !isValid;


  const handleContinue = async () => {
    if (!isValid) return;

    const trimmedAddress = address.trim();
    setAddress(trimmedAddress);

    try {
      // Fetch native balances across configured chains in parallel
      const entries = (Object.keys(chainConfig) as ChainKey[]).map(async (key) => {
        const { rpcUrl } = chainConfig[key];
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const balanceWei = await provider.getBalance(trimmedAddress);
        const balanceEther = ethers.utils.formatEther(balanceWei);
        return [key, Number(balanceEther)] as const;
      });

      const results = await Promise.all(entries);
      const nextBalances = results.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, { ...balances } as Record<ChainKey, number>);

      setBalances(nextBalances);

      // Log for debugging
      (Object.keys(nextBalances) as ChainKey[]).forEach((key) => {
        const { symbol } = chainConfig[key];
        console.log(`${chainConfig[key].name} native balance (${symbol}):`, nextBalances[key]);
      });

      // Call the continue handler and navigate to portfolio
      onContinue?.(trimmedAddress, nextBalances);
      navigation.navigate('Portfolio');
      
      // Clear the input field for when user comes back
      setAddress('');
    } catch (error) {
      console.log('Failed to fetch native balances:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.content}>
          <Header
            icon={<HeaderIcon icon={EyeIcon} size="large" />}
            text={
              <Text style={[styles.title, { color: colors.text }]}>
                Enter a wallet address
              </Text>
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.background,
                  borderColor: showError 
                    ? colors.error 
                    : isFocused 
                      ? colors.primary 
                      : colors.border,
                  color: colors.text
                }
              ]}
              placeholder="Type or paste wallet address"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              value={address}
              onChangeText={setAddress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType={Platform.select({ ios: 'default', android: 'visible-password' })}
              returnKeyType="done"
            />
          </View>
          
          {/* Error message */}
          {showError && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              Invalid wallet address. Please check and try again.
            </Text>
          )}
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
    </SafeAreaView>
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
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    lineHeight: 32,
  },
  inputContainer: {
    width: '100%',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  footer: {
    marginTop: 'auto',
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
}); 