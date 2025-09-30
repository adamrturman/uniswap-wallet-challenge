/**
 * Utility functions for address formatting and manipulation
 */

import { ethers } from 'ethers';

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
