import ethIcon from '../assets/eth-diamond-black.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';
import EthIcon from './EthIcon';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum' | 'sepolia';

export const chainConfig: Record<ChainKey, { name: string; nativeTokenName: string; rpcUrl: string; symbol: string; chainIcon: any; nativeTokenIcon: any }> = {
  ethereum: {
    name: 'Ethereum',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    nativeTokenIcon: EthIcon,
  },
  polygon: {
    name: 'Polygon',
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
    nativeTokenIcon: 'ChainTokenIcon',
  },
  arbitrum: {
    name: 'Arbitrum',
    nativeTokenName: 'Ethereum',
    rpcUrl: 'https://arbitrum.drpc.org',
    symbol: 'ETH',
    chainIcon: arbitrumBadge,
    nativeTokenIcon: 'ChainTokenIcon',
  },
  sepolia: {
    name: 'Sepolia',
    nativeTokenName: 'Sepolia Ethereum',
    rpcUrl: 'https://sepolia.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    nativeTokenIcon: 'ChainTokenIcon',
  },
};

export const chainOrder: ChainKey[] = ['ethereum', 'optimism', 'arbitrum', 'polygon', 'sepolia']; 