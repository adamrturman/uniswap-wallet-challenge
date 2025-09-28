import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ethers } from 'ethers';
import { useTheme, spacing, typography } from '../theme';
import { chainConfig } from '../config/chain';
import Input from './Input';

type AddressInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  errorMessage?: string;
};

export default function AddressInput({ 
  value, 
  onChangeText, 
  placeholder = "Enter a wallet address or ENS name",
  errorMessage = "Invalid wallet address or ENS name. Please check and try again."
}: AddressInputProps) {
  const { colors } = useTheme();
  const [isResolvingENS, setIsResolvingENS] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

  // Check if input is a valid address or ENS name
  const isValid = useMemo(() => {
    if (!value.trim()) return false;
    
    // If it's a valid address, return true
    if (ethers.utils.isAddress(value)) return true;
    
    // If it's a valid ENS name (contains .eth and doesn't start with 0x)
    if (value.includes('.eth') && !value.startsWith('0x')) {
      return true;
    }
    
    return false;
  }, [value]);

  // Check if the current input is an ENS name
  const isENSName = useMemo(() => {
    return value.includes('.eth') && !value.startsWith('0x') && !ethers.utils.isAddress(value);
  }, [value]);

  // Resolve ENS name to address
  const resolveENS = async (ensName: string): Promise<string | null> => {
    try {
      setIsResolvingENS(true);
      const provider = new ethers.providers.JsonRpcProvider(chainConfig.ethereum.rpcUrl);
      const resolvedAddress = await provider.resolveName(ensName);
      setResolvedAddress(resolvedAddress);
      return resolvedAddress;
    } catch (error) {
      console.log('Failed to resolve ENS name:', error);
      setResolvedAddress(null);
      return null;
    } finally {
      setIsResolvingENS(false);
    }
  };

  // Expose resolution function for parent components
  const resolveAddress = async (inputValue: string): Promise<string | null> => {
    if (inputValue.includes('.eth') && !inputValue.startsWith('0x')) {
      return await resolveENS(inputValue);
    }
    return inputValue;
  };

  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        isValid={isValid}
        errorMessage={errorMessage}
      />
      
      {/* ENS Resolution Status */}
      {isResolvingENS && (
        <View style={styles.ensStatus}>
          <Text style={[styles.ensStatusText, { color: colors.textSecondary }]}>
            Resolving ENS name...
          </Text>
        </View>
      )}
      
      {resolvedAddress && (
        <View style={styles.ensStatus}>
          <Text style={[styles.ensStatusText, { color: colors.success }]}>
            Resolved to: {resolvedAddress}
          </Text>
        </View>
      )}
    </View>
  );
}

// Export the resolution function for use in parent components
export const useAddressResolution = () => {
  const resolveENS = async (ensName: string): Promise<string | null> => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(chainConfig.ethereum.rpcUrl);
      return await provider.resolveName(ensName);
    } catch (error) {
      console.log('Failed to resolve ENS name:', error);
      return null;
    }
  };

  const resolveAddress = async (inputValue: string): Promise<string | null> => {
    if (inputValue.includes('.eth') && !inputValue.startsWith('0x')) {
      return await resolveENS(inputValue);
    }
    return inputValue;
  };

  return { resolveAddress };
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  ensStatus: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  ensStatusText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});
