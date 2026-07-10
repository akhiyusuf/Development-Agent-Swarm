import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListRow } from '../../components/ListRow';
import { Text } from '../../components/Typography';
import { color, space } from '../../theme/tokens';
import type { FoodItem } from '../../data/foodDatabase';

interface Props {
  foods: FoodItem[];
  onSelect: (food: FoodItem) => void;
  emptyLabel?: string;
}

/**
 * Shared results list underlying N3 (Food Search Results) — rendered inline
 * within N2's Search/Recent/Favorites tabs per this build's consolidation
 * (see BUILD_NOTES.md): the sitemap nests Food Search Results directly under
 * Add Entry, so it is implemented as this tab's content rather than a
 * separately-routed screen.
 */
export function FoodResultsList({ foods, onSelect, emptyLabel = 'No results yet.' }: Props) {
  if (!foods.length) {
    return (
      <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ paddingVertical: space[16] }}>
        {emptyLabel}
      </Text>
    );
  }
  return (
    <View style={{ gap: space[8] }}>
      {foods.map((f) => (
        <ListRow
          key={f.id}
          title={f.name}
          subtitle={`${f.caloriesPerUnit} kcal · ${f.units[0]?.label ?? ''}`}
          meta={f.region}
          onPress={() => onSelect(f)}
          leading={<Ionicons name="restaurant-outline" size={20} color={color.primary.deepgreen} />}
        />
      ))}
    </View>
  );
}
