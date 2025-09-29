import ethIcon from '../assets/eth-diamond-black.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';
import tetherLogo from '../assets/tether-logo.png';
import usdcLogo from '../assets/usdc-logo.png';
import btcLogo from '../assets/btc-logo.png';
import EthIcon from '../components/EthIcon';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum' | 'sepolia';
export type TokenKey = 'USDT' | 'USDC' | 'WBTC' | 'OP' | 'ARB';

export type TokenConfig = {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress: string;
  icon: {
    baseIcon: any;
    overlayIcon?: any;
  };
};

export type ChainTokenConfig = Partial<Record<TokenKey, TokenConfig>>;

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
    nativeTokenDisplay: 'POL',
    rpcUrl: 'https://polygon.drpc.org',
    symbol: 'POL',
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

// Token configurations for each chain
export const tokenConfig: Record<ChainKey, ChainTokenConfig> = {
  ethereum: {
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      icon: {
        baseIcon: tetherLogo,
      },
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      icon: {
        baseIcon: usdcLogo,
      },
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      icon: {
        baseIcon: btcLogo,
      },
    },
  },
  sepolia: {
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      contractAddress: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
      icon: {
        baseIcon: tetherLogo,
      },
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      icon: {
        baseIcon: usdcLogo,
      },
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      contractAddress: '0x29f2D40B0605204364af54EC677bD022dA425d03',
      icon: {
        baseIcon: btcLogo,
      },
    },
  },
  arbitrum: {
    ARB: {
      symbol: 'ARB',
      name: 'Arbitrum',
      decimals: 18,
      contractAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      icon: {
        baseIcon: EthIcon,
        overlayIcon: arbitrumBadge,
      },
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      icon: {
        baseIcon: usdcLogo,
        overlayIcon: arbitrumBadge,
      },
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      icon: {
        baseIcon: tetherLogo,
        overlayIcon: arbitrumBadge,
      },
    },
    WBTC: {
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      contractAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      icon: {
        baseIcon: btcLogo,
        overlayIcon: arbitrumBadge,
      },
    },
  },
  optimism: {
    OP: {
      symbol: 'OP',
      name: 'Optimism',
      decimals: 18,
      contractAddress: '0x4200000000000000000000000000000000000042',
      icon: {
        baseIcon: EthIcon,
        overlayIcon: optimismBadge,
      },
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      icon: {
        baseIcon: usdcLogo,
        overlayIcon: optimismBadge,
      },
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      icon: {
        baseIcon: tetherLogo,
        overlayIcon: optimismBadge,
      },
    },
  },
  polygon: {
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      icon: {
        baseIcon: usdcLogo,
        overlayIcon: polygonLogo,
      },
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      icon: {
        baseIcon: tetherLogo,
        overlayIcon: polygonLogo,
      },
    },
  },
}; 