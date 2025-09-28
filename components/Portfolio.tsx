import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Wallet } from 'ethers';
import { Ionicons } from '@expo/vector-icons';
import { ChainKey, chainOrder } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';
import { NavigationType } from '../types';
import Button from './Button';
import BackButton from './BackButton';
import Header from './Header';
import ChainSelectorGroup from './ChainSelectorGroup';
import TokenBalance from './TokenBalance';
import LogoutButton from './LogoutButton';
import { ChainBalances } from '../utils/balanceUtils';

export type PortfolioProps = {
  address: string;
  balances: ChainBalances;
  wallet?: Wallet | null;
  onRefetchBalances?: (forceRefresh?: boolean) => Promise<void>;
  onLogout?: () => void;
};

function truncateAddress(addr: string) {
  const v = addr.trim();
  return `${v.slice(0, 5)}...${v.slice(-5)}`;
}

export default function Portfolio({ address, balances, wallet, onRefetchBalances, onLogout }: PortfolioProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationType>();
  const [selected, setSelected] = useState<'all' | ChainKey>('all');

  // Removed automatic balance refetching on focus to prevent 429 errors
  // Users can manually refresh using the refresh button if needed

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
        <View style={styles.headerActions}>
          {onRefetchBalances && (
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: colors.backgroundSecondary }]}
              onPress={() => onRefetchBalances(true)}
            >
              <Ionicons name="refresh" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          {wallet && onLogout && (
            <LogoutButton onPress={onLogout} />
          )}
        </View>
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

      <ChainSelectorGroup
        selected={selected}
        onSelectionChange={setSelected}
      />

      <ScrollView style={styles.list}>
        {visibleKeys.map((key) => (
          <TokenBalance
            key={key}
            chainKey={key}
            balance={balances[key]}
          />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  refreshButton: {
    padding: spacing.sm,
    borderRadius: 8,
    marginRight: spacing.sm,
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
  list: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  sendButtonContainer: {
    // Spacing will be applied via theme values
  },
});