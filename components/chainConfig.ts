export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum';

export const chainConfig: Record<ChainKey, { name: string; rpcUrl: string; symbol: string }> = {
  ethereum: {
    name: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: 'https://polygon.drpc.org',
    symbol: 'MATIC',
  },
  optimism: {
    name: 'Optimism',
    rpcUrl: 'https://optimism.drpc.org',
    symbol: 'ETH',
  },
  arbitrum: {
    name: 'Arbitrum',
    rpcUrl: 'https://arbitrum.drpc.org',
    symbol: 'ETH',
  },
};

export const chainOrder: ChainKey[] = ['ethereum', 'optimism', 'arbitrum', 'polygon']; 