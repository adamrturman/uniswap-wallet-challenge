/**
 * Utility functions for address formatting and manipulation
 */

/**
 * Truncates a wallet address with customizable parameters
 * @param address - The wallet address to truncate
 * @param maxLength - Maximum length before truncation (default: 30)
 * @param prefixLength - Number of characters to show at the beginning (default: 12)
 * @param suffixLength - Number of characters to show at the end (default: 10)
 * @returns Truncated address string
 */
export function truncateAddress(
  address: string,
  maxLength: number = 30,
  prefixLength: number = 12,
  suffixLength: number = 10
): string {
  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length <= maxLength) {
    return trimmedAddress;
  }
  
  return `${trimmedAddress.slice(0, prefixLength)}...${trimmedAddress.slice(-suffixLength)}`;
}
