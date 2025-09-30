import {
  sendNativeTransaction,
  getERC20TokenInfo,
  getERC20TokenBalance,
  checkERC20Allowance,
  approveERC20Token,
  sendERC20Transaction,
} from '../../utils/transactionUtils';

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

    (ethers.providers.JsonRpcProvider as unknown as jest.Mock).mockImplementation(() => mockProvider);
    (ethers.Wallet as unknown as jest.Mock).mockImplementation(() => mockWallet);
    (ethers.Contract as unknown as jest.Mock).mockImplementation(() => mockContract);
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
      (ethers.utils.parseEther as jest.Mock).mockReturnValue('1000000000000000000');
      mockWallet.sendTransaction.mockResolvedValue(mockTxResponse);
      mockTxResponse.wait.mockResolvedValue(mockReceipt);

      const result = await sendNativeTransaction(
        mockWallet,
        '0xto',
        '1.0',
        'https://rpc.url'
      );

      expect(result).toEqual({
        success: true,
        hash: '0xtxhash',
      });
    });

    it('should handle transaction failure', async () => {
      mockWallet.connect.mockReturnValue(mockWallet);
      mockProvider.getFeeData.mockRejectedValue(new Error('Transaction failed'));

      const result = await sendNativeTransaction(
        mockWallet,
        '0xto',
        '1.0',
        'https://rpc.url'
      );

      expect(result).toEqual({
        success: false,
        error: 'Transaction failed',
      });
    });
  });

  describe('getERC20TokenInfo', () => {
    it('should get token info successfully', async () => {
      mockContract.symbol.mockResolvedValue('USDC');
      mockContract.decimals.mockResolvedValue(6);
      mockContract.balanceOf.mockResolvedValue('1000000');
      (ethers.utils.formatUnits as jest.Mock).mockReturnValue('1.0');

      const result = await getERC20TokenInfo(
        mockProvider,
        '0xtoken',
        '0xwallet'
      );

      expect(result).toEqual({
        address: '0xtoken',
        symbol: 'USDC',
        decimals: 6,
        balance: '1.0',
      });
    });

    it('should handle errors', async () => {
      mockContract.symbol.mockRejectedValue(new Error('Contract error'));

      await expect(
        getERC20TokenInfo(mockProvider, '0xtoken', '0xwallet')
      ).rejects.toThrow('Contract error');
    });
  });

  describe('getERC20TokenBalance', () => {
    it('should get token balance successfully', async () => {
      mockContract.balanceOf.mockResolvedValue('1000000');
      mockContract.decimals.mockResolvedValue(6);
      (ethers.utils.formatUnits as jest.Mock).mockReturnValue('1.0');

      const result = await getERC20TokenBalance(
        mockProvider,
        '0xtoken',
        '0xwallet'
      );

      expect(result).toBe('1.0');
    });

    it('should handle errors', async () => {
      mockContract.balanceOf.mockRejectedValue(new Error('Balance error'));

      await expect(
        getERC20TokenBalance(mockProvider, '0xtoken', '0xwallet')
      ).rejects.toThrow('Balance error');
    });
  });

  describe('checkERC20Allowance', () => {
    it('should check allowance successfully', async () => {
      mockContract.allowance.mockResolvedValue('1000000');
      mockContract.decimals.mockResolvedValue(6);
      (ethers.utils.formatUnits as jest.Mock).mockReturnValue('1.0');

      const result = await checkERC20Allowance(
        mockProvider,
        '0xtoken',
        '0xowner',
        '0xspender'
      );

      expect(result).toBe('1.0');
    });

    it('should handle errors', async () => {
      mockContract.allowance.mockRejectedValue(new Error('Allowance error'));

      await expect(
        checkERC20Allowance(mockProvider, '0xtoken', '0xowner', '0xspender')
      ).rejects.toThrow('Allowance error');
    });
  });

  describe('approveERC20Token', () => {
    it('should approve token successfully', async () => {
      const mockTx = { hash: '0xtxhash', wait: jest.fn() };
      const mockReceipt = { transactionHash: '0xtxhash' };

      mockWallet.connect.mockReturnValue(mockWallet);
      mockContract.decimals.mockResolvedValue(6);
      (ethers.utils.parseUnits as jest.Mock).mockReturnValue('1000000');
      mockContract.approve.mockResolvedValue(mockTx);
      mockTx.wait.mockResolvedValue(mockReceipt);

      const result = await approveERC20Token(
        mockWallet,
        '0xtoken',
        '0xspender',
        '1.0',
        'https://rpc.url'
      );

      expect(result).toEqual({
        success: true,
        hash: '0xtxhash',
      });
    });

    it('should handle approval failure', async () => {
      mockWallet.connect.mockReturnValue(mockWallet);
      mockContract.decimals.mockRejectedValue(new Error('Approval failed'));

      const result = await approveERC20Token(
        mockWallet,
        '0xtoken',
        '0xspender',
        '1.0',
        'https://rpc.url'
      );

      expect(result).toEqual({
        success: false,
        error: 'Approval failed',
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
        'https://rpc.url'
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
        'https://rpc.url'
      );

      expect(result).toEqual({
        success: false,
        error: 'Transfer failed',
      });
    });
  });
});
