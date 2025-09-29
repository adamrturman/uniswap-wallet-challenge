import { providers, utils, BigNumber, BigNumberish, Contract } from 'ethers';
import { ChainKey, TokenKey, tokenConfig } from '../config/chain';
import { chainConfig } from '../config/chain';

export type BalanceLoadingState = 'loading' | 'loaded' | 'error';

export type ChainBalance = {
  value: number;
  state: BalanceLoadingState;
};

export type ChainBalances = Record<ChainKey, ChainBalance>;

export type TokenBalance = {
  value: number;
  state: BalanceLoadingState;
};

export type ChainTokenBalances = Record<TokenKey, TokenBalance>;

export type AllTokenBalances = Record<ChainKey, {
  native: ChainBalance;
  tokens: ChainTokenBalances;
}>;

// ERC-20 ABI for balanceOf function
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

// Cache for balance data to reduce RPC calls
const balanceCache = new Map<string, { balances: ChainBalances; timestamp: number }>();
const tokenBalanceCache = new Map<string, { balances: AllTokenBalances; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache duration

export async function fetchBalancesForAllChains(address: string): Promise<Record<ChainKey, number>> {
  const balances: Record<ChainKey, number> = {} as Record<ChainKey, number>;
  
  // Initialize all chains with 0 balance
  Object.keys(chainConfig).forEach((chainKey) => {
    balances[chainKey as ChainKey] = 0;
  });

  // Fetch balances for all chains in parallel
  const promises = [];
  for (const chainKey of Object.keys(chainConfig)) {
    const promise = (async () => {
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey as ChainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      return { chainKey: chainKey as ChainKey, balance: balanceEth };
    })();
    promises.push(promise);
  }

  const results = await Promise.allSettled(promises);
  
  results.forEach((result, index) => {
    const chainKey = Object.keys(chainConfig)[index] as ChainKey;
    if (result.status === 'fulfilled') {
      balances[result.value.chainKey] = result.value.balance;
    } else {
      balances[chainKey] = 0;
    }
  });
  return balances;
}

export function createInitialChainBalances(): ChainBalances {
  return Object.fromEntries(
    Object.keys(chainConfig).map(chainKey => [
      chainKey, 
      { value: 0, state: 'loading' as const }
    ])
  ) as ChainBalances;
}

export function createInitialAllTokenBalances(): AllTokenBalances {
  const chainKeys = Object.keys(chainConfig) as ChainKey[];
  
  return Object.fromEntries(
    chainKeys.map(chainKey => {
      // Get available tokens for this chain
      const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
      
      return [
        chainKey,
        {
          native: { value: 0, state: 'loading' as const },
          tokens: Object.fromEntries(
            availableTokens.map(tokenKey => [
              tokenKey,
              { value: 0, state: 'loading' as const }
            ])
          ) as ChainTokenBalances
        }
      ];
    })
  ) as AllTokenBalances;
}


export async function fetchChainBalances(address: string): Promise<ChainBalances> {
  // Check cache first
  const cached = balanceCache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.balances;
  }

  // Start all RPC calls in parallel
  const chainKeys = Object.keys(chainConfig) as ChainKey[];
  const promises = chainKeys.map(async (chainKey) => {
    try {
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      
      return { chainKey, balance: balanceEth, success: true };
    } catch (error) {
      return { chainKey, balance: 0, success: false, error };
    }
  });

  // Wait for ALL responses (success and errors)
  const results = await Promise.allSettled(promises);
  
  // Build final balances state with all results
  const balancesWithState: ChainBalances = createInitialChainBalances();
  
  results.forEach((result, index) => {
    const chainKey = chainKeys[index];
    if (result.status === 'fulfilled') {
      const { success, balance } = result.value;
      if (success) {
        balancesWithState[chainKey] = { value: balance, state: 'loaded' };
      } else {
        balancesWithState[chainKey] = { value: 0, state: 'error' };
      }
    } else {
      balancesWithState[chainKey] = { value: 0, state: 'error' };
    }
  });

  // Cache the results
  balanceCache.set(address, { balances: balancesWithState, timestamp: Date.now() });
  
  return balancesWithState;
}

// Function to fetch ERC-20 token balance
export async function fetchTokenBalance(
  provider: providers.JsonRpcProvider,
  tokenAddress: string,
  userAddress: string,
  decimals: number
): Promise<number> {
  try {
    const contract = new Contract(tokenAddress, ERC20_ABI, provider);
    const balance: BigNumber = await contract.balanceOf(userAddress);
    return parseFloat(utils.formatUnits(balance, decimals));
  } catch (error) {
    console.error(`Error fetching token balance for ${tokenAddress}:`, error);
    return 0;
  }
}

// Function to fetch all token balances for a specific chain
export async function fetchChainTokenBalances(
  chainKey: ChainKey,
  address: string
): Promise<{ native: ChainBalance; tokens: ChainTokenBalances }> {
  const provider = new providers.JsonRpcProvider(chainConfig[chainKey].rpcUrl);
  
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
  // Get available tokens for this chain
  const availableTokens = Object.keys(tokenConfig[chainKey]) as TokenKey[];
  const tokenKeys: TokenKey[] = availableTokens;
  
  const tokenPromises = tokenKeys.map(async (tokenKey) => {
    try {
      const token = tokenConfig[chainKey][tokenKey];
      if (!token) {
        return { tokenKey, balance: 0, success: false, error: 'Token not available on this chain' };
      }
      const balance = await fetchTokenBalance(provider, token.contractAddress, address, token.decimals);
      return { tokenKey, balance, success: true };
    } catch (error) {
      return { tokenKey, balance: 0, success: false, error };
    }
  });

  const tokenResults = await Promise.allSettled(tokenPromises);
  
  tokenResults.forEach((result, index) => {
    const tokenKey = tokenKeys[index];
    if (result.status === 'fulfilled') {
      const { success, balance } = result.value;
      tokenBalances[tokenKey] = { 
        value: success ? balance : 0, 
        state: success ? 'loaded' : 'error' 
      };
    } else {
      tokenBalances[tokenKey] = { value: 0, state: 'error' };
    }
  });

  return { native: nativeBalance, tokens: tokenBalances };
}

// Function to fetch all token balances across all chains
export async function fetchAllTokenBalances(address: string): Promise<AllTokenBalances> {
  // Check cache first
  const cached = tokenBalanceCache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.balances;
  }

  const chainKeys = Object.keys(chainConfig) as ChainKey[];
  const promises = chainKeys.map(async (chainKey) => {
    try {
      const balances = await fetchChainTokenBalances(chainKey, address);
      return { chainKey, balances, success: true };
    } catch (error) {
      return { chainKey, balances: null, success: false, error };
    }
  });

  const results = await Promise.allSettled(promises);
  const allBalances: AllTokenBalances = {} as AllTokenBalances;

  results.forEach((result, index) => {
    const chainKey = chainKeys[index];
    if (result.status === 'fulfilled' && result.value.success) {
      allBalances[chainKey] = result.value.balances!;
    } else {
      // Create empty balances for failed chains
      const emptyTokenBalances: ChainTokenBalances = {
        USDT: { value: 0, state: 'error' },
        USDC: { value: 0, state: 'error' },
        WBTC: { value: 0, state: 'error' },
        OP: { value: 0, state: 'error' },
        ARB: { value: 0, state: 'error' },
      };
      allBalances[chainKey] = {
        native: { value: 0, state: 'error' },
        tokens: emptyTokenBalances,
      };
    }
  });

  // Cache the results
  tokenBalanceCache.set(address, { balances: allBalances, timestamp: Date.now() });
  
  return allBalances;
}
