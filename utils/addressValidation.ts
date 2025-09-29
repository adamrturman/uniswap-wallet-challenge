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
  if (!value.trim()) return false;
  
  // If it's a valid address, return true
  if (ethers.utils.isAddress(value)) return true;
  
  // If it's a valid ENS name format
  if (isValidENSName(value)) {
    return true;
  }
  
  return false;
};

/**
 * Checks if the input is specifically an ENS name
 */
export const isENSName = (value: string): boolean => {
  return isValidENSName(value) && !ethers.utils.isAddress(value);
};
