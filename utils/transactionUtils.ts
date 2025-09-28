import { ethers } from 'ethers';
import { chainConfig } from '../config/chain';

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  networkFee: string;
}

export async function estimateGasForTransaction(
  provider: ethers.providers.JsonRpcProvider,
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<GasEstimate> {
  try {
    const amountInWei = ethers.utils.parseEther(amount);
    
    // Estimate gas for the transaction
    const gasEstimate = await provider.estimateGas({
      to: toAddress,
      value: amountInWei,
      from: fromAddress,
    });
    
    // Get fee data
    const feeData = await provider.getFeeData();
    
    // Use EIP-1559 if available, otherwise fall back to legacy gas pricing
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      const networkFee = gasEstimate.mul(feeData.maxFeePerGas);
      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei'),
        maxFeePerGas: feeData.maxFeePerGas.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toString(),
        networkFee: ethers.utils.formatEther(networkFee),
      };
    } else if (feeData.gasPrice) {
      const networkFee = gasEstimate.mul(feeData.gasPrice);
      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: ethers.utils.formatUnits(feeData.gasPrice, 'gwei'),
        networkFee: ethers.utils.formatEther(networkFee),
      };
    } else {
      throw new Error('Unable to get fee data from network');
    }
  } catch (error) {
    console.error('Gas estimation failed:', error);
    throw error;
  }
}

export async function sendNativeTransaction(
  wallet: ethers.Wallet,
  toAddress: string,
  amount: string,
  rpcUrl: string,
  gasEstimate?: GasEstimate
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
    
    // Use provided gas estimate or estimate fresh
    let gasLimit: ethers.BigNumber;
    if (gasEstimate) {
      gasLimit = ethers.BigNumber.from(gasEstimate.gasLimit);
    } else {
      gasLimit = await provider.estimateGas({
        to: toAddress,
        value: amountInWei,
        from: wallet.address,
      });
    }
    
    // Create the transaction object with EIP-1559 support
    const transaction: any = {
      to: toAddress,
      value: amountInWei,
      gasLimit: gasLimit,
    };
    
    // Use EIP-1559 if available, otherwise use legacy gas pricing
    if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
      transaction.maxFeePerGas = feeData.maxFeePerGas;
      transaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
      transaction.type = 2; // EIP-1559 transaction type
    } else if (feeData.gasPrice) {
      transaction.gasPrice = feeData.gasPrice;
    } else {
      throw new Error('Unable to get fee data from network');
    }
    
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
