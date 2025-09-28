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
      console.error(`Error fetching balance for ${chainKey}:`, result.reason);
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


export async function fetchChainBalances(address: string, forceRefresh: boolean = false): Promise<ChainBalances> {
  console.log('🔍 Starting balance fetch for address:', address);
  
  // Check cache first
  if (!forceRefresh) {
    const cached = balanceCache.get(address);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached balances for address:', address);
      return cached.balances;
    }
  }

  // Start all RPC calls in parallel
  const chainKeys = Object.keys(chainConfig) as ChainKey[];
  const promises = chainKeys.map(async (chainKey) => {
    try {
      console.log(`🚀 Starting RPC call for ${chainKey}`);
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      console.log(`✅ ${chainKey} balance:`, balanceEth);
      
      return { chainKey, balance: balanceEth, success: true };
    } catch (error) {
      console.error(`❌ Error fetching balance for ${chainKey}:`, error);
      return { chainKey, balance: 0, success: false, error };
    }
  });

  // Wait for ALL responses (success and errors)
  const results = await Promise.allSettled(promises);
  console.log('📊 All RPC calls completed:', results);
  
  // Build final balances state with all results
  const balancesWithState: ChainBalances = createInitialChainBalances();
  
  results.forEach((result, index) => {
    const chainKey = chainKeys[index];
    if (result.status === 'fulfilled') {
      const { success, balance, error } = result.value;
      if (success) {
        console.log(`✅ ${chainKey}: ${balance} (loaded)`);
        balancesWithState[chainKey] = { value: balance, state: 'loaded' };
      } else {
        console.log(`❌ ${chainKey}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
        balancesWithState[chainKey] = { value: 0, state: 'error' };
      }
    } else {
      console.log(`❌ ${chainKey}: Promise rejected - ${result.reason}`);
      balancesWithState[chainKey] = { value: 0, state: 'error' };
    }
  });

  // Cache the results
  balanceCache.set(address, { balances: balancesWithState, timestamp: Date.now() });
  
  console.log('🎯 Final balances state:', balancesWithState);
  return balancesWithState;
}
