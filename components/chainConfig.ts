import ethIcon from '../assets/eth-diamond-black.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum' | 'sepolia';

export const chainConfig: Record<ChainKey, { name: string; nativeTokenName: string; rpcUrl: string; symbol: string; chainIcon: any; nativeTokenIcon: any }> = {
  ethereum: {
    name: 'Ethereum',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    nativeTokenIcon: ethIcon,
  },
  polygon: {
    name: 'Polygon Matic',
    nativeTokenName: 'Polygon Matic',
    rpcUrl: 'https://polygon.drpc.org',
    symbol: 'MATIC',
    chainIcon: polygonLogo,
    nativeTokenIcon: polygonLogo,
  },
  optimism: {
    name: 'Optimism',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://optimism.drpc.org',
    symbol: 'ETH',
    chainIcon: optimismBadge,
    nativeTokenIcon: ethIcon,
  },
  arbitrum: {
    name: 'Arbitrum',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://arbitrum.drpc.org',
    symbol: 'ETH',
    chainIcon: arbitrumBadge,
    nativeTokenIcon: ethIcon,
  },
  sepolia: {
    name: 'Sepolia',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://sepolia.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    nativeTokenIcon: ethIcon,
  },
};

export const chainOrder: ChainKey[] = ['ethereum', 'optimism', 'arbitrum', 'polygon', 'sepolia']; 