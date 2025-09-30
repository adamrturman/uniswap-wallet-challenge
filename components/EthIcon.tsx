import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

export type EthIconSize = 'small' | 'medium' | 'large' | 'xlarge';

export type EthIconProps = {
  size?: EthIconSize;
  style?: ViewStyle;
};

import ethIcon from '../assets/eth-diamond-black.png';

const sizeConfig = {
  small: {
    container: 32,
    icon: 28,
  },
  medium: {
    container: 40,
    icon: 36,
  },
  large: {
    container: 60,
    icon: 54,
  },
  xlarge: {
    container: 80,
    icon: 72,
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function EthIcon({ size = 'medium', style }: EthIconProps) {
  const config = sizeConfig[size];

  const containerStyle: ViewStyle = {
    ...styles.container,
    width: config.container,
    height: config.container,
    borderRadius: config.container / 2,
    backgroundColor: '#627EEA',
  };

  const imageStyle = {
    width: config.icon,
    height: config.icon,
  };

  return (
    <View style={[containerStyle, style]}>
      <Image source={ethIcon} style={imageStyle} resizeMode="contain" />
    </View>
  );
}
