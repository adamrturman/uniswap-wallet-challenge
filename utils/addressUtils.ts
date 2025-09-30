/**
 * Utility functions for address formatting and manipulation
 */

/**
 * Truncates a wallet address with customizable parameters
 * @param address - The wallet address to truncate
 * @param prefixLength - Number of characters to show at the beginning (default: 6)
 * @param suffixLength - Number of characters to show at the end (default: 4)
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string,
  prefixLength: number = 6,
  suffixLength: number = 4
): string {
  const trimmedAddress = address.trim();
  
  return `${trimmedAddress.slice(0, prefixLength)}...${trimmedAddress.slice(-suffixLength)}`;
}
