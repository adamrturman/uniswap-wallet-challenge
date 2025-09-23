import ethIcon from '../assets/eth-diamond-black.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum';

export const chainConfig: Record<ChainKey, { name: string; rpcUrl: string; symbol: string; chainIcon: any; nativeTokenIcon: any }> = {
  ethereum: {
    name: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    nativeTokenIcon: ethIcon,
  },
  polygon: {
    name: 'Polygon',
    rpcUrl: 'https://polygon.drpc.org',
    symbol: 'MATIC',
    chainIcon: polygonLogo,
    nativeTokenIcon: polygonLogo,
  },
  optimism: {
    name: 'Optimism',
    rpcUrl: 'https://optimism.drpc.org',
    symbol: 'ETH',
    chainIcon: optimismBadge,
    nativeTokenIcon: ethIcon,
  },
  arbitrum: {
    name: 'Arbitrum',
    rpcUrl: 'https://arbitrum.drpc.org',
    symbol: 'ETH',
    chainIcon: arbitrumBadge,
    nativeTokenIcon: ethIcon,
  },
};

export const chainOrder: ChainKey[] = ['ethereum', 'optimism', 'arbitrum', 'polygon']; 