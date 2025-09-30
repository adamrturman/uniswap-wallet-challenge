import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Input from './Input';
import { isValidAddressOrENS } from '../utils/addressValidation';

type AddressInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onValidationChange?: (isValid: boolean) => void;
};

export default function AddressInput({
  value,
  onChangeText,
  onValidationChange,
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
        placeholder="Enter a wallet address or ENS name"
        isValid={isValid}
        errorMessage="Invalid wallet address or ENS name. Please check and try again."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
