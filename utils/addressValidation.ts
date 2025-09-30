import { ethers } from 'ethers';

/**
 * ENS name validation using ethers.js
 */
export const isValidENSName = (name: string): boolean => {
  if (!name.includes('.eth') || name.startsWith('0x')) return false;

  try {
    return ethers.utils.isValidName(name);
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

