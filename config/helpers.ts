import { ChainKey, TokenKey, Token } from './types';
import { chainConfig } from './chains';

export const isNativeAsset = (
  chainKey: ChainKey,
  tokenKey: TokenKey,
): boolean => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return tokenKey === nativeSymbol;
};

export const isErc20Asset = (
  chainKey: ChainKey,
  tokenKey: TokenKey,
): boolean => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return (
    tokenKey !== nativeSymbol &&
    chainConfig[chainKey].supportedErc20s.some(
      (token: Token) => token.symbol === tokenKey,
    )
  );
};

export const getSupportedTokens = (chainKey: ChainKey): string[] => {
  const nativeSymbol = chainConfig[chainKey].symbol;
  return [
    nativeSymbol,
    ...chainConfig[chainKey].supportedErc20s.map(
      (token: Token) => token.symbol,
    ),
  ];
};

export const getSupportedErc20s = (chainKey: ChainKey): Token[] => {
  return chainConfig[chainKey].supportedErc20s;
};

export const getTokenConfig = (
  chainKey: ChainKey,
  symbol: string,
): Token | null => {
  const token = chainConfig[chainKey].supportedErc20s.find(
    (t: Token) => t.symbol === symbol,
  );
  return token || null;
};
