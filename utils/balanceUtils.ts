import { providers, utils, BigNumber, BigNumberish } from 'ethers';
import { ChainKey } from '../components/chainConfig';
import { chainConfig } from '../components/chainConfig';

export async function fetchBalancesForAllChains(address: string): Promise<Record<ChainKey, number>> {
  const balances: Record<ChainKey, number> = {
    ethereum: 0,
    optimism: 0,
    arbitrum: 0,
    polygon: 0,
    sepolia: 0
  };

  // Fetch balances for all chains in parallel
  const promises = Object.keys(chainConfig).map(async (chainKey) => {
    try {
      const provider = new providers.JsonRpcProvider(chainConfig[chainKey as ChainKey].rpcUrl);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = parseFloat(utils.formatEther(balanceWei));
      balances[chainKey as ChainKey] = balanceEth;
    } catch (error) {
      console.error(`Error fetching balance for ${chainKey}:`, error);
      balances[chainKey as ChainKey] = 0;
    }
  });

  await Promise.all(promises);
  return balances;
}
