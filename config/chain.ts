import ethIcon from '../assets/eth-diamond-black.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';
import EthIcon from '../components/EthIcon';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum' | 'sepolia';

export const chainConfig: Record<ChainKey, { 
  name: string; 
  nativeTokenDisplay: string; 
  rpcUrl: string; 
  symbol: string; 
  chainIcon: any; 
  explorerUrl: string;
  nativeTokenIcon: {
    baseIcon: any;
    overlayIcon?: any;
  };
}> = {
  ethereum: {
    name: 'Ethereum',
    nativeTokenDisplay: 'ETH',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    explorerUrl: 'https://etherscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: EthIcon,
    },
  },
  polygon: {
    name: 'Polygon',
    nativeTokenDisplay: 'MATIC',
    rpcUrl: 'https://polygon.drpc.org',
    symbol: 'MATIC',
    chainIcon: polygonLogo,
    explorerUrl: 'https://polygonscan.com/tx/',
    nativeTokenIcon: {
      baseIcon: polygonLogo,
    },
  },
  optimism: {
    name: 'Optimism',
    nativeTokenDisplay: 'ETH (Optimism)',
    rpcUrl: 'https://optimism-rpc.publicnode.com',
    symbol: 'ETH',
    chainIcon: optimismBadge,
    explorerUrl: 'https://optimistic.etherscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: ethIcon,
      overlayIcon: optimismBadge,
    },
  },
  arbitrum: {
    name: 'Arbitrum',
    nativeTokenDisplay: 'ETH (Arbitrum)',
    rpcUrl: 'https://arbitrum.drpc.org',
    symbol: 'ETH',
    chainIcon: arbitrumBadge,
    explorerUrl: 'https://arbiscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: ethIcon,
      overlayIcon: arbitrumBadge,
    },
  },
  sepolia: {
    name: 'Sepolia',
    nativeTokenDisplay: 'SepoliaETH',
    rpcUrl: 'https://sepolia.drpc.org',
    symbol: 'ETH',
    chainIcon: ethIcon,
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: ethIcon,
    },
  },
};

export const chainOrder: ChainKey[] = ['ethereum', 'optimism', 'arbitrum', 'polygon', 'sepolia']; 