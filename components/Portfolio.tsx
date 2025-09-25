import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Wallet } from 'ethers';
import { chainConfig, ChainKey, chainOrder } from './chainConfig';
import { useTheme, spacing, typography, radius } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';

export type PortfolioProps = {
  address: string;
  balances: Record<ChainKey, number>;
  wallet?: Wallet | null;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 5)}...${v.slice(-5)}`;
}

export default function Portfolio({ address, balances, wallet }: PortfolioProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  const handleSendTransaction = () => {
    if (!wallet) {
      Alert.alert('Error', 'Wallet not available');
      return;
    }

    // Navigate to EnterRecipientAddress screen
    navigation.navigate('EnterRecipientAddress');
  };

  const orderedKeys = useMemo(() => chainOrder, []);

  const visibleKeys = useMemo(() => {
    const keys = selected === 'all' ? orderedKeys : orderedKeys.filter((k) => k === selected);
    return keys;
  }, [orderedKeys, selected]);

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <BackButton onPress={() => navigation.goBack()} />
        <View style={{ width: spacing.xxl + spacing.sm }} />
      </View>

      <View style={styles.addressCard}>
        <Header
          icon="wallet"
          text={
            <Text style={[styles.addressText, { color: colors.text }]}>
              {truncateAddress(address)}
            </Text>
          }
        />
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
            onPress={handleSendTransaction}
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  addressCard: {
    marginTop: 0,
    marginHorizontal: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  addressText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xxl,
  },
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
  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chainName: {
    fontSize: typography.sizes.base,
  },
  chainBalance: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
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
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
  tokenIcon: {
    width: spacing.xxl,
    height: spacing.xxl,
    resizeMode: 'contain',
  },
  allButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chainGrid: {
    width: spacing.xxl,
    height: spacing.xxl,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  gridIcon: {
    width: spacing.sm + 2,
    height: spacing.sm + 2,
    resizeMode: 'contain',
  },
  sendButtonContainer: {
    // Spacing will be applied via theme values
  },
});