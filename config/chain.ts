import ethIcon from '../assets/eth-diamond-black.png';
import ethColorIcon from '../assets/eth-color-icon.png';
import arbitrumBadge from '../assets/arb-logo-official.png';
import optimismBadge from '../assets/optimism.png';
import polygonLogo from '../assets/polygon-logo.png';
import tetherLogo from '../assets/tether-logo.png';
import usdcLogo from '../assets/usdc-logo.png';
import btcLogo from '../assets/btc-logo.png';
import linkLogo from '../assets/link-logo.png';
import EthIcon from '../components/EthIcon';

export type ChainKey = 'ethereum' | 'polygon' | 'optimism' | 'arbitrum' | 'sepolia';

// Union type for all possible token identifiers (native + ERC20 symbols)
export type TokenKey = 'ETH' | 'POL' | 'USDT' | 'USDC' | 'WBTC' | 'OP' | 'ARB' | 'LINK';

// Helper functions to determine token type
export const isNativeAsset = (chainKey: ChainKey, tokenKey: TokenKey): boolean => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return tokenKey === nativeSymbol;
};

export const isErc20Asset = (chainKey: ChainKey, tokenKey: TokenKey): boolean => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return tokenKey !== nativeSymbol && chainConfig[chainKey].supportedErc20s.some(token => token.symbol === tokenKey);
};

// Get all supported tokens for a chain (native + ERC20s)
export const getSupportedTokens = (chainKey: ChainKey): string[] => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return [nativeSymbol, ...chainConfig[chainKey].supportedErc20s.map(token => token.symbol)];
};

// Get supported ERC20 tokens for a chain
export const getSupportedErc20s = (chainKey: ChainKey): TokenConfig[] => {
  return chainConfig[chainKey].supportedErc20s;
};

// Get token configuration by symbol for a chain
export const getTokenConfig = (chainKey: ChainKey, symbol: string): TokenConfig | null => {
  const token = chainConfig[chainKey].supportedErc20s.find(t => t.symbol === symbol);
  return token || null;
};

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
  supportedErc20s: TokenConfig[];
}> = {
  ethereum: {
    name: 'Ethereum',
    nativeTokenDisplay: 'ETH',
    rpcUrl: 'https://eth.drpc.org',
    symbol: 'ETH',
    chainIcon: ethColorIcon,
    explorerUrl: 'https://etherscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: EthIcon,
    },
    supportedErc20s: [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        icon: {
          baseIcon: tetherLogo,
        },
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        icon: {
          baseIcon: usdcLogo,
        },
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        icon: {
          baseIcon: btcLogo,
        },
      },
    ],
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
    supportedErc20s: [
      {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        icon: {
          baseIcon: usdcLogo,
          overlayIcon: polygonLogo,
        },
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        icon: {
          baseIcon: tetherLogo,
          overlayIcon: polygonLogo,
        },
      },
    ],
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
    supportedErc20s: [
      {
        symbol: 'OP',
        name: 'Optimism',
        decimals: 18,
        contractAddress: '0x4200000000000000000000000000000000000042',
        icon: {
          baseIcon: EthIcon,
          overlayIcon: optimismBadge,
        },
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        contractAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        icon: {
          baseIcon: usdcLogo,
          overlayIcon: optimismBadge,
        },
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        contractAddress: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
        icon: {
          baseIcon: tetherLogo,
          overlayIcon: optimismBadge,
        },
      },
    ],
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
    supportedErc20s: [
      {
        symbol: 'ARB',
        name: 'Arbitrum',
        decimals: 18,
        contractAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        icon: {
          baseIcon: EthIcon,
          overlayIcon: arbitrumBadge,
        },
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        contractAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        icon: {
          baseIcon: usdcLogo,
          overlayIcon: arbitrumBadge,
        },
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        contractAddress: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        icon: {
          baseIcon: tetherLogo,
          overlayIcon: arbitrumBadge,
        },
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        contractAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        icon: {
          baseIcon: btcLogo,
          overlayIcon: arbitrumBadge,
        },
      },
    ],
  },
  sepolia: {
    name: 'Sepolia',
    nativeTokenDisplay: 'SepoliaETH',
    rpcUrl: 'https://sepolia.drpc.org',
    symbol: 'ETH',
    chainIcon: ethColorIcon,
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
    nativeTokenIcon: {
      baseIcon: ethIcon,
    },
    supportedErc20s: [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        contractAddress: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
        icon: {
          baseIcon: tetherLogo,
        },
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        contractAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        icon: {
          baseIcon: usdcLogo,
        },
      },
      {
        symbol: 'WBTC',
        name: 'Wrapped Bitcoin',
        decimals: 8,
        contractAddress: '0x29f2D40B0605204364af54EC677bD022dA425d03',
        icon: {
          baseIcon: btcLogo,
        },
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        decimals: 18,
        contractAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
        icon: {
          baseIcon: linkLogo,
        },
      },
    ],
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
    LINK: {
      symbol: 'LINK',
      name: 'Chainlink',
      decimals: 18,
      contractAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      icon: {
        baseIcon: linkLogo,
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