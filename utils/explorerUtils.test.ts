import { openExplorer } from './explorerUtils';

// Mock react-native Linking
jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
}));

// Mock chainConfig
jest.mock('../config/chain', () => ({
  chainConfig: {
    Ethereum: {
      explorerUrl: 'https://etherscan.io/tx/',
    },
    Polygon: {
      explorerUrl: 'https://polygonscan.com/tx/',
    },
    Arbitrum: {
      explorerUrl: 'https://arbiscan.io/tx/',
    },
  },
}));

import { Linking } from 'react-native';

describe('explorerUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('openExplorer', () => {
    it('should open explorer URL for valid transaction hash and chain', async () => {
      const mockOpenURL = Linking.openURL as jest.Mock;
      mockOpenURL.mockResolvedValue(undefined);

      await openExplorer('0x1234567890abcdef', 'Ethereum');

      expect(mockOpenURL).toHaveBeenCalledWith(
        'https://etherscan.io/tx/0x1234567890abcdef',
      );
    });

    it('should open different explorer URLs for different chains', async () => {
      const mockOpenURL = Linking.openURL as jest.Mock;
      mockOpenURL.mockResolvedValue(undefined);

      await openExplorer('0xabcdef1234567890', 'Polygon');
      expect(mockOpenURL).toHaveBeenCalledWith(
        'https://polygonscan.com/tx/0xabcdef1234567890',
      );

      await openExplorer('0x9876543210fedcba', 'Arbitrum');
      expect(mockOpenURL).toHaveBeenCalledWith(
        'https://arbiscan.io/tx/0x9876543210fedcba',
      );
    });

    it('should throw error when transaction hash is empty', async () => {
      await expect(openExplorer('', 'Ethereum')).rejects.toThrow(
        'Transaction hash and chain key are required',
      );
    });

    it('should throw error when chain key is empty', async () => {
      await expect(
        openExplorer('0x1234567890abcdef', '' as any),
      ).rejects.toThrow('Transaction hash and chain key are required');
    });

    it('should throw error when chain key is null', async () => {
      await expect(
        openExplorer('0x1234567890abcdef', null as any),
      ).rejects.toThrow('Transaction hash and chain key are required');
    });

    it('should throw error when chain key is undefined', async () => {
      await expect(
        openExplorer('0x1234567890abcdef', undefined as any),
      ).rejects.toThrow('Transaction hash and chain key are required');
    });

    it('should throw error when chain config is not found', async () => {
      await expect(
        openExplorer('0x1234567890abcdef', 'UnknownChain' as any),
      ).rejects.toThrow('Explorer URL not found for chain: UnknownChain');
    });

    it('should handle Linking.openURL errors', async () => {
      const mockOpenURL = Linking.openURL as jest.Mock;
      const error = new Error('Failed to open URL');
      mockOpenURL.mockRejectedValue(error);

      await expect(
        openExplorer('0x1234567890abcdef', 'Ethereum'),
      ).rejects.toThrow('Failed to open URL');
    });

    it('should handle different transaction hash formats', async () => {
      const mockOpenURL = Linking.openURL as jest.Mock;
      mockOpenURL.mockResolvedValue(undefined);

      await openExplorer('0x', 'Ethereum');
      expect(mockOpenURL).toHaveBeenCalledWith('https://etherscan.io/tx/0x');

      await openExplorer('0x123', 'Ethereum');
      expect(mockOpenURL).toHaveBeenCalledWith('https://etherscan.io/tx/0x123');
    });
  });
});
