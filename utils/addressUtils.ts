/**
 * Utility functions for address formatting and manipulation
 */

import { ethers } from 'ethers';
import { chainConfig } from '../config/chain';
import { isValidENSName } from './addressValidation';

/**
 * Truncates a wallet address with customizable parameters
 * Only truncates 0x addresses, leaves ENS names intact
 * @param address - The wallet address to truncate
 * @param prefixLength - Number of characters to show at the beginning (default: 6)
 * @param suffixLength - Number of characters to show at the end (default: 4)
 * @returns Truncated address string or full ENS name
 */
export function truncateAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4,
): string {
  const trimmedAddress = address.trim();

  // If it's not a 0x address (i.e., it's an ENS name), return it as-is
  if (!ethers.utils.isAddress(trimmedAddress)) {
    return trimmedAddress;
  }

  // Only truncate 0x addresses
  return `${trimmedAddress.slice(0, prefixLength)}...${trimmedAddress.slice(-suffixLength)}`;
}

/**
 * Resolves an address input (either direct address or ENS name) to a final address
 * @param inputValue - The input value (address or ENS name)
 * @returns Resolved address or null if resolution fails
 */
export const resolveAddress = async (
  inputValue: string,
): Promise<string | null> => {
  const resolveENS = async (ensName: string): Promise<string | null> => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        chainConfig.Ethereum.rpcUrl,
      );
      return await provider.resolveName(ensName);
    } catch (error) {
      return null;
    }
  };

  if (isValidENSName(inputValue) && !ethers.utils.isAddress(inputValue)) {
    return await resolveENS(inputValue);
  }
  return inputValue;
};
