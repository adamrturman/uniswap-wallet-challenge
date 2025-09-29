// Shared ethers mocks for all tests
export const mockGetBalance = jest.fn();
export const mockJsonRpcProvider = jest.fn(() => ({
  getBalance: mockGetBalance,
}));

export const mockFormatEther = jest.fn((wei) => (parseFloat(wei.toString()) / 1e18).toString());

// Helper functions for test setup
export const resetEthersMocks = () => {
  jest.clearAllMocks();
  mockGetBalance.mockClear();
  mockJsonRpcProvider.mockClear();
  mockFormatEther.mockClear();
};

export const setupSuccessfulBalanceMock = (balanceWei: string = '1500000000000000000', delay: number = 0) => {
  mockGetBalance.mockImplementation(() =>
    new Promise(resolve => setTimeout(() => resolve(balanceWei), delay))
  );
};

export const setupErrorBalanceMock = (error: Error, delay: number = 0) => {
  mockGetBalance.mockImplementation(() =>
    new Promise((_, reject) => setTimeout(() => reject(error), delay))
  );
};

export const setupDelayedBalanceMock = (balanceWei: string = '1500000000000000000', delay: number = 5000) => {
  mockGetBalance.mockImplementation(() =>
    new Promise(resolve => setTimeout(() => resolve(balanceWei), delay))
  );
};

export const setupMixedResultsMock = (successfulChainIndices: number[], errorChainIndices: number[], delay: number = 0) => {
  let callCount = 0;
  const chainKeys = ['Ethereum', 'Polygon', 'Optimism', 'Arbitrum', 'Sepolia'];

  mockGetBalance.mockImplementation(() => {
    const currentChainIndex = callCount;
    callCount++;

    if (errorChainIndices.includes(currentChainIndex)) {
      return new Promise((_, reject) => setTimeout(() => reject(new Error('Mocked Error')), delay));
    } else if (successfulChainIndices.includes(currentChainIndex)) {
      return new Promise(resolve => setTimeout(() => resolve('1500000000000000000'), delay));
    }
    // Default to success if not explicitly in error or success lists
    return new Promise(resolve => setTimeout(() => resolve('1000000000000000000'), delay));
  });
};

// Mock the entire ethers module
jest.mock('ethers', () => ({
  providers: {
    JsonRpcProvider: mockJsonRpcProvider,
  },
  utils: {
    formatEther: mockFormatEther,
  },
  Wallet: {
    fromMnemonic: jest.fn(() => ({
      address: '0x1234567890123456789012345678901234567890',
    })),
  },
}));