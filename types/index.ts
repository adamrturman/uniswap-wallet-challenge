// ============================================================================
// CORE TYPES - Blockchain & Network
// ============================================================================

export type ChainKey =
  | 'Ethereum'
  | 'Polygon'
  | 'Optimism'
  | 'Arbitrum'
  | 'Sepolia';

export type TokenKey =
  | 'ETH'
  | 'POL'
  | 'USDT'
  | 'USDC'
  | 'WBTC'
  | 'OP'
  | 'ARB'
  | 'LINK';

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export type ScreenName =
  | 'Landing'
  | 'EnterWatchAddress'
  | 'EnterRecoveryPhrase'
  | 'EnterRecipientAddress'
  | 'SelectToken'
  | 'EnterAmountToSend'
  | 'Portfolio'
  | 'TransactionConfirmation';

export type NavigationType = {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
};

// ============================================================================
// ICON TYPES
// ============================================================================

import { ImageSourcePropType } from 'react-native';

export type IconComponent = React.ComponentType<{ style?: any }>;
export type IconSource = ImageSourcePropType;
export type IconType = ImageSourcePropType | React.ComponentType<any>;

export type TokenIcon = {
  baseIcon: IconComponent | IconSource;
  overlayIcon?: IconSource;
};

export type ChainIcon = IconSource;

// ============================================================================
// TOKEN & CHAIN CONFIGURATION TYPES
// ============================================================================

export type Token = {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress: string;
  icon: {
    baseIcon: IconType;
    overlayIcon?: IconType;
  };
};

export type ChainTokenConfig = Partial<Record<TokenKey, Token>>;

export type ChainConfig = {
  name: string;
  nativeTokenDisplay: string;
  rpcUrl: string;
  symbol: string;
  chainIcon: IconType;
  explorerUrl: string;
  chainId: number;
  nativeTokenIcon: {
    baseIcon: IconType;
    overlayIcon?: IconType;
  };
  supportedErc20s: Token[];
};

// ============================================================================
// BALANCE TYPES
// ============================================================================

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

export type AllTokenBalances = Record<
  ChainKey,
  {
    native: ChainBalance;
    tokens: ChainTokenBalances;
  }
>;

export type TokenItem = {
  chainKey: ChainKey;
  tokenKey: TokenKey;
  name: string;
  symbol: string;
  balance: number;
  tokenIcon: TokenIcon;
};

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

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

export type TransactionStatus = 'review' | 'pending' | 'success' | 'error';

export interface TransactionData {
  from: string;
  to: string;
  amount: string;
  token: {
    symbol: string;
    chainKey: ChainKey;
  };
  gasEstimate?: GasEstimate;
  timestamp: string;
}

// ============================================================================
// PRICE TYPES
// ============================================================================

export type TokenPrice = {
  symbol: string;
  price: number;
  lastUpdated: number;
};

export type PriceState = {
  prices: Record<string, TokenPrice>;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
};

// ============================================================================
// CONTEXT TYPES
// ============================================================================

export interface AppContextType {
  // State
  wallet: any; // ethers.Wallet
  watchedAddress: string;
  balances: AllTokenBalances | null;
  recipientAddress: string;
  selectedToken: {
    chainKey: ChainKey;
    tokenKey: TokenKey;
    balance: number;
    symbol: string;
  } | null;
  transactionAmount: string;
  transactionHash: string;
  transactionGasEstimate: GasEstimate | null;

  // Setters
  setWallet: (wallet: any) => void;
  setWatchedAddress: (address: string) => void;
  setBalances: (balances: AllTokenBalances | null) => void;
  setRecipientAddress: (address: string) => void;
  setSelectedToken: (
    token: {
      chainKey: ChainKey;
      tokenKey: TokenKey;
      balance: number;
      symbol: string;
    } | null,
  ) => void;
  setTransactionAmount: (amount: string) => void;
  setTransactionHash: (hash: string) => void;
  setTransactionGasEstimate: (gasEstimate: GasEstimate | null) => void;

  // Event Handlers
  handleWatchAddressContinue: (
    address: string,
    watchedAddressBalances: AllTokenBalances,
  ) => Promise<void>;
  handleRecoveryPhraseContinue: (phrase: string) => Promise<void>;
  handleRecipientAddressContinue: (address: string) => void;
  handleTokenSelect: (
    chainKey: ChainKey,
    tokenKey: TokenKey,
    balance: number,
    symbol: string,
  ) => void;
  handleAmountContinue: (amount: string) => void;
  handleTransactionExecute: (
    amount: string,
    gasEstimate?: GasEstimate,
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
  refreshBalances: () => Promise<void>;
  handleLogout: (navigation: NavigationType) => void;
}

export interface TransactionContextType {
  isModalVisible: boolean;
  transactionStatus: TransactionStatus;
  transactionData?: TransactionData;
  showTransactionModal: (params: {
    status: TransactionStatus;
    transactionData?: TransactionData;
  }) => void;
  hideTransactionModal: () => void;
  updateTransactionStatus: (params: {
    status: TransactionStatus;
    transactionData?: TransactionData;
  }) => void;
  approveTransaction?: () => Promise<void>;
  setApproveTransaction: (callback: (() => Promise<void>) | undefined) => void;
}

export interface PriceContextType {
  priceState: PriceState;
  getTokenPrice: (symbol: string) => number | null;
  getTokenPriceFormatted: (symbol: string) => string;
  getTokenUsdValue: (symbol: string, amount: number) => number | null;
  getTokenUsdValueFormatted: (symbol: string, amount: number) => string;
  refreshPrices: () => Promise<void>;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface TransactionModalProps {
  visible: boolean;
  status: TransactionStatus;
  transactionData?: TransactionData;
  onClose: () => void;
  onExecuteTransaction?: () => Promise<void>;
}

export interface AddressHistoryProps {
  onAddressSelect: (address: string) => void;
  onCopyAddress: (address: string) => void;
}

export interface TransactionStatusIconProps {
  status: TransactionStatus;
}

export interface TransactionStatusContentProps {
  status: TransactionStatus;
}

export interface TransactionDetailsProps {
  transactionData: TransactionData;
  onCopyAddress?: (address: string) => void;
}

export interface TransactionActionsProps {
  status: TransactionStatus;
  onApprove?: () => Promise<void>;
  onClose: () => void;
  isExecuting?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'disabled';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  activeOpacity?: number;
  fullWidth?: boolean;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isValid: boolean;
  errorMessage: string;
  multiline?: boolean;
  minHeight?: number;
  maxHeight?: number;
  keyboardType?: 'default' | 'visible-password';
  returnKeyType?: 'done' | 'next';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  textAlignVertical?: 'top' | 'center' | 'bottom';
}

// ============================================================================
// RE-EXPORTS FOR BACKWARD COMPATIBILITY
// ============================================================================

// Re-export commonly used types for easy importing
export type {
  ChainKey,
  TokenKey,
  ScreenName,
  NavigationType,
  TransactionStatus,
  TransactionData,
  GasEstimate,
  AllTokenBalances,
  TokenItem,
  AppContextType,
  TransactionContextType,
  PriceContextType,
} from './index';
