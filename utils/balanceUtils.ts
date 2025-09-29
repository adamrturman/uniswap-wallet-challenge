import { providers, utils, BigNumber, BigNumberish } from 'ethers';
import { ChainKey } from '../config/chain';
import { chainConfig } from '../config/chain';

export type BalanceLoadingState = 'loading' | 'loaded' | 'error';

export type ChainBalance = {
  value: number;
  state: BalanceLoadingState;
};

export type ChainBalances = Record<ChainKey, ChainBalance>;

// Cache for balance data to reduce RPC calls
const balanceCache = new Map<string, { balances: ChainBalances; timestamp: number }>();
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
