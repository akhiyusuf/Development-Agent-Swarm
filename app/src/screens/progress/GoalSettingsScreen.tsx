import React, { useState } from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { SingleSelect } from '../../components/SingleSelect';
import { ProgressRing } from '../../components/ProgressRing';
import { Input } from '../../components/Input';
import { macroColor, color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** P3. Goal Settings / Adjust Targets. */
export function GoalSettingsScreen() {
  const { state, dispatch } = useAppState();
  const [calorieTarget, setCalorieTarget] = useState(state.goals.calorieTarget);
  const [proteinG, setProteinG] = useState(state.goals.proteinG);
  const [carbsG, setCarbsG] = useState(state.goals.carbsG);
  const [fatG, setFatG] = useState(state.goals.fatG);
  const [weightGoalKg, setWeightGoalKg] = useState(state.goals.weightGoalKg?.toString() ?? '');
  const [pace, setPace] = useState(state.goals.pace ?? 'standard');
  const [saved, setSaved] = useState(false);

  const aggressive = calorieTarget < 1200 || calorieTarget > 4000;

  const save = () => {
    dispatch({
      type: 'SET_GOALS',
      payload: { calorieTarget, proteinG, carbsG, fatG, computed: false, weightGoalKg: Number(weightGoalKg) || undefined, pace: pace as any },
    });
    setSaved(true);
  };

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Goal Settings</Text>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <ProgressRing progress={1} fillColor={macroColor.calories} centerLabel={`${calorieTarget}`} centerSubLabel="kcal" />
          <ProgressRing progress={1} size={64} fillColor={macroColor.protein} centerLabel={`${proteinG}g`} centerSubLabel="protein" />
          <ProgressRing progress={1} size={64} fillColor={macroColor.carbs} centerLabel={`${carbsG}g`} centerSubLabel="carbs" />
          <ProgressRing progress={1} size={64} fillColor={macroColor.fat} centerLabel={`${fatG}g`} centerSubLabel="fat" />
        </View>
      </Card>
      <Card style={{ gap: space[12] }}>
        <Row label="Calories" value={calorieTarget} onChange={setCalorieTarget} step={50} min={1000} max={5000} />
        <Row label="Protein (g)" value={proteinG} onChange={setProteinG} step={5} min={20} max={300} />
        <Row label="Carbs (g)" value={carbsG} onChange={setCarbsG} step={5} min={20} max={500} />
        <Row label="Fat (g)" value={fatG} onChange={setFatG} step={5} min={10} max={200} />
        {aggressive ? (
          <Text variant="caption" colorToken={color.semantic.warning}>
            That target looks unusually aggressive — consider a safer range.
          </Text>
        ) : null}
      </Card>
      <Card style={{ gap: space[12] }}>
        <Input label="Weight goal (kg)" keyboardType="numeric" value={weightGoalKg} onChangeText={setWeightGoalKg} />
        <SingleSelect
          label="Pace"
          value={pace}
          onChange={(v) => setPace(v as any)}
          options={[
            { value: 'gradual', label: 'Gradual' },
            { value: 'standard', label: 'Standard' },
            { value: 'aggressive', label: 'Aggressive' },
          ]}
        />
      </Card>
      {saved ? (
        <Text variant="caption" colorToken={color.semantic.success}>
          Saved.
        </Text>
      ) : null}
      <Button label="Save targets" onPress={save} />
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
