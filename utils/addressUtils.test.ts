import { truncateAddress } from './addressUtils';

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    utils: {
      isAddress: jest.fn(),
    },
    providers: {
      JsonRpcProvider: jest.fn(),
    },
  },
}));

// Mock chainConfig
jest.mock('../config/chain', () => ({
  chainConfig: {
    Ethereum: {
      rpcUrl: 'https://mainnet.infura.io/v3/test',
    },
  },
}));

// Mock addressValidation
jest.mock('./addressValidation', () => ({
  isValidENSName: jest.fn(),
}));

import { ethers } from 'ethers';

describe('addressUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('truncateAddress', () => {
    it('should truncate a valid Ethereum address with default parameters', () => {
      (ethers.utils.isAddress as jest.Mock).mockReturnValue(true);
      const address = '0x1234567890123456789012345678901234567890';
      const result = truncateAddress(address);
      expect(result).toBe('0x1234...7890');
    });

    it('should truncate with custom prefix and suffix lengths', () => {
      (ethers.utils.isAddress as jest.Mock).mockReturnValue(true);
      const address = '0x1234567890123456789012345678901234567890';
      const result = truncateAddress(address, 8, 6);
      expect(result).toBe('0x123456...567890');
    });

    it('should return ENS names unchanged', () => {
      (ethers.utils.isAddress as jest.Mock).mockReturnValue(false);
      const ensName = 'example.eth';
      const result = truncateAddress(ensName);
      expect(result).toBe('example.eth');
    });

    it('should handle addresses with whitespace', () => {
      (ethers.utils.isAddress as jest.Mock).mockReturnValue(true);
      const address = '  0x1234567890123456789012345678901234567890  ';
      const result = truncateAddress(address);
      expect(result).toBe('0x1234...7890');
    });
  });
});
