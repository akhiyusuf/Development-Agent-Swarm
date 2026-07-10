import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { ListRow } from '../../components/ListRow';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import type { MealSlot } from '../../state/types';

const SLOTS: { key: MealSlot; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snack', label: 'Snack' },
];

/** N1. Food Diary (Today) — entries grouped by meal slot. */
export function FoodDiaryScreen() {
  const nav = useNavigation<any>();
  const { state, todayStr } = useAppState();
  const today = todayStr();
  const entries = state.diary.filter((d) => d.date === today);
  const dailyTotal = entries.reduce((s, e) => s + e.calories, 0);

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="h1">Food Diary</Text>
        <Text variant="caption" colorToken={color.neutral.warmgray700}>
          {new Date().toDateString()}
        </Text>
      </View>

      {SLOTS.map((slot) => {
        const slotEntries = entries.filter((e) => e.slot === slot.key);
        return (
          <View key={slot.key} style={{ gap: space[8] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="h3">{slot.label}</Text>
              <Button
                label="Add"
                variant="tertiary"
                onPress={() => nav.navigate('AddEntry', { slot: slot.key })}
              />
            </View>
            {slotEntries.length === 0 ? (
              <Text variant="caption" colorToken={color.neutral.warmgray700}>
                Nothing logged yet.
              </Text>
            ) : (
              slotEntries.map((e) => (
                <ListRow
                  key={e.id}
                  title={e.foodName}
                  subtitle={`${e.quantity} × ${e.unitLabel} (${e.grams}g)`}
                  meta={`${e.calories} kcal`}
                  onPress={() => nav.navigate('EditDeleteEntry', { entryId: e.id })}
                  state={e.syncFailed ? 'error' : 'default'}
                  trailing={e.queued ? <StatusBadge tone="info" label="Queued" /> : undefined}
                />
              ))
            )}
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: space[16] }}>
        <Text variant="h3">Daily total</Text>
        <Text variant="h3" colorToken={color.primary.terracotta}>
          {dailyTotal} kcal
        </Text>
      </View>
      <Button label="View full summary" variant="secondary" onPress={() => nav.navigate('DailyNutritionSummary')} />
    </ScreenContainer>
  );
}
