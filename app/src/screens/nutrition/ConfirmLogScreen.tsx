import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { SingleSelect } from '../../components/SingleSelect';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { findFood } from '../../data/foodDatabase';
import type { MealSlot } from '../../state/types';

/** N8. Confirm & Log — meal-slot assignment, quantity, save. */
export function ConfirmLogScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId, slot, unitLabel, quantity, grams, calories, proteinG, carbsG, fatG, micronutrients } = route.params;
  const { dispatch, isOnline, uid, todayStr, state } = useAppState();
  const [mealSlot, setMealSlot] = useState<MealSlot>(slot ?? 'snack');
  const food = findFood(foodId, state.customFoods);

  const confirm = () => {
    dispatch({
      type: 'ADD_DIARY_ENTRY',
      entry: {
        id: uid(),
        date: todayStr(),
        slot: mealSlot,
        foodId,
        foodName: food?.name ?? 'Food',
        unitLabel,
        quantity,
        grams,
        calories,
        proteinG,
        carbsG,
        fatG,
        micronutrients,
        queued: !isOnline,
      },
    });
    dispatch({ type: 'ADD_RECENT', foodId });
    // Navigate back to the Food Diary root of this stack.
    nav.popToTop();
  };

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Confirm entry</Text>
      <Card>
        <Text variant="h3">{food?.name}</Text>
        <Text variant="body">
          {quantity} × {unitLabel} ({grams}g)
        </Text>
        <Text variant="body" colorToken={color.primary.terracotta}>
          {calories} kcal · P {proteinG}g · C {carbsG}g · F {fatG}g
        </Text>
      </Card>
      <SingleSelect
        label="Meal"
        value={mealSlot}
        onChange={(v) => setMealSlot(v as MealSlot)}
        options={[
          { value: 'breakfast', label: 'Breakfast' },
          { value: 'lunch', label: 'Lunch' },
          { value: 'dinner', label: 'Dinner' },
          { value: 'snack', label: 'Snack' },
        ]}
      />
      {!isOnline ? (
        <Text variant="caption" colorToken={color.semantic.info}>
          You're offline — this entry will be queued and synced automatically later.
        </Text>
      ) : null}
      <Button label="Save to diary" onPress={confirm} />
      <Button label="Edit portion" variant="secondary" onPress={() => nav.goBack()} />
      <Button label="Cancel" variant="tertiary" onPress={() => nav.popToTop()} />
    </ScreenContainer>
  );
}
