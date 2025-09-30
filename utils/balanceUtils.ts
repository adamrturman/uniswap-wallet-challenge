import { providers, utils, BigNumber, Contract } from 'ethers';
import {
  ChainKey,
  TokenKey,
  ChainBalance,
  ChainBalances,
  ChainTokenBalances,
  TokenBalances,
  TokenItem,
} from '../types';
import { chainConfig, tokenConfig, chainOrder } from '../config/chain';

// ERC-20 ABI for balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

// Cache for balance data to reduce RPC calls
const balanceCache = new Map<
  string,
  { balances: ChainBalances; timestamp: number }
>();
const tokenBalanceCache = new Map<
  string,
  { balances: TokenBalances; timestamp: number }
>();
const CACHE_DURATION = 30000; // 30 seconds cache duration

// Function to clear balance cache for a specific address
export function clearBalanceCache(address: string) {
  balanceCache.delete(address);
  tokenBalanceCache.delete(address);
}

export function createInitialTokenBalances(): TokenBalances {
  const chainKeys = Object.keys(chainConfig) as ChainKey[];

  return Object.fromEntries(
    chainKeys.map((chainKey) => {
      // Get available tokens for this chain
      const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];

      return [
        chainKey,
        {
          native: { value: 0, state: 'loading' as const },
          tokens: Object.fromEntries(
            availableTokens.map((tokenKey) => [
              tokenKey,
              { value: 0, state: 'loading' as const },
            ]),
          ) as ChainTokenBalances,
        },
      ];
    }),
  ) as TokenBalances;
}

// Function to fetch all token balances across all chains
export async function fetchAllTokenBalances(
  address: string,
): Promise<TokenBalances> {
  // Check cache first
  const cached = tokenBalanceCache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.balances;
  }

  const chainKeys = Object.keys(chainConfig) as ChainKey[];
  const promises = chainKeys.map(async (chainKey) => {
    try {
      const provider = new providers.JsonRpcProvider(
        chainConfig[chainKey].rpcUrl,
      );

      // Fetch native token balance
      let nativeBalance: ChainBalance;
      try {
        const balanceWei = await provider.getBalance(address);
        const balanceEth = parseFloat(utils.formatEther(balanceWei));
        nativeBalance = { value: balanceEth, state: 'loaded' };
      } catch (error) {
        nativeBalance = { value: 0, state: 'error' };
      }

      // Fetch token balances
      const tokenBalances: ChainTokenBalances = {} as ChainTokenBalances;
      const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];

      const tokenPromises = availableTokens.map(async (tokenKey) => {
        try {
          const token = tokenConfig[chainKey][tokenKey];
          if (!token) {
            return {
              tokenKey,
              balance: 0,
              success: false,
              error: 'Token not available on this chain',
            };
          }

          const contract = new Contract(
            token.contractAddress,
            ERC20_ABI,
            provider,
          );
          const balance: BigNumber = await contract.balanceOf(address);
          const formattedBalance = parseFloat(
            utils.formatUnits(balance, token.decimals),
          );
          return { tokenKey, balance: formattedBalance, success: true };
        } catch (error) {
          return { tokenKey, balance: 0, success: false, error };
        }
      });

      const tokenResults = await Promise.allSettled(tokenPromises);

      tokenResults.forEach((result, index) => {
        const tokenKey = availableTokens[index];
        if (result.status === 'fulfilled') {
          const { success, balance } = result.value;
          tokenBalances[tokenKey] = {
            value: success ? balance : 0,
            state: success ? 'loaded' : 'error',
          };
        } else {
          tokenBalances[tokenKey] = { value: 0, state: 'error' };
        }
      });

      const balances = { native: nativeBalance, tokens: tokenBalances };
      return { chainKey, balances, success: true };
    } catch (error) {
      return { chainKey, balances: null, success: false, error };
    }
  });

  const results = await Promise.allSettled(promises);
  const allBalances: TokenBalances = {} as TokenBalances;

  results.forEach((result, index) => {
    const chainKey = chainKeys[index];
    if (result.status === 'fulfilled' && result.value.success) {
      allBalances[chainKey] = result.value.balances!;
    } else {
      // Create empty balances for failed chains
      const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
      const emptyTokenBalances: ChainTokenBalances = Object.fromEntries(
        availableTokens.map((tokenKey) => [
          tokenKey,
          { value: 0, state: 'error' as const },
        ]),
      ) as ChainTokenBalances;

      allBalances[chainKey] = {
        native: { value: 0, state: 'error' },
        tokens: emptyTokenBalances,
      };
    }
  });

  // Cache the results
  tokenBalanceCache.set(address, {
    balances: allBalances,
    timestamp: Date.now(),
  });

  return allBalances;
}

/**
 * Filters tokens with non-zero balances from the provided balances object.
 * Returns an array of TokenItem objects sorted by chain order.
 *
 * @param balances - The token balances object containing native and ERC-20 token balances
 * @returns Array of tokens that have non-zero balances
 */
export function getTokensWithBalances(balances: TokenBalances): TokenItem[] {
  const tokens: TokenItem[] = [];

  chainOrder.forEach((chainKey) => {
    const chainBalances = balances[chainKey];
    if (!chainBalances) return;

    // Add native token if it has a balance
    if (chainBalances.native && chainBalances.native.value > 0) {
      const config = chainConfig[chainKey];
      tokens.push({
        chainKey,
        tokenKey: config.symbol as TokenKey,
        name: config.nativeTokenDisplay,
        symbol: config.symbol,
        balance: chainBalances.native.value,
        tokenIcon: config.nativeTokenIcon,
      });
    }

    // Add ERC-20 tokens if they have balances
    if (chainBalances.tokens) {
      // Get available tokens for this chain
      const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
      const tokenKeys: TokenKey[] = availableTokens;

      tokenKeys.forEach((tokenKey) => {
        // Skip native token as it's handled separately
        const nativeSymbol = chainConfig[chainKey].symbol;
        if (tokenKey === nativeSymbol) return;

        const tokenBalance = chainBalances.tokens[tokenKey];
        if (tokenBalance && tokenBalance.value > 0) {
          const token = tokenConfig[chainKey][tokenKey];
          if (token) {
            tokens.push({
              chainKey,
              tokenKey,
              name: token.name,
              symbol: token.symbol,
              balance: tokenBalance.value,
              tokenIcon: token.icon,
            });
          }
        }
      });
    }
  });

  return tokens;
}

export const formatTokenAmount = (amount: number): string => {
  if (amount === 0) {
    return '0.00';
  } else {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }
};
