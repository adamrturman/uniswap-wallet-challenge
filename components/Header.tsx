import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';
import HeaderIcon from './HeaderIcon';

export type HeaderProps = {
  icon: string;
  text: React.ReactNode;
};

export default function Header({ icon, text }: HeaderProps) {
  return (
    <View style={styles.container}>
      <HeaderIcon icon={icon} size="large" />
      {text}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
});
