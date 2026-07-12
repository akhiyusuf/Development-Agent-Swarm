import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, SingleSelectChips, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { findFoodWithCustom } from '../../data/foods';
import { MEAL_SLOT_LABELS } from '../../data/sampleData';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import { todayKey } from '../../state/selectors';
import type { MealSlot, RootParamList } from '../../navigation/types';

/**
 * Edit / Delete Diary Entry (N9, modal).
 *
 * DATA CONTRACT: `{ entryId }` resolves a DiaryEntry. Save updates in place +
 * recomputes daily totals; Delete requires an explicit confirm step (never a
 * bare single tap — B4). Offline: save/delete queue optimistically ([CP-OFFLINE]).
 */
export function EditDeleteEntryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { diary, customFoods } = useAppState();
  const route = useRoute<RouteProp<RootParamList, 'EditDeleteEntry'>>();

  // The data contract is `{ entryId }` only (no date); the diary is keyed by
  // day, so this scans across days for the entry's id (today's diary is the
  // only place rows currently link in from, but this keeps it correct if a
  // past day's diary opens the same screen later).
  const entryDate = Object.keys(diary).find((d) => diary[d].some((e) => e.id === route.params.entryId)) ?? todayKey();
  const entry = diary[entryDate]?.find((e) => e.id === route.params.entryId);

  const [slot, setSlot] = useState<string | null>(entry?.slot ?? null);
  const [quantity, setQuantity] = useState(entry?.quantity ?? 1);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!entry) {
    return (
      <Screen>
        <AppText variant="h2">Entry not found</AppText>
        <Button label="Close" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const food = findFoodWithCustom(entry.foodId, customFoods);

  return (
    <Screen>
      <AppText variant="h2">{food?.name ?? entry.foodId}</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        {entry.unitLabel}
      </AppText>

      <Card>
        <Section title="Meal">
          <SingleSelectChips
            value={slot}
            onChange={setSlot}
            options={(Object.keys(MEAL_SLOT_LABELS) as MealSlot[]).map((s) => ({ value: s, label: MEAL_SLOT_LABELS[s] }))}
          />
        </Section>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="bodyEmphasis">Quantity</AppText>
          <Row style={{ gap: theme.spacing.space16 }}>
            <Button variant="tertiary" label="−" onPress={() => setQuantity((q) => Math.max(0.5, q - 0.5))} />
            <AppText variant="h3">{quantity}</AppText>
            <Button variant="tertiary" label="+" onPress={() => setQuantity((q) => q + 0.5)} />
          </Row>
        </Row>
      </Card>

      <Button
        label="Save changes"
        onPress={() => {
          dispatch({
            type: 'UPDATE_DIARY_ENTRY',
            date: entryDate,
            entryId: entry.id,
            changes: { slot: (slot as MealSlot) ?? entry.slot, quantity },
          });
          navigation.goBack();
        }}
      />

      {confirmingDelete ? (
        <Card error>
          <AppText variant="bodyEmphasis" color={theme.semantic.error}>
            Delete this entry?
          </AppText>
          <View style={{ gap: theme.spacing.space8, marginTop: theme.spacing.space8 }}>
            <Button
              label="Yes, delete"
              onPress={() => {
                dispatch({ type: 'DELETE_DIARY_ENTRY', date: entryDate, entryId: entry.id });
                navigation.goBack();
              }}
              error
              errorMessage=""
            />
            <Button variant="tertiary" label="Keep it" onPress={() => setConfirmingDelete(false)} />
          </View>
        </Card>
      ) : (
        <Button variant="tertiary" label="Delete entry" onPress={() => setConfirmingDelete(true)} />
      )}
    </Screen>
  );
}
