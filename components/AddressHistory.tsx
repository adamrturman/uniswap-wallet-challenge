import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing, typography } from '../theme';
import { truncateAddress } from '../utils/addressUtils';
import { useAddressHistory } from '../hooks/useAddressHistory';

type AddressHistoryProps = {
  onAddressSelect: (address: string) => void;
  onCopyAddress: (address: string) => void;
};

export default function AddressHistory({
  onAddressSelect,
  onCopyAddress,
}: AddressHistoryProps) {
  const { colors } = useTheme();
  const { addressHistory, removeAddressFromHistory } = useAddressHistory();
  const [isExpanded, setIsExpanded] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopyAddress = (address: string) => {
    try {
      onCopyAddress(address);
      setCopySuccess(address);
      setTimeout(() => {
        setCopySuccess(null);
      }, 1000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  if (addressHistory.length === 0) {
    return null;
  }

  return (
    <View style={styles.historyContainer}>
      <TouchableOpacity
        style={styles.historyHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.historyTitleContainer}>
          <Text style={[styles.historyTitle, { color: colors.textSecondary }]}>
            Recent Addresses
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textSecondary}
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <FlatList
          data={addressHistory}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <TouchableOpacity
                style={styles.historyItemContent}
                onPress={() => onAddressSelect(item)}
              >
                <Text
                  style={[
                    styles.historyItemText,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {truncateAddress(item)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyAddress(item)}
              >
                <Ionicons
                  name={
                    copySuccess === item ? 'checkmark-circle' : 'copy-outline'
                  }
                  size={16}
                  color={
                    copySuccess === item ? colors.success : colors.textSecondary
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAddressFromHistory(item)}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  historyContainer: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 300,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  chevronIcon: {
    marginLeft: spacing.xs,
  },
  historyList: {
    maxHeight: 250,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemText: {
    fontSize: typography.sizes.sm,
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
