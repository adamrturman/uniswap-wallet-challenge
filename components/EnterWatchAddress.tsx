import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ethers } from 'ethers';

export type EnterWatchAddressProps = {
  onBack?: () => void;
  onContinue?: (address: string) => void;
};

const PINK_ENABLED = '#FC72FF';
const PINK_DISABLED = '#FAD6FF';
const BORDER = '#EAEAEA';
const DARK_TEXT = '#0a0a0a';
const PLACEHOLDER = '#9AA0A6';

function isValidEthAddress(candidate: string): boolean {
  if (!candidate) return false;
  const value = candidate.trim();
  // Basic 0x-prefixed 20-byte hex string check (case-insensitive)
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export default function EnterWatchAddress({ onBack, onContinue }: EnterWatchAddressProps) {
  const [address, setAddress] = useState('');

  const isValid = useMemo(() => isValidEthAddress(address), [address]);

  const handleContinue = async () => {
    if (!isValid) return;

    const trimmedAddress = address.trim();
    setAddress(trimmedAddress);

    try {
      const provider = ethers.getDefaultProvider('https://eth.drpc.org');
      const balanceWei = await provider.getBalance(trimmedAddress);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      console.log('Native balance (ETH):', balanceEther);
    } catch (error) {
      console.log('Failed to fetch native balance:', error);
    }

    onContinue?.(trimmedAddress);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityRole="button" accessibilityLabel="Go back">
            {/* Back chevron icon */}
            <Feather name="chevron-left" size={28} color={DARK_TEXT} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.title}>Enter a wallet address</Text>

          <View style={[styles.inputWrapper, { borderColor: BORDER }]}>
            <TextInput
              style={styles.input}
              placeholder="Type or paste wallet address"
              placeholderTextColor={PLACEHOLDER}
              autoCapitalize="none"
              autoCorrect={false}
              value={address}
              onChangeText={setAddress}
              keyboardType={Platform.select({ ios: 'default', android: 'visible-password' })}
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            disabled={!isValid}
            style={[styles.ctaButton, { backgroundColor: isValid ? PINK_ENABLED : PINK_DISABLED }]}
          >
            <Text style={styles.ctaText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#F4F4F4',
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
    color: DARK_TEXT,
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
    color: DARK_TEXT,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  ctaButton: {
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 