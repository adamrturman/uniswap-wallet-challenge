import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme';

export type HeaderProps = {
  icon: React.ReactNode;
  text: React.ReactNode;
};

export default function Header({ icon, text }: HeaderProps) {
  return (
    <View style={styles.container}>
      {icon}
      {text}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
  },
});
