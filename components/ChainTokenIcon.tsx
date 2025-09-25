import React from 'react';
import { StyleSheet, View, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import ethIcon from '../assets/eth-diamond-black.png';
import { useTheme } from '../theme';

export type ChainTokenIconProps = {
  style?: ViewStyle;
  overlayIcon?: ImageSourcePropType;
};


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ethIcon: {
    position: 'absolute',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ChainTokenIcon({ 
  style,
  overlayIcon
}: ChainTokenIconProps) {
  const { colors } = useTheme();
  
  const containerStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.chainTokenBackground,
  };

  const overlayComponent = overlayIcon ? (
    <View
      style={[
        styles.overlayContainer,
        {
          width: 16,
          height: 16,
        }
      ]}
    >
      <Image
        source={overlayIcon}
        style={{
          width: 16,
          height: 16,
        }}
        resizeMode="contain"
      />
    </View>
  ) : null;

  return (
    <View style={[styles.container, containerStyle, style]}>
      {/* Ethereum icon as background */}
      <Image
        source={ethIcon}
        style={[
          styles.ethIcon,
          {
            width: 36,
            height: 36,
          }
        ]}
        resizeMode="contain"
      />
      
      {/* Overlay icon */}
      {overlayComponent}
    </View>
  );
}
