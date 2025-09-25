import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme, spacing } from '../theme';
import ArbitrumEthIcon from './ArbitrumEthIcon';

export default function ArbitrumEthIconDemo() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        ArbitrumEthIcon Demo
      </Text>
      
      <View style={styles.iconRow}>
        <View style={styles.iconContainer}>
          <ArbitrumEthIcon size="small" />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Small</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <ArbitrumEthIcon size="medium" />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Medium</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <ArbitrumEthIcon size="large" />
          <Text style={[styles.label, { color: colors.textSecondary }]}>Large</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <ArbitrumEthIcon size="xlarge" />
          <Text style={[styles.label, { color: colors.textSecondary }]}>XLarge</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
