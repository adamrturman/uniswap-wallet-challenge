import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { chainConfig, ChainKey, chainOrder } from './chainConfig';

const DARK_TEXT = '#0a0a0a';
const BORDER = '#EAEAEA';
const PILL_BG = '#F4F4F4';
const PILL_SELECTED_BG = '#FC72FF';
const PILL_SELECTED_TEXT = '#ffffff';
const ICON_BG = '#F4F4F4';
const ETH_BG = '#5B8DEF';

export type PortfolioProps = {
  address: string;
  balances: Record<ChainKey, number>;
  onBack?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 5)}...${v.slice(-5)}`;
}

export default function Portfolio({ address, balances, onBack }: PortfolioProps) {
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  const orderedKeys = useMemo(() => chainOrder, []);

  const visibleKeys = useMemo(() => {
    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    return keys;
  }, [orderedKeys, selected]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityRole="button" accessibilityLabel="Go back">
          <Feather name="chevron-left" size={28} color={DARK_TEXT} />
        </TouchableOpacity>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.addressCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>👛</Text></View>
        <Text style={styles.addressText}>{truncateAddress(address)}</Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersScrollView}
        >
        <AllButton
          isSelected={selected === 'all'}
          onPress={() => setSelected('all')}
        />
        {orderedKeys.map((key) => (
          <FilterPill
            key={key}
            label={chainConfig[key].name}
            isSelected={selected === key}
            onPress={() => setSelected(key)}
            renderIcon={() => (
              <View>
                <Image source={chainConfig[key].chainIcon} style={styles.filterIcon} />
              </View>
            )}
          />
        ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.list}>
        {visibleKeys.map((key) => (
          <View key={key} style={styles.row}>
            <View style={styles.rowLeft}>
              <Image 
                source={chainConfig[key].nativeTokenIcon} 
                style={styles.tokenIcon} 
              />
              <Text style={styles.chainName}>{chainConfig[key].name} ({chainConfig[key].symbol})</Text>
            </View>
            <Text style={styles.chainBalance}>{balances[key]}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function AllButton({ isSelected, onPress }: { isSelected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.pill, isSelected && styles.pillSelected]}>
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
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>All</Text>
      </View>
    </TouchableOpacity>
  );
}

function FilterPill({ label, isSelected, onPress, renderIcon }: { label: string; isSelected: boolean; onPress: () => void; renderIcon?: () => React.ReactNode }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.pill, isSelected && styles.pillSelected]}>
      <View style={styles.pillContent}>
        {renderIcon && renderIcon()}
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  addressCard: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
  },
  addressText: {
    color: DARK_TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  filtersContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  filtersScrollView: {
    maxHeight: 48,
  },
  filtersContent: {
    gap: 8,
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chainName: {
    color: DARK_TEXT,
    fontSize: 16,
  },
  chainBalance: {
    color: DARK_TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  pill: {
    backgroundColor: PILL_BG,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillSelected: {
    backgroundColor: PILL_SELECTED_BG,
  },
  pillText: {
    color: DARK_TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  pillTextSelected: {
    color: PILL_SELECTED_TEXT,
  },
  filterIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  allButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chainGrid: {
    width: 24,
    height: 24,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  gridIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  }
});