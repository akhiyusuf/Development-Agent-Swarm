import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { TextField } from './TextField';

export type HouseholdUnit = {
  key: string;
  label: string; // e.g. "1 ladle", "half plate", "1 wrap", "1 cup"
  icon: keyof typeof Ionicons.glyphMap;
};

export type HouseholdUnitPortionPickerProps = {
  units: HouseholdUnit[];
  selectedUnitKey: string | null;
  quantity: number;
  onSelectUnit: (key: string) => void;
  onQuantityChange: (quantity: number) => void;
  /** True when this food item has no defined household-unit conversion yet. */
  disabledNoConversion?: boolean;
  advancedGramValue?: string;
  onAdvancedGramChange?: (value: string) => void;
  gramError?: string;
};

/**
 * Household-unit portion picker — the default serving-size control for
 * prepared-meal logging (per research: household units, not gram-weight,
 * are how African staple dishes are conventionally estimated). Gram-weight
 * entry is available as a secondary "advanced/exact" link, never the default
 * focus. Barcode entry is out of v1 scope and intentionally absent.
 */
export function HouseholdUnitPortionPicker({
  units,
  selectedUnitKey,
  quantity,
  onSelectUnit,
  onQuantityChange,
  disabledNoConversion,
  advancedGramValue,
  onAdvancedGramChange,
  gramError,
}: HouseholdUnitPortionPickerProps) {
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (disabledNoConversion) {
    return (
      <View>
        <Text style={{ fontSize: theme.type.caption.fontSize, color: theme.neutrals.charcoal, marginBottom: theme.spacing.space8 }}>
          Exact weight only for this item — no household-unit reference yet.
        </Text>
        <TextField
          label="Weight (g)"
          keyboardType="numeric"
          value={advancedGramValue}
          onChangeText={onAdvancedGramChange}
          error={!!gramError}
          errorMessage={gramError}
          accessibilityLabel="Weight in grams"
        />
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.row, { gap: theme.spacing.space12 }]}>
        {units.map((unit) => {
          const selected = unit.key === selectedUnitKey;
          return (
            <Pressable
              key={unit.key}
              onPress={() => onSelectUnit(unit.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={unit.label}
              style={({ pressed }) => [
                styles.chip,
                {
                  minWidth: 56,
                  minHeight: 56,
                  borderRadius: theme.radii.md,
                  borderWidth: selected ? 0 : 1.5,
                  borderColor: theme.neutrals.border,
                  backgroundColor: selected
                    ? theme.brand.terracotta
                    : pressed
                      ? theme.neutrals.surface
                      : 'transparent',
                },
              ]}
            >
              <Ionicons name={unit.icon} size={20} color={selected ? theme.neutrals.white : theme.neutrals.ink} />
              <Text
                style={{
                  fontSize: theme.type.caption.fontSize,
                  color: selected ? theme.neutrals.white : theme.neutrals.ink,
                  marginTop: 2,
                  textAlign: 'center',
                }}
              >
                {unit.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedUnitKey ? (
        <View style={[styles.stepperRow, { marginTop: theme.spacing.space16 }]}>
          <Pressable
            onPress={() => onQuantityChange(Math.max(0.5, quantity - 0.5))}
            accessibilityLabel="Decrease quantity"
            style={[styles.stepperButton, { backgroundColor: theme.neutrals.surface, borderRadius: theme.radii.sm }]}
          >
            <Ionicons name="remove" size={22} color={theme.neutrals.ink} />
          </Pressable>
          <Text style={{ fontSize: theme.type.h3.fontSize, marginHorizontal: theme.spacing.space16 }}>
            {quantity}
          </Text>
          <Pressable
            onPress={() => onQuantityChange(quantity + 0.5)}
            accessibilityLabel="Increase quantity"
            style={[styles.stepperButton, { backgroundColor: theme.neutrals.surface, borderRadius: theme.radii.sm }]}
          >
            <Ionicons name="add" size={22} color={theme.neutrals.ink} />
          </Pressable>
        </View>
      ) : null}

      <Pressable onPress={() => setShowAdvanced((s) => !s)} style={{ marginTop: theme.spacing.space16 }}>
        <Text style={{ fontSize: theme.type.caption.fontSize, color: theme.brand.terracotta }}>
          {showAdvanced ? 'Hide exact weight entry' : 'Enter exact weight instead'}
        </Text>
      </Pressable>

      {showAdvanced ? (
        <View style={{ marginTop: theme.spacing.space8 }}>
          <TextField
            label="Weight (g) — advanced"
            keyboardType="numeric"
            value={advancedGramValue}
            onChangeText={onAdvancedGramChange}
            error={!!gramError}
            errorMessage={gramError}
            accessibilityLabel="Weight in grams (advanced)"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
