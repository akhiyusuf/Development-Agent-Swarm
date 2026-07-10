import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, space, touchTarget } from '../theme/tokens';
import { Text } from './Typography';
import { Stepper } from './Stepper';

export interface HouseholdUnit {
  id: string;
  label: string; // "1 ladle", "half plate", "1 wrap", "1 cup"...
  gramsPerUnit: number | null; // null => no defined conversion yet (§4.3 disabled fallback)
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  units: HouseholdUnit[];
  selectedUnitId: string | undefined;
  quantity: number;
  onSelectUnit: (unitId: string) => void;
  onChangeQuantity: (qty: number) => void;
  onUseAdvancedGrams: () => void;
  advancedGrams?: number;
  advancedMode?: boolean;
  advancedError?: string;
}

/**
 * §4.3 Household-unit portion picker — the default serving-size control for
 * prepared-meal logging (not a gram-weight stepper). Selected chip filled
 * terracotta+white; units with no gram conversion render disabled and the
 * picker falls back to gram entry with an explaining caption. Barcode entry
 * is intentionally absent (deferred per sitemap v1 scope, §4.3).
 */
export function PortionUnitPicker({
  units,
  selectedUnitId,
  quantity,
  onSelectUnit,
  onChangeQuantity,
  onUseAdvancedGrams,
  advancedMode,
}: Props) {
  const selectedUnit = units.find((u) => u.id === selectedUnitId);
  const noConversion = selectedUnit && selectedUnit.gramsPerUnit === null;

  return (
    <View style={{ gap: space[12] }}>
      <View style={styles.chipRow}>
        {units.map((u) => {
          const disabled = u.gramsPerUnit === null;
          const selected = u.id === selectedUnitId;
          return (
            <Pressable
              key={u.id}
              disabled={disabled && !selected}
              onPress={() => onSelectUnit(u.id)}
              style={[
                styles.unitChip,
                disabled
                  ? { backgroundColor: color.neutral.warmgray400, borderColor: color.neutral.warmgray400 }
                  : selected
                  ? { backgroundColor: color.primary.terracotta, borderColor: color.primary.terracotta }
                  : { borderColor: color.neutral.warmgray400 },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
            >
              <Ionicons
                name={u.icon}
                size={20}
                color={disabled ? color.neutral.warmgray700 : selected ? color.neutral.white : color.neutral.ink}
              />
              <Text
                variant="caption"
                colorToken={disabled ? color.neutral.warmgray700 : selected ? color.neutral.white : color.neutral.ink}
                center
              >
                {u.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {noConversion ? (
        <Text variant="caption" colorToken={color.neutral.warmgray700}>
          Exact weight only for this item — no household-unit conversion defined yet.
        </Text>
      ) : selectedUnit && !advancedMode ? (
        <View style={styles.qtyRow}>
          <Text variant="body">Quantity</Text>
          <Stepper value={quantity} onChange={onChangeQuantity} min={0.5} max={20} step={0.5} />
        </View>
      ) : null}

      <Pressable onPress={onUseAdvancedGrams} style={styles.advancedLink} accessibilityRole="button">
        <Text variant="caption" colorToken={color.primary.terracotta} style={{ textDecorationLine: 'underline' }}>
          {advancedMode ? 'Use household unit instead' : 'Advanced / exact grams'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[8] },
  unitChip: {
    minWidth: 72,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[8],
    gap: 4,
  },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  advancedLink: { minHeight: touchTarget, justifyContent: 'center' },
});
