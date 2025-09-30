import { ethers } from 'ethers';

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

export interface ERC20TransferParams {
  tokenAddress: string;
  toAddress: string;
  amount: string;
  decimals?: number;
}

export async function estimateGasForTransaction(
  provider: ethers.providers.JsonRpcProvider,
  fromAddress: string,
  toAddress: string,
  amount: string,
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
  gasEstimate?: GasEstimate,
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

// ERC20 ABI for token operations
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];





export async function sendERC20Transaction(
  wallet: ethers.Wallet,
  transferParams: ERC20TransferParams,
  rpcUrl: string,
  gasEstimate?: GasEstimate,
): Promise<TransactionResult> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const connectedWallet = wallet.connect(provider);
    const tokenContract = new ethers.Contract(
      transferParams.tokenAddress,
      ERC20_ABI,
      connectedWallet,
    );

    // Get token decimals if not provided
    let tokenDecimals = transferParams.decimals;
    if (!tokenDecimals) {
      tokenDecimals = await tokenContract.decimals();
    }

    const amountInWei = ethers.utils.parseUnits(
      transferParams.amount,
      tokenDecimals,
    );

    // Prepare transaction options with gas settings
    const txOptions: any = {};

    if (gasEstimate) {
      txOptions.gasLimit = gasEstimate.gasLimit;

      // Use EIP-1559 if available
      if (gasEstimate.maxFeePerGas && gasEstimate.maxPriorityFeePerGas) {
        txOptions.maxFeePerGas = gasEstimate.maxFeePerGas;
        txOptions.maxPriorityFeePerGas = gasEstimate.maxPriorityFeePerGas;
        txOptions.type = 2; // EIP-1559 transaction type
      } else if (gasEstimate.gasPrice) {
        txOptions.gasPrice = ethers.utils.parseUnits(
          gasEstimate.gasPrice,
          'gwei',
        );
      }
    }

    const tx = await tokenContract.transfer(
      transferParams.toAddress,
      amountInWei,
      txOptions,
    );
    const receipt = await tx.wait();

    return {
      success: true,
      hash: receipt?.transactionHash || tx.hash,
    };
  } catch (error) {
    console.error('ERC20 transfer failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function estimateGasForERC20Transfer(
  provider: ethers.providers.JsonRpcProvider,
  tokenAddress: string,
  fromAddress: string,
  toAddress: string,
  amount: string,
  decimals?: number,
): Promise<GasEstimate> {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider,
    );

    // Get token decimals if not provided
    let tokenDecimals = decimals;
    if (!tokenDecimals) {
      tokenDecimals = await tokenContract.decimals();
    }

    const amountInWei = ethers.utils.parseUnits(amount, tokenDecimals);

    // Estimate gas for the transfer
    const gasEstimate = await tokenContract.estimateGas.transfer(
      toAddress,
      amountInWei,
      {
        from: fromAddress,
      },
    );

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
    console.error('ERC20 gas estimation failed:', error);
    throw error;
  }
}
