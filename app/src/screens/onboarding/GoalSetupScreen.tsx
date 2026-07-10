import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { ProgressRing } from '../../components/ProgressRing';
import { Stepper } from '../../components/Stepper';
import { macroColor, space, color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { computeCalorieTarget, computeMacros } from '../../utils/calculateGoals';

/** A4. Goal & Target Setup — computed calorie/macro targets, user-adjustable. */
export function GoalSetupScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();
  const computed = useMemo(() => {
    const calories = computeCalorieTarget(state.profile);
    return { calories, ...computeMacros(calories) };
  }, [state.profile]);

  const [edited, setEdited] = useState(false);
  const [calorieTarget, setCalorieTarget] = useState(computed.calories);
  const [proteinG, setProteinG] = useState(computed.proteinG);
  const [carbsG, setCarbsG] = useState(computed.carbsG);
  const [fatG, setFatG] = useState(computed.fatG);

  const aggressive = calorieTarget < 1200 || calorieTarget > 4000;

  const onContinue = () => {
    dispatch({ type: 'SET_GOALS', payload: { calorieTarget, proteinG, carbsG, fatG, computed: !edited } });
    nav.navigate('RegionPreference');
  };

  const reset = () => {
    setCalorieTarget(computed.calories);
    setProteinG(computed.proteinG);
    setCarbsG(computed.carbsG);
    setFatG(computed.fatG);
    setEdited(false);
  };

  return (
    <ScreenContainer density="relaxed">
      <ProgressBar progress={3 / 8} label="Step 3 of 8" />
      <Text variant="h1">Your daily targets</Text>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ProgressRing progress={1} fillColor={macroColor.calories} centerLabel={`${calorieTarget}`} centerSubLabel="kcal" />
          <ProgressRing progress={1} fillColor={macroColor.protein} size={64} centerLabel={`${proteinG}g`} centerSubLabel="protein" />
          <ProgressRing progress={1} fillColor={macroColor.carbs} size={64} centerLabel={`${carbsG}g`} centerSubLabel="carbs" />
          <ProgressRing progress={1} fillColor={macroColor.fat} size={64} centerLabel={`${fatG}g`} centerSubLabel="fat" />
        </View>
        {edited ? (
          <Text variant="micro" colorToken={color.primary.terracotta} style={{ marginTop: space[8] }}>
            EDITED
          </Text>
        ) : (
          <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ marginTop: space[8] }}>
            Computed from your profile
          </Text>
        )}
      </Card>

      <Card style={{ gap: space[12] }}>
        <Text variant="h3">Adjust targets</Text>
        <Row label="Calories" value={calorieTarget} onChange={(v) => { setCalorieTarget(v); setEdited(true); }} step={50} min={1000} max={5000} />
        <Row label="Protein (g)" value={proteinG} onChange={(v) => { setProteinG(v); setEdited(true); }} step={5} min={20} max={300} />
        <Row label="Carbs (g)" value={carbsG} onChange={(v) => { setCarbsG(v); setEdited(true); }} step={5} min={20} max={500} />
        <Row label="Fat (g)" value={fatG} onChange={(v) => { setFatG(v); setEdited(true); }} step={5} min={10} max={200} />
        {aggressive ? (
          <Text variant="caption" colorToken={color.semantic.warning}>
            That target looks unusually aggressive — consider a safer range.
          </Text>
        ) : null}
      </Card>

      <Button label="Continue" onPress={onContinue} />
      <Button label="Reset to computed" variant="secondary" onPress={reset} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}

function Row({ label, value, onChange, step, min, max }: { label: string; value: number; onChange: (v: number) => void; step: number; min: number; max: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text variant="body">{label}</Text>
      <Stepper value={value} onChange={onChange} step={step} min={min} max={max} />
    </View>
  );
}
