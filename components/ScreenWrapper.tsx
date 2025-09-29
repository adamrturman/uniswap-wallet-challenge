import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import AppHeader from './AppHeader';

type ScreenWrapperProps = {
  children: React.ReactNode;
  showLogoutButton?: boolean;
  onLogout?: () => void;
};

export default function ScreenWrapper({ 
  children, 
  showLogoutButton = false, 
  onLogout 
}: ScreenWrapperProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader 
        showLogoutButton={showLogoutButton}
        onLogout={onLogout}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
