import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { chainConfig, ChainKey, chainOrder } from './chainConfig';

const DARK_TEXT = '#0a0a0a';
const BORDER = '#EAEAEA';
const PILL_BG = '#F4F4F4';
const PILL_SELECTED_BG = '#FC72FF';
const PILL_SELECTED_TEXT = '#ffffff';

export type PortfolioProps = {
  address: string;
  balances: Record<ChainKey, number>;
  onBack?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  if (v.length <= 12) return v;
  return `${v.slice(0, 6)}...${v.slice(-6)}`;
}

export default function Portfolio({ address, balances, onBack }: PortfolioProps) {
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  const orderedKeys = useMemo(() => chainOrder, []);

  const visibleKeys = useMemo(() => {
    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    return keys;
  }, [orderedKeys, selected]);

  return (
    <SafeAreaView style={styles.safeArea}>
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

      <ScrollView
        style={styles.filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterPill
          label="All"
          isSelected={selected === 'all'}
          onPress={() => setSelected('all')}
        />
        {orderedKeys.map((key) => (
          <FilterPill
            key={key}
            label={chainConfig[key].name}
            isSelected={selected === key}
            onPress={() => setSelected(key)}
          />
        ))}
      </ScrollView>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingVertical: 8 }}>
        {visibleKeys.map((key) => (
          <View key={key} style={styles.row}>
            <Text style={styles.chainName}>{chainConfig[key].name} ({chainConfig[key].symbol})</Text>
            <Text style={styles.chainBalance}>{balances[key]}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterPill({ label, isSelected, onPress }: { label: string; isSelected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.pill, isSelected && styles.pillSelected]}>
      <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{label}</Text>
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
  filters: {
    marginTop: 12,
    height: 48,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    flexGrow: 1,
  },
  list: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
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
}); 