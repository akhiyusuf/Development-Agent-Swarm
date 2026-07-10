import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Stepper } from '../../components/Stepper';
import { SingleSelect } from '../../components/SingleSelect';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import type { MealSlot } from '../../state/types';

/** N9. Edit / Delete Entry. */
export function EditDeleteEntryScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { entryId } = route.params;
  const { state, dispatch } = useAppState();
  const entry = state.diary.find((d) => d.id === entryId);
  const [quantity, setQuantity] = useState(entry?.quantity ?? 1);
  const [slot, setSlot] = useState<MealSlot>(entry?.slot ?? 'snack');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!entry) {
    return (
      <ScreenContainer>
        <Text variant="h2">Entry not found</Text>
      </ScreenContainer>
    );
  }

  const ratio = quantity / entry.quantity;
  const save = () => {
    dispatch({
      type: 'UPDATE_DIARY_ENTRY',
      id: entryId,
      payload: {
        quantity,
        slot,
        grams: Math.round(entry.grams * ratio),
        calories: Math.round(entry.calories * ratio),
        proteinG: Math.round(entry.proteinG * ratio),
        carbsG: Math.round(entry.carbsG * ratio),
        fatG: Math.round(entry.fatG * ratio),
      },
    });
    nav.goBack();
  };

  const remove = () => {
    dispatch({ type: 'DELETE_DIARY_ENTRY', id: entryId });
    nav.goBack();
  };

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">{entry.foodName}</Text>
      <Card>
        <Text variant="body">Quantity ({entry.unitLabel})</Text>
        <Stepper value={quantity} onChange={setQuantity} min={0.5} max={20} step={0.5} />
      </Card>
      <SingleSelect
        label="Meal"
        value={slot}
        onChange={(v) => setSlot(v as MealSlot)}
        options={[
          { value: 'breakfast', label: 'Breakfast' },
          { value: 'lunch', label: 'Lunch' },
          { value: 'dinner', label: 'Dinner' },
          { value: 'snack', label: 'Snack' },
        ]}
      />
      <Button label="Save changes" onPress={save} />
      {confirmDelete ? (
        <Card state="error">
          <Text variant="body" colorToken={color.semantic.error}>
            Delete this entry? This can't be undone.
          </Text>
          <Button label="Yes, delete" destructive variant="tertiary" onPress={remove} />
        </Card>
      ) : (
        <Button label="Delete" destructive variant="tertiary" onPress={() => setConfirmDelete(true)} />
      )}
      <Button label="Dismiss" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
