import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { chainConfig, ChainKey, chainOrder } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';

export type ChainSelectorGroupProps = {
  selected: 'all' | ChainKey;
  onSelectionChange: (selection: 'all' | ChainKey) => void;
};

export default function ChainSelectorGroup({ selected, onSelectionChange }: ChainSelectorGroupProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.filtersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
        style={styles.filtersScrollView}
      >
        <AllButton
          isSelected={selected === 'all'}
          onPress={() => onSelectionChange('all')}
        />
        {chainOrder.map((key) => (
          <FilterPill
            key={key}
            label={chainConfig[key].name}
            isSelected={selected === key}
            onPress={() => onSelectionChange(key)}
            renderIcon={() => (
              <View>
                <Image source={chainConfig[key].chainIcon} style={styles.filterIcon} />
              </View>
            )}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function AllButton({ isSelected, onPress }: { isSelected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85} 
      style={[
        styles.pill, 
        { backgroundColor: isSelected ? colors.pillSelectedBackground : colors.pillBackground }
      ]}
    >
      <View style={styles.allButtonContent}>
        <View style={styles.chainGrid}>
          <View style={styles.gridRow}>
            <Image source={chainConfig.ethereum.chainIcon} style={styles.gridIcon} />
            <Image source={chainConfig.optimism.chainIcon} style={styles.gridIcon} />
          </View>
          <View style={styles.gridRow}>
            <Image source={chainConfig.arbitrum.chainIcon} style={styles.gridIcon} />
            <Image source={chainConfig.polygon.chainIcon} style={styles.gridIcon} />
          </View>
        </View>
        <Text style={[
          styles.pillText, 
          { color: isSelected ? colors.pillSelectedText : colors.text }
        ]}>All</Text>
      </View>
    </TouchableOpacity>
  );
}

function FilterPill({ label, isSelected, onPress, renderIcon }: { 
  label: string; 
  isSelected: boolean; 
  onPress: () => void; 
  renderIcon?: () => React.ReactNode 
}) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85} 
      style={[
        styles.pill, 
        { backgroundColor: isSelected ? colors.pillSelectedBackground : colors.pillBackground }
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
  filtersContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  filtersScrollView: {
    maxHeight: spacing.xxxl
  },
  filtersContent: {
    gap: spacing.sm,
    alignItems: 'center',
    minHeight: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    flexGrow: 1,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    height: spacing.xxl - spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
  },
  pillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  filterIcon: {
    width: spacing.lg,
    height: spacing.lg,
    resizeMode: 'contain',
  },
  allButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chainGrid: {
    width: spacing.lg + spacing.xs,
    height: spacing.lg + spacing.xs,
    justifyContent: 'space-between',
    padding: spacing.xs,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: spacing.xs,
  },
  gridIcon: {
    width: spacing.sm,
    height: spacing.sm,
    resizeMode: 'contain',
  },
});
