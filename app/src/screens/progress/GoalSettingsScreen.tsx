import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, SingleSelectChips, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import { computeTargets, isAggressiveTarget } from '../../logic/targets';

/**
 * Goal Settings / Adjust Targets (P3) — mirrors onboarding Goal Setup plus a
 * weight-goal control (Req 3, 12).
 *
 * DATA CONTRACT: `{ targets, weightGoal }`. Save commits immediately and takes
 * effect on the current day's remaining totals too (D3 same-day recalculation).
 * Over-aggressive adjustment shows a non-blocking warning, never a hard block.
 */
export function GoalSettingsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { targets, profile, weightGoal } = useAppState();

  const [kcal, setKcal] = useState(String(targets.kcal));
  const [protein, setProtein] = useState(String(targets.protein_g));
  const [carbs, setCarbs] = useState(String(targets.carbs_g));
  const [fat, setFat] = useState(String(targets.fat_g));
  const [direction, setDirection] = useState<string | null>(weightGoal.direction);
  const [targetWeight, setTargetWeight] = useState(weightGoal.targetKg ? String(weightGoal.targetKg) : profile.weightKg ? String(profile.weightKg) : '75');

  const kcalNum = Number(kcal) || 0;
  const aggressive = isAggressiveTarget(kcalNum);

  return (
    <Screen>
      <AppText variant="h2">Adjust targets</AppText>

      <Card>
        <Row style={{ justifyContent: 'space-around' }}>
          <ProgressRing progress={1} color={theme.macro.protein} label="Protein" valueText={`${protein}g`} size={72} />
          <ProgressRing progress={1} color={theme.macro.carbs} label="Carbs" valueText={`${carbs}g`} size={72} />
          <ProgressRing progress={1} color={theme.macro.fat} label="Fat" valueText={`${fat}g`} size={72} />
        </Row>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.space16 }}>
          <TextField label="Calories (kcal)" value={kcal} onChangeText={setKcal} keyboardType="numeric" />
          {aggressive ? (
            <AppText variant="caption" color={theme.semantic.warning}>
              ⚠ That target is outside a typical safe range. You can still save it.
            </AppText>
          ) : null}
          <Row style={{ gap: theme.spacing.space12 }}>
            <View style={{ flex: 1 }}>
              <TextField label="Protein g" value={protein} onChangeText={setProtein} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Carbs g" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Fat g" value={fat} onChangeText={setFat} keyboardType="numeric" />
            </View>
          </Row>
        </View>
      </Card>

      <Card>
        <Section title="Weight goal">
          <SingleSelectChips
            value={direction}
            onChange={setDirection}
            options={[
              { value: 'lose', label: 'Lose' },
              { value: 'maintain', label: 'Maintain' },
              { value: 'gain', label: 'Gain' },
            ]}
          />
          <View style={{ marginTop: theme.spacing.space12 }}>
            <TextField label="Target weight (kg)" value={targetWeight} onChangeText={setTargetWeight} keyboardType="numeric" />
          </View>
        </Section>
      </Card>

      <Button
        label="Save targets"
        onPress={() => {
          // Same-day recalculation (D3): commits immediately, no confirmation delay.
          dispatch({
            type: 'SET_TARGETS',
            targets: { kcal: kcalNum, protein_g: Number(protein) || 0, carbs_g: Number(carbs) || 0, fat_g: Number(fat) || 0 },
          });
          dispatch({
            type: 'SET_WEIGHT_GOAL',
            weightGoal: { direction: (direction as typeof weightGoal.direction) ?? 'maintain', targetKg: Number(targetWeight) || null },
          });
          navigation.goBack();
        }}
      />
      <Button variant="tertiary" label="Reset to computed" onPress={() => {
        const recomputed = computeTargets(profile);
        setKcal(String(recomputed.kcal));
        setProtein(String(recomputed.protein_g));
        setCarbs(String(recomputed.carbs_g));
        setFat(String(recomputed.fat_g));
      }} />
    </Screen>
  );
}
