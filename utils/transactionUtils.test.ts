import {
  sendNativeTransaction,
  sendERC20Transaction,
} from './transactionUtils';

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    utils: {
      parseEther: jest.fn(),
      parseUnits: jest.fn(),
      formatUnits: jest.fn(),
      formatEther: jest.fn(),
    },
    providers: {
      JsonRpcProvider: jest.fn(),
    },
    Wallet: jest.fn(),
    Contract: jest.fn(),
    BigNumber: {
      from: jest.fn(),
    },
  },
}));

import { ethers } from 'ethers';

describe('transactionUtils', () => {
  let mockProvider: any;
  let mockWallet: any;
  let mockContract: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockProvider = {
      estimateGas: jest.fn(),
      getFeeData: jest.fn(),
    };

    mockWallet = {
      address: '0x1234567890123456789012345678901234567890',
      connect: jest.fn(),
      sendTransaction: jest.fn(),
    };

    mockContract = {
      symbol: jest.fn(),
      decimals: jest.fn(),
      balanceOf: jest.fn(),
      allowance: jest.fn(),
      approve: jest.fn(),
      transfer: jest.fn(),
      estimateGas: {
        transfer: jest.fn(),
      },
    };

    (
      ethers.providers.JsonRpcProvider as unknown as jest.Mock
    ).mockImplementation(() => mockProvider);
    (ethers.Wallet as unknown as jest.Mock).mockImplementation(
      () => mockWallet,
    );
    (ethers.Contract as unknown as jest.Mock).mockImplementation(
      () => mockContract,
    );
  });

  describe('sendNativeTransaction', () => {
    it('should send transaction with EIP-1559', async () => {
      const mockTxResponse = { hash: '0xtxhash', wait: jest.fn() };
      const mockReceipt = { transactionHash: '0xtxhash' };
      const mockFeeData = {
        maxFeePerGas: '20000000000',
        maxPriorityFeePerGas: '1000000000',
      };

      mockWallet.connect.mockReturnValue(mockWallet);
      mockProvider.getFeeData.mockResolvedValue(mockFeeData);
      mockProvider.estimateGas.mockResolvedValue('21000');
      (ethers.utils.parseEther as jest.Mock).mockReturnValue(
        '1000000000000000000',
      );
      mockWallet.sendTransaction.mockResolvedValue(mockTxResponse);
      mockTxResponse.wait.mockResolvedValue(mockReceipt);

      const result = await sendNativeTransaction(
        mockWallet,
        '0xto',
        '1.0',
        'https://rpc.url',
      );

      expect(result).toEqual({
        success: true,
        hash: '0xtxhash',
      });
    });

    it('should handle transaction failure', async () => {
      mockWallet.connect.mockReturnValue(mockWallet);
      mockProvider.getFeeData.mockRejectedValue(
        new Error('Transaction failed'),
      );

      const result = await sendNativeTransaction(
        mockWallet,
        '0xto',
        '1.0',
        'https://rpc.url',
      );

      expect(result).toEqual({
        success: false,
        error: 'Transaction failed',
      });
    });
  });

  describe('sendERC20Transaction', () => {
    it('should send ERC20 transaction successfully', async () => {
      const mockTx = { hash: '0xtxhash', wait: jest.fn() };
      const mockReceipt = { transactionHash: '0xtxhash' };

      mockWallet.connect.mockReturnValue(mockWallet);
      mockContract.decimals.mockResolvedValue(6);
      (ethers.utils.parseUnits as jest.Mock).mockReturnValue('1000000');
      mockContract.transfer.mockResolvedValue(mockTx);
      mockTx.wait.mockResolvedValue(mockReceipt);

      const result = await sendERC20Transaction(
        mockWallet,
        {
          tokenAddress: '0xtoken',
          toAddress: '0xto',
          amount: '1.0',
        },
        'https://rpc.url',
      );

      expect(result).toEqual({
        success: true,
        hash: '0xtxhash',
      });
    });

    it('should handle transfer failure', async () => {
      mockWallet.connect.mockReturnValue(mockWallet);
      mockContract.decimals.mockRejectedValue(new Error('Transfer failed'));

      const result = await sendERC20Transaction(
        mockWallet,
        {
          tokenAddress: '0xtoken',
          toAddress: '0xto',
          amount: '1.0',
        },
        'https://rpc.url',
      );

      expect(result).toEqual({
        success: false,
        error: 'Transfer failed',
      });
    });
  });
});
