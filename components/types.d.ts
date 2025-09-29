import { ImageSourcePropType } from 'react-native';

// Stricter types for icons
export type IconComponent = React.ComponentType<{ style?: any }>;
export type IconSource = ImageSourcePropType;
export type TokenIcon = {
  baseIcon: IconComponent | IconSource;
  overlayIcon?: IconSource;
};
export type ChainIcon = IconSource;