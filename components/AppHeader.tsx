import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, spacing } from '../theme';
import { NavigationType } from '../types';
import BackButton from './BackButton';
import LogoutButton from './LogoutButton';
import ThemeToggle from './ThemeToggle';

type AppHeaderProps = {
  showLogoutButton?: boolean;
  onLogout?: () => void;
};

export default function AppHeader({ 
  showLogoutButton = false, 
  onLogout 
}: AppHeaderProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        <BackButton 
          onPress={() => navigation.goBack()} 
        />
      </View>
      
      <View style={styles.rightSection}>
        <ThemeToggle />
        {showLogoutButton && onLogout && (
          <LogoutButton onPress={onLogout} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
