import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ethers } from 'ethers';
import Input from './Input';

type AddressInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  errorMessage?: string;
  onValidationChange?: (isValid: boolean) => void;
};

export default function AddressInput({ 
  value, 
  onChangeText, 
  placeholder = "Enter a wallet address or ENS name",
  errorMessage = "Invalid wallet address or ENS name. Please check and try again.",
  onValidationChange
}: AddressInputProps) {

  // Enhanced ENS name validation using ethers.js
  const isValidENSName = (name: string): boolean => {
    if (!name.includes('.eth')) return false;
    if (name.startsWith('0x')) return false;
    
    try {
      // Use ethers.js to validate name format, but ensure it ends with .eth
      // and is not a valid address, and doesn't start with 0x
      return ethers.utils.isValidName(name) && 
             name.endsWith('.eth') && 
             !ethers.utils.isAddress(name) &&
             !name.toLowerCase().startsWith('0x');
    } catch (error) {
      return false;
    }
  };

  // Check if input is a valid address or ENS name
  const isValid = useMemo(() => {
    if (!value.trim()) return false;
    
    // If it's a valid address, return true
    if (ethers.utils.isAddress(value)) return true;
    
    // If it's a valid ENS name format
    if (isValidENSName(value)) {
      return true;
    }
    
    return false;
  }, [value]);

  // Notify parent component of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        isValid={isValid}
        errorMessage={errorMessage}
      />
    </View>
  );
}

// Export the resolution function for use in parent components
export const useAddressResolution = () => {
  const resolveENS = async (ensName: string): Promise<string | null> => {
    try {
      const { ethers } = require('ethers');
      const { chainConfig } = require('../config/chain');
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
});
