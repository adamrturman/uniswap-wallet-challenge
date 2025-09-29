// Shared chain config mocks for all tests
export const mockChainConfig = {
  ethereum: { 
    name: 'Ethereum', 
    symbol: 'ETH', 
    rpcUrl: 'https://eth.drpc.org',
    nativeTokenName: 'Ethereum',
    chainIcon: 'eth-icon',
    explorerUrl: 'https://etherscan.io/tx/',
    nativeTokenIcon: { baseIcon: 'EthIcon' }
  },
  polygon: { 
    name: 'Polygon', 
    symbol: 'MATIC', 
    rpcUrl: 'https://polygon.drpc.org',
    nativeTokenName: 'Polygon Matic',
    chainIcon: 'polygon-icon',
    explorerUrl: 'https://polygonscan.com/tx/',
    nativeTokenIcon: { baseIcon: 'polygon-icon' }
  },
  optimism: { 
    name: 'Optimism', 
    symbol: 'ETH', 
    rpcUrl: 'https://optimism.drpc.org',
    nativeTokenName: 'Ethereum',
    chainIcon: 'optimism-icon',
    explorerUrl: 'https://optimistic.etherscan.io/tx/',
    nativeTokenIcon: { baseIcon: 'eth-icon', overlayIcon: 'optimism-icon' }
  },
  arbitrum: { 
    name: 'Arbitrum', 
    symbol: 'ETH', 
    rpcUrl: 'https://arbitrum.drpc.org',
    nativeTokenName: 'Ethereum',
    chainIcon: 'arbitrum-icon',
    explorerUrl: 'https://arbiscan.io/tx/',
    nativeTokenIcon: { baseIcon: 'eth-icon', overlayIcon: 'arbitrum-icon' }
  },
  sepolia: { 
    name: 'Sepolia', 
    symbol: 'ETH', 
    rpcUrl: 'https://sepolia.drpc.org',
    nativeTokenName: 'Sepolia Ethereum',
    chainIcon: 'eth-icon',
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
    nativeTokenIcon: { baseIcon: 'eth-icon' }
  },
};

export const mockChainOrder = ['Ethereum', 'Polygon', 'Optimism', 'Arbitrum', 'Sepolia'];

// Mock the entire chain config module
jest.mock('../../config/chain', () => ({
  chainConfig: mockChainConfig,
  chainOrder: mockChainOrder,
}));
