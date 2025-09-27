import { ethers } from 'ethers';
import { chainConfig } from '../config/chain';

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export async function sendNativeTransaction(
  wallet: ethers.Wallet,
  toAddress: string,
  amount: string,
  rpcUrl: string
): Promise<TransactionResult> {
  try {
    // Create a provider for the specified network
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    // Connect the wallet to the provider
    const connectedWallet = wallet.connect(provider);
    
    // Convert amount to wei
    const amountInWei = ethers.utils.parseEther(amount);
    
    // Get current fee data for gas estimation
    const feeData = await provider.getFeeData();
    
    // Create the transaction object
    const transaction = {
      to: toAddress,
      value: amountInWei,
      gasLimit: 21000, // Standard gas limit for ETH transfers
      gasPrice: feeData.gasPrice || undefined,
    };
    
    // Send the transaction
    const txResponse = await connectedWallet.sendTransaction(transaction);
    
    // Wait for the transaction to be mined
    const receipt = await txResponse.wait();
    
    return {
      success: true,
      hash: receipt?.transactionHash || txResponse.hash,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
