import { ethers } from 'ethers';

/**
 * ENS name validation using ethers.js
 */
export const isValidENSName = (name: string): boolean => {
  const trimmedName = name.trim();

  // Must end with .eth and not start with 0x
  if (!trimmedName.endsWith('.eth') || trimmedName.startsWith('0x'))
    return false;

  try {
    return ethers.utils.isValidName(trimmedName);
  } catch (error) {
    return false;
  }
};

/**
 * Validates if input is a valid Ethereum address or ENS name
 */
export const isValidAddressOrENS = (value: string): boolean => {
  //  Don't bother checking if the value is empty
  if (!value.trim()) return false;
  return ethers.utils.isAddress(value) || isValidENSName(value);
};
