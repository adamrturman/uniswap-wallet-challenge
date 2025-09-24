import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ethers } from 'ethers';
import { chainConfig, ChainKey } from './chainConfig';
import { useTheme, spacing } from '../theme';
import Button from './Button';
import BackButton from './BackButton';

export type EnterWatchAddressProps = {
  onBack?: () => void;
  onContinue?: (address: string, balances: Record<ChainKey, number>) => void;
};


export default function EnterWatchAddress({ onBack, onContinue }: EnterWatchAddressProps) {
  const { colors } = useTheme();
  const [address, setAddress] = useState('');
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

      onContinue?.(trimmedAddress, nextBalances);
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
          <BackButton onPress={onBack} />
        </View>

        <View style={styles.content}>
          <View style={[styles.avatar, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Enter a wallet address</Text>

          <View style={[styles.inputWrapper, { borderColor: showError ? colors.error : colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Type or paste wallet address"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              value={address}
              onChangeText={setAddress}
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
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignSelf: 'stretch',
    marginTop: 16,
  },
  input: {
    fontSize: 16,
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