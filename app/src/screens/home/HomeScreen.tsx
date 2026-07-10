import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressRing } from '../../components/ProgressRing';
import { ProgressBar } from '../../components/ProgressBar';
import { StatusBadge } from '../../components/StatusBadge';
import { BottomSheet } from '../../components/BottomSheet';
import { Input } from '../../components/Input';
import { macroColor, space, color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { MICRONUTRIENT_LABELS, MICRONUTRIENT_TARGETS, Micronutrients } from '../../data/foodDatabase';

/** Home (Today Dashboard) — Tab 1. Aggregation view (Req 3 + Req 12). */
export function HomeScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch, isOnline, queuedCount, uid, todayStr } = useAppState();
  const [weightSheet, setWeightSheet] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  const today = todayStr();
  const todaysEntries = state.diary.filter((d) => d.date === today);
  const caloriesIn = todaysEntries.reduce((s, e) => s + e.calories, 0);
  const proteinIn = todaysEntries.reduce((s, e) => s + e.proteinG, 0);
  const carbsIn = todaysEntries.reduce((s, e) => s + e.carbsG, 0);
  const fatIn = todaysEntries.reduce((s, e) => s + e.fatG, 0);

  const microTotals: Micronutrients = {};
  todaysEntries.forEach((e) => {
    (Object.keys(e.micronutrients) as (keyof Micronutrients)[]).forEach((k) => {
      microTotals[k] = (microTotals[k] ?? 0) + (e.micronutrients[k] ?? 0);
    });
  });
  const trackedMicros: (keyof Micronutrients)[] = ['ironMg', 'zincMg', 'calciumMg', 'vitaminAmcg', 'folateMcg', 'b12Mcg'];

  const saveWeight = () => {
    const kg = Number(weightInput);
    if (!kg) return;
    dispatch({ type: 'ADD_WEIGHT', entry: { id: uid(), date: today, kg, queued: !isOnline } });
    setWeightSheet(false);
    setWeightInput('');
  };

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="h1">Today</Text>
        {queuedCount > 0 ? (
          <StatusBadge tone="info" label={`${queuedCount} queued`} />
        ) : !isOnline ? (
          <StatusBadge tone="warning" label="Offline" />
        ) : (
          <StatusBadge tone="success" label="Synced" />
        )}
      </View>

      <Card>
        <Text variant="h2">Energy balance</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginTop: space[12], gap: space[12] }}>
          <ProgressRing
            progress={caloriesIn / state.goals.calorieTarget}
            fillColor={macroColor.calories}
            state={caloriesIn > state.goals.calorieTarget ? 'warning' : 'default'}
            centerLabel={`${caloriesIn}`}
            centerSubLabel={`/ ${state.goals.calorieTarget} kcal`}
          />
          <ProgressRing progress={proteinIn / state.goals.proteinG} size={64} fillColor={macroColor.protein} centerLabel={`${proteinIn}g`} centerSubLabel="protein" />
          <ProgressRing progress={carbsIn / state.goals.carbsG} size={64} fillColor={macroColor.carbs} centerLabel={`${carbsIn}g`} centerSubLabel="carbs" />
          <ProgressRing progress={fatIn / state.goals.fatG} size={64} fillColor={macroColor.fat} centerLabel={`${fatIn}g`} centerSubLabel="fat" />
        </View>
      </Card>

      <Card>
        <Text variant="h2">Micronutrient snapshot</Text>
        <View style={{ gap: space[8], marginTop: space[8] }}>
          {trackedMicros.map((k) => {
            const meta = MICRONUTRIENT_LABELS[k];
            const value = microTotals[k];
            if (value === undefined) {
              return (
                <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="caption">{meta.label}</Text>
                  <Text variant="caption" colorToken={color.neutral.warmgray700}>
                    No data yet
                  </Text>
                </View>
              );
            }
            return (
              <ProgressBar
                key={k}
                progress={value / MICRONUTRIENT_TARGETS[k]}
                label={meta.label}
                valueLabel={`${Math.round(value)}${meta.unit}`}
                fillColor={color.primary.deepgreen}
              />
            );
          })}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: space[12] }}>
        <Button label="Log Meal" onPress={() => nav.navigate('Nutrition', { screen: 'AddEntry' })} style={{ flex: 1 }} />
        <Button
          label="Log Workout"
          variant="secondary"
          onPress={() => nav.navigate('Workout', { screen: 'WorkoutSessionLog' })}
          style={{ flex: 1 }}
        />
      </View>
      <Button label="Quick-add weight" variant="tertiary" onPress={() => setWeightSheet(true)} />

      <BottomSheet visible={weightSheet} onDismiss={() => setWeightSheet(false)} title="Log your weight">
        <Input label="Weight (kg)" keyboardType="numeric" value={weightInput} onChangeText={setWeightInput} placeholder="70" />
        <Button label="Save" onPress={saveWeight} />
      </BottomSheet>
    </ScreenContainer>
  );
}
