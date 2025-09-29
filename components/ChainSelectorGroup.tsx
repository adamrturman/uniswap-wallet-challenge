import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Modal, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { chainConfig, ChainKey, chainOrder } from '../config/chain';
import { useTheme, spacing, typography } from '../theme';

export type ChainSelectorGroupProps = {
  selected: 'all' | 'active' | ChainKey;
  onSelectionChange: (selection: 'all' | 'active' | ChainKey) => void;
};

export default function ChainSelectorGroup({ selected, onSelectionChange }: ChainSelectorGroupProps) {
  const { colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const getSelectedDisplay = () => {
    if (selected === 'all') {
      return {
        label: 'All Chains',
        icon: null,
        isAll: true
      };
    }
    if (selected === 'active') {
      return {
        label: 'Active Balances',
        icon: null,
        isActive: true
      };
    }
    return {
      label: chainConfig[selected].name,
      icon: chainConfig[selected].chainIcon,
      isAll: false
    };
  };

  const selectedDisplay = getSelectedDisplay();

  const handleSelection = (selection: 'all' | 'active' | ChainKey) => {
    onSelectionChange(selection);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selectorButton, { backgroundColor: colors.pillBackground }]}
        onPress={() => setIsDropdownOpen(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
          {selectedDisplay.isAll ? (
            <View style={styles.allChainsIcon}>
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
            </View>
          ) : selectedDisplay.isActive ? (
            <View style={styles.activeIcon}>
              <FontAwesome6 name="coins" size={16} color={colors.text} />
            </View>
          ) : (
            <Image source={selectedDisplay.icon} style={styles.chainIcon} />
          )}
          <Text style={[styles.selectorText, { color: colors.text }]}>
            {selectedDisplay.label}
          </Text>
        </View>
        <Text style={[styles.dropdownArrow, { color: colors.textSecondary }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.backgroundSecondary, shadowColor: colors.shadow }]}>
            <View style={styles.dropdownContent}>
              <ChainOption
                label="All Chains"
                isSelected={selected === 'all'}
                onPress={() => handleSelection('all')}
                renderIcon={() => (
                  <View style={styles.allChainsIcon}>
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
                  </View>
                )}
              />
              <ChainOption
                label="Active Balances"
                isSelected={selected === 'active'}
                onPress={() => handleSelection('active')}
                renderIcon={() => (
                  <View style={styles.activeIcon}>
                    <FontAwesome6 name="coins" size={16} color="#FAD6FF" />
                  </View>
                )}
              />
              {chainOrder.map((key) => (
                <ChainOption
                  key={key}
                  label={chainConfig[key].name}
                  isSelected={selected === key}
                  onPress={() => handleSelection(key)}
                  renderIcon={() => (
                    <Image source={chainConfig[key].chainIcon} style={styles.optionIcon} />
                  )}
                />
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function ChainOption({ label, isSelected, onPress, renderIcon }: { 
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
        styles.optionItem, 
        { backgroundColor: isSelected ? colors.pillSelectedBackground : 'transparent' }
      ]}
    >
      <View style={styles.optionContent}>
        {renderIcon && renderIcon()}
        <Text style={[
          styles.optionText, 
          { color: isSelected ? colors.pillSelectedText : colors.text }
        ]}>{label}</Text>
      </View>
      {isSelected && (
        <Text style={[styles.checkmark, { color: colors.pillSelectedText }]}>✓</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  selectorText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  chainIcon: {
    width: spacing.lg,
    height: spacing.lg,
    resizeMode: 'contain',
  },
  allChainsIcon: {
    width: spacing.lg,
    height: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chainGrid: {
    width: spacing.lg,
    height: spacing.lg,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  dropdownContainer: {
    borderRadius: 16,
    padding: spacing.sm,
    minWidth: 280,
    maxWidth: 320,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownContent: {
    gap: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  optionText: {
    fontSize: typography.sizes.base,
    fontWeight: '300',
  },
  optionIcon: {
    width: spacing.lg,
    height: spacing.lg,
    resizeMode: 'contain',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  activeIcon: {
    width: spacing.lg,
    height: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
