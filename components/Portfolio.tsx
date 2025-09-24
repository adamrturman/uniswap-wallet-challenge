import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { Wallet } from 'ethers';
import { chainConfig, ChainKey, chainOrder } from './chainConfig';
import { useTheme, spacing } from '../theme';
import Button from './Button';
import BackButton from './BackButton';


export type PortfolioProps = {
  address: string;
  balances: Record<ChainKey, number>;
  wallet?: Wallet | null;
  onBack?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 5)}...${v.slice(-5)}`;
}

export default function Portfolio({ address, balances, wallet, onBack }: PortfolioProps) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  const orderedKeys = useMemo(() => chainOrder, []);

  const visibleKeys = useMemo(() => {
    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    return keys;
  }, [orderedKeys, selected]);

  console.log('balances', balances);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <BackButton onPress={onBack} />
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.addressCard}>
        <View style={[styles.avatar, { backgroundColor: colors.backgroundSecondary }]}><Text style={styles.avatarText}>👛</Text></View>
        <Text style={[styles.addressText, { color: colors.text }]}>{truncateAddress(address)}</Text>
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
              <Text style={[styles.chainName, { color: colors.text }]}>{chainConfig[key].name}</Text>
            </View>
            <Text style={[styles.chainBalance, { color: colors.text }]}>
              {Number(balances[key]).toFixed(4)} {chainConfig[key].symbol}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Send button - only show if wallet is available */}
      {wallet && (
        <View style={[styles.sendButtonContainer, { 
          paddingHorizontal: spacing.xl, 
          paddingBottom: spacing.xl * 2, 
          paddingTop: spacing.xl 
        }]}>
          <Button
            title="Send"
            onPress={() => {
              // TODO: Implement send functionality
              console.log('Send button pressed');
            }}
            variant="primary"
            fullWidth
          />
        </View>
      )}
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

function FilterPill({ label, isSelected, onPress, renderIcon }: { label: string; isSelected: boolean; onPress: () => void; renderIcon?: () => React.ReactNode }) {
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
  safeArea: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
  },
  addressText: {
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
    fontSize: 16,
  },
  chainBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  pill: {
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
  pillText: {
    fontSize: 14,
    fontWeight: '500',
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
  },
  sendButtonContainer: {
    // Spacing will be applied via theme values
  },
});