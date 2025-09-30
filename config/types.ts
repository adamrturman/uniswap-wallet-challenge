import { IconType } from '../components/types';

export type ChainKey =
  | 'Ethereum'
  | 'Polygon'
  | 'Optimism'
  | 'Arbitrum'
  | 'Sepolia';

export type TokenKey =
  | 'ETH'
  | 'POL'
  | 'USDT'
  | 'USDC'
  | 'WBTC'
  | 'OP'
  | 'ARB'
  | 'LINK';

export type Token = {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress: string;
  icon: {
    baseIcon: IconType;
    overlayIcon?: IconType;
  };
};

export type ChainTokenConfig = Partial<Record<TokenKey, Token>>;
