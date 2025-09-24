import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '../theme';

// Named icon components
export const CoinsIcon = ({ color, size }: { color: string; size: number }) => (
  <FontAwesome6 name="coins" color={color} size={size} />
);

export const SendIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="send" color={color} size={size} />
);

export const WalletIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="wallet" color={color} size={size} />
);

export const EyeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="eye" color={color} size={size} />
);

export const KeyIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="key" color={color} size={size} />
);

export type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

export type HeaderIconProps = {
  icon: React.ComponentType<{ color: string; size: number }>;
  size?: IconSize;
  backgroundColor?: string;
  style?: ViewStyle;
};

const sizeConfig = {
  small: {
    container: 32,
    icon: 16,
  },
  medium: {
    container: 40,
    icon: 20,
  },
  large: {
    container: 60,
    icon: 28,
  },
  xlarge: {
    container: 64,
    icon: 32,
  },
};

export default function HeaderIcon({ 
  icon: IconComponent, 
  size = 'medium',
  backgroundColor,
  style 
}: HeaderIconProps) {
  const { colors } = useTheme();
  
  const config = sizeConfig[size];
  const iconSize = config.icon;
  const containerSize = config.container;
  
  const containerStyle: ViewStyle = {
    width: containerSize,
    height: containerSize,
    borderRadius: containerSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: backgroundColor || colors.primaryLight,
  };

  const renderIcon = () => {
    const iconProps = {
      color: colors.primary,
      size: iconSize,
    };

    return <IconComponent {...iconProps} />;
  };

  return (
    <View style={[containerStyle, style]}>
      {renderIcon()}
    </View>
  );
}
