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

  const save = () => {
    if (!valid) return;
    const food = {
      id: `custom-${uid()}`,
      name,
      unitLabel,
      gramsPerUnit: Number(gramsPerUnit) || 100,
      caloriesPerUnit: Number(calories),
      proteinG: Number(protein),
      carbsG: Number(carbs),
      fatG: Number(fat),
    };
    dispatch({ type: 'ADD_CUSTOM_FOOD', food });
    setSaved(true);
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
        custom-food form for time — see BUILD_NOTES.md.
      </Text>
      {saved ? <StatusBadge tone="success" label="Saved" /> : null}
      <Button label="Save" onPress={save} state={valid ? 'default' : 'disabled'} />
      <Button label="Save & log now" variant="secondary" onPress={() => { save(); nav.goBack(); }} state={valid ? 'default' : 'disabled'} />
      <Button label="Cancel" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
