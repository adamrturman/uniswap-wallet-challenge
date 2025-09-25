import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { chainConfig, ChainKey } from './chainConfig';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import Input from './Input';

type EnterWatchAddressProps = {
  onContinue?: (address: string, balances: Record<ChainKey, number>) => void;
};

export default function EnterWatchAddress({ onContinue }: EnterWatchAddressProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState<Record<ChainKey, number>>({ ethereum: 0, polygon: 0, optimism: 0, arbitrum: 0, sepolia: 0 });

  const isValid = useMemo(() => ethers.utils.isAddress(address), [address]);


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
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

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
            <Input
              value={address}
              onChangeText={setAddress}
              placeholder="Type or paste wallet address"
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