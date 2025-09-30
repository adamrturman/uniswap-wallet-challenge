import { Linking } from 'react-native';
import { chainConfig } from '../config/chain';
import { ChainKey } from '../types';

/**
 * Opens a blockchain explorer URL for a given transaction hash and chain
 * @param transactionHash - The transaction hash to view
 * @param chainKey - The blockchain chain key (e.g., 'Ethereum', 'Polygon')
 */
export const openExplorer = async (
  transactionHash: string,
  chainKey: ChainKey,
): Promise<void> => {
  if (!transactionHash || !chainKey) {
    throw new Error('Transaction hash and chain key are required');
  }

  try {
    const config = chainConfig[chainKey];

    if (!config || !config.explorerUrl) {
      throw new Error(`Explorer URL not found for chain: ${chainKey}`);
    }

    const explorerUrl = `${config.explorerUrl}${transactionHash}`;
    await Linking.openURL(explorerUrl);
  } catch (error) {
    console.error('Failed to open explorer:', error);
    throw error;
  }
};
