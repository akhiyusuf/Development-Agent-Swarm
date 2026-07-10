import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** N7. Custom Food / Meal Builder. */
export function CustomFoodBuilderScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const slot = route.params?.slot ?? 'snack';
  const { dispatch, isOnline, uid } = useAppState();

  const [name, setName] = useState('');
  const [unitLabel, setUnitLabel] = useState('1 serving');
  const [gramsPerUnit, setGramsPerUnit] = useState('100');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [saved, setSaved] = useState(false);

  const valid = name.trim() && calories && protein && carbs && fat;

  const buildFood = () => ({
    id: `custom-${uid()}`,
    name,
    unitLabel,
    gramsPerUnit: Number(gramsPerUnit) || 100,
    caloriesPerUnit: Number(calories),
    proteinG: Number(protein),
    carbsG: Number(carbs),
    fatG: Number(fat),
  });

  const save = () => {
    if (!valid) return;
    const food = buildFood();
    dispatch({ type: 'ADD_CUSTOM_FOOD', food });
    setSaved(true);
  };

  // "Save & log now" (screens.md N7 secondary action) saves the custom food
  // and routes straight to Confirm & Log (N8) with a 1x-quantity portion of
  // the food's own declared household unit — the same functional path a
  // seed-database food takes from Food Detail's "Add to diary".
  const saveAndLog = () => {
    if (!valid) return;
    const food = buildFood();
    dispatch({ type: 'ADD_CUSTOM_FOOD', food });
    nav.navigate('ConfirmLog', {
      foodId: food.id,
      slot,
      unitLabel: food.unitLabel,
      quantity: 1,
      grams: food.gramsPerUnit,
      calories: food.caloriesPerUnit,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      micronutrients: {},
    });
  };

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Custom food / meal</Text>
      {!isOnline ? <StatusBadge tone="info" label="Offline — will save locally and sync later" /> : null}
      <Input label="Name" value={name} onChangeText={setName} placeholder="e.g. My family's stew" />
      <Input label="Household unit label" value={unitLabel} onChangeText={setUnitLabel} placeholder="1 bowl" />
      <Input label="Grams per unit" keyboardType="numeric" value={gramsPerUnit} onChangeText={setGramsPerUnit} />
      <Input label="Calories per unit (kcal)" keyboardType="numeric" value={calories} onChangeText={setCalories} />
      <Input label="Protein (g)" keyboardType="numeric" value={protein} onChangeText={setProtein} />
      <Input label="Carbs (g)" keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
      <Input label="Fat (g)" keyboardType="numeric" value={fat} onChangeText={setFat} />
      <Text variant="caption" style={{ marginTop: -8 }}>
        Micronutrient entry and a portion photo attach are optional and left out of this build's
        custom-food form for time — see BUILD_NOTES.md. Once saved, this food is fully
        searchable/loggable everywhere the seed database is (Add Entry's Search/Recent/
        Favorites/Custom tabs and Food Detail).
      </Text>
      {saved ? <StatusBadge tone="success" label="Saved" /> : null}
      <Button label="Save" onPress={save} state={valid ? 'default' : 'disabled'} />
      <Button label="Save & log now" variant="secondary" onPress={saveAndLog} state={valid ? 'default' : 'disabled'} />
      <Button label="Cancel" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
