import { providers, utils, BigNumber, BigNumberish } from 'ethers';
import { ChainKey } from '../config/chain';
import { chainConfig } from '../config/chain';

export type BalanceLoadingState = 'loading' | 'loaded' | 'error';

export type ChainBalance = {
  value: number;
  state: BalanceLoadingState;
};

export type ChainBalances = Record<ChainKey, ChainBalance>;

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

export async function fetchChainBalances(address: string): Promise<ChainBalances> {
  console.log('🔍 Starting balance fetch for address:', address);
  const balancesWithState: ChainBalances = createInitialChainBalances();

  // Fetch balances for all chains in parallel
  const promises = [];
  for (const chainKey of Object.keys(chainConfig)) {
    const promise = (async () => {
      console.log(`🚀 Starting RPC call for ${chainKey}`);
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey as ChainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      console.log(`✅ ${chainKey} balance:`, balanceEth);
      return { chainKey: chainKey as ChainKey, balance: balanceEth };
    })();
    promises.push(promise);
  }

  console.log('⏳ Waiting for all RPC calls to complete...');
  const results = await Promise.allSettled(promises);
  console.log('📊 RPC results:', results);
  
  results.forEach((result, index) => {
    const chainKey = Object.keys(chainConfig)[index] as ChainKey;
    if (result.status === 'fulfilled') {
      console.log(`✅ Setting ${result.value.chainKey} to loaded state with balance:`, result.value.balance);
      balancesWithState[result.value.chainKey] = { value: result.value.balance, state: 'loaded' };
    } else {
      console.error(`❌ Error fetching balance for ${chainKey}:`, result.reason);
      balancesWithState[chainKey] = { value: 0, state: 'error' };
    }
  });

  console.log('🎯 Final balances state:', balancesWithState);
  return balancesWithState;
}
