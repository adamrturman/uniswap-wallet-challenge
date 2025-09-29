import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Input from './Input';
import { isValidAddressOrENS } from '../utils/addressValidation';

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

  // Check if input is a valid address or ENS name using shared helper
  const isValid = useMemo(() => {
    return isValidAddressOrENS(value);
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
      const provider = new ethers.providers.JsonRpcProvider(chainConfig.Ethereum.rpcUrl);
      return await provider.resolveName(ensName);
    } catch (error) {
      console.log('Failed to resolve ENS name:', error);
      return null;
    }
  };

  const resolveAddress = async (inputValue: string): Promise<string | null> => {
    const { isENSName } = require('../utils/addressValidation');
    if (isENSName(inputValue)) {
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
