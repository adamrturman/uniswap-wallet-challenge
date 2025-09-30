import { ImageSourcePropType } from 'react-native';
import { ChainKey } from '../config/chain';
import { GasEstimate } from '../utils/transactionUtils';

export type IconComponent = React.ComponentType<{ style?: any }>;
export type IconSource = ImageSourcePropType;
export type TokenIcon = {
  baseIcon: IconComponent | IconSource;
  overlayIcon?: IconSource;
};
export type ChainIcon = IconSource;

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
