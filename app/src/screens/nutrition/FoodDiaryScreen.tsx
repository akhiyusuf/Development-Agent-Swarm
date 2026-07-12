import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ListRow, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { findFoodWithCustom } from '../../data/foods';
import { MEAL_SLOTS, MEAL_SLOT_LABELS } from '../../data/sampleData';
import { useAppState } from '../../state/AppStateContext';
import { todayKey, useDayTotals, useDiaryEntries } from '../../state/selectors';
import type { MealSlot } from '../../navigation/types';

/**
 * Food Diary (Today) — entries grouped by meal slot (Req 3).
 *
 * DATA CONTRACT: expects `{ entries: DiaryEntry[]; date: string }`. Each entry
 * row opens Edit/Delete; each slot's Add opens the Add Entry sheet pre-targeted
 * to that slot (B1). Offline-queued entries show a "queued" badge ([CP-OFFLINE]).
 * First-run: each empty slot shows "Nothing logged yet" + inline add (B1).
 */
export function FoodDiaryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { targets, customFoods } = useAppState();
  const date = todayKey();
  const entries = useDiaryEntries(date);
  const totals = useDayTotals(date);
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">{dateLabel}</AppText>
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          {totals.kcal} / {targets.kcal} kcal
        </AppText>
      </Row>

      {MEAL_SLOTS.map((slot: MealSlot) => {
        const rows = entries.filter((e) => e.slot === slot);
        return (
          <Card key={slot}>
            <Row style={{ justifyContent: 'space-between', marginBottom: theme.spacing.space8 }}>
              <AppText variant="h3">{MEAL_SLOT_LABELS[slot]}</AppText>
              <Button variant="tertiary" label="Add" onPress={() => navigation.navigate('AddEntry', { slot })} />
            </Row>
            {rows.length === 0 ? (
              <AppText variant="caption" color={theme.neutrals.placeholder}>
                Nothing logged yet
              </AppText>
            ) : (
              <View>
                {rows.map((e) => {
                  const food = findFoodWithCustom(e.foodId, customFoods);
                  return (
                    <ListRow
                      key={e.id}
                      title={food?.name ?? e.foodId}
                      subtitle={`${e.quantity} × ${e.unitLabel} · ${e.grams * e.quantity}g`}
                      trailingText={`${e.kcal} kcal`}
                      showChevron
                      onPress={() => navigation.navigate('EditDeleteEntry', { entryId: e.id })}
                      badge={e.queued ? { color: theme.semantic.info, icon: 'cloud-upload-outline', label: 'Queued' } : undefined}
                    />
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}

      <Button label="View daily summary" onPress={() => navigation.navigate('DailyNutritionSummary')} />
      <Button variant="secondary" label="History / calendar" onPress={() => navigation.navigate('NutritionHistory')} />
      <Button variant="tertiary" label="Favorites & recents" onPress={() => navigation.navigate('FavoritesRecents')} />
    </Screen>
  );
}
