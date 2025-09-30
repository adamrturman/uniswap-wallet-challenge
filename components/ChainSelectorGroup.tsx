import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { chainConfig, ChainKey, chainOrder } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';

export type ChainSelectorGroupProps = {
  selected: 'all' | 'active' | ChainKey;
  onSelectionChange: (selection: 'all' | 'active' | ChainKey) => void;
};

export default function ChainSelectorGroup({ selected, onSelectionChange }: ChainSelectorGroupProps) {
  const { colors } = useTheme();

  const handleSelection = (selection: 'all' | 'active' | ChainKey) => {
    onSelectionChange(selection);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChainPill
          label="All"
          isSelected={selected === 'all'}
          onPress={() => handleSelection('all')}
          renderIcon={() => (
            <View style={styles.allChainsIcon}>
              <View style={styles.chainGrid}>
                <View style={styles.gridRow}>
                  <Image source={chainConfig.Ethereum.chainIcon} style={styles.gridIcon} />
                  <Image source={chainConfig.Optimism.chainIcon} style={styles.gridIcon} />
                </View>
                <View style={styles.gridRow}>
                  <Image source={chainConfig.Arbitrum.chainIcon} style={styles.gridIcon} />
                  <Image source={chainConfig.Polygon.chainIcon} style={styles.gridIcon} />
                </View>
              </View>
            </View>
          )}
        />
        
        <ChainPill
          label="Active"
          isSelected={selected === 'active'}
          onPress={() => handleSelection('active')}
          renderIcon={() => (
            <View style={styles.activeIcon}>
              <FontAwesome6 name="coins" size={16} color={colors.primary} />
            </View>
          )}
        />

        {chainOrder.map((key) => (
          <ChainPill
            key={key}
            label={chainConfig[key].name}
            isSelected={selected === key}
            onPress={() => handleSelection(key)}
            renderIcon={() => (
              <Image source={chainConfig[key].chainIcon} style={styles.chainIcon} />
            )}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function ChainPill({ label, isSelected, onPress, renderIcon }: { 
  label: string; 
  isSelected: boolean; 
  onPress: () => void; 
  renderIcon?: () => React.ReactNode 
}) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7} 
      style={[
        styles.pill, 
        { 
          backgroundColor: isSelected ? colors.pillSelectedBackground : colors.pillBackground,
          borderColor: isSelected ? colors.pillSelectedBackground : colors.border
        }
      ]}
    >
      <View style={styles.pillContent}>
        {renderIcon && renderIcon()}
        <Text style={[
          styles.pillText, 
          { color: isSelected ? colors.pillSelectedText : colors.text }
        ]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    paddingRight: spacing.xl,
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  chainIcon: {
    width: spacing.md,
    height: spacing.md,
    resizeMode: 'contain',
  },
  allChainsIcon: {
    width: spacing.md,
    height: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chainGrid: {
    width: spacing.md,
    height: spacing.md,
    justifyContent: 'space-between',
    padding: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: 1,
  },
  gridIcon: {
    width: 6,
    height: 6,
    resizeMode: 'contain',
  },
  activeIcon: {
    width: spacing.md,
    height: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
