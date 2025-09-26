import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

export default function Skeleton() {
  const { colors } = useTheme();

  return (
    <View 
      style={[
        styles.skeleton, 
        { 
          backgroundColor: colors.border,
        }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    width: 80,
    height: 16,
    borderRadius: 4,
    opacity: 0.6,
  },
});
