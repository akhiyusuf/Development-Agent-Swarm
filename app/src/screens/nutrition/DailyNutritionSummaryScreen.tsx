import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { ProgressRing } from '../../components/ProgressRing';
import { ProgressBar } from '../../components/ProgressBar';
import { Button } from '../../components/Button';
import { macroColor, color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { MICRONUTRIENT_LABELS, MICRONUTRIENT_TARGETS, Micronutrients } from '../../data/foodDatabase';

/** N10. Daily Nutrition Summary. */
export function DailyNutritionSummaryScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { state, todayStr } = useAppState();
  const today = route.params?.date ?? todayStr();
  const entries = state.diary.filter((d) => d.date === today);

  const calories = entries.reduce((s, e) => s + e.calories, 0);
  const protein = entries.reduce((s, e) => s + e.proteinG, 0);
  const carbs = entries.reduce((s, e) => s + e.carbsG, 0);
  const fat = entries.reduce((s, e) => s + e.fatG, 0);

  const microTotals: Micronutrients = {};
  entries.forEach((e) => {
    (Object.keys(e.micronutrients) as (keyof Micronutrients)[]).forEach((k) => {
      microTotals[k] = (microTotals[k] ?? 0) + (e.micronutrients[k] ?? 0);
    });
  });

  return (
    <ScreenContainer>
      <Text variant="h1">Daily Summary</Text>
      <Text variant="caption" colorToken={color.neutral.warmgray700}>
        {today}
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <ProgressRing progress={calories / state.goals.calorieTarget} fillColor={macroColor.calories} centerLabel={`${calories}`} centerSubLabel="kcal" />
        </View>
        <View style={{ gap: space[8], marginTop: space[12] }}>
          <ProgressBar progress={protein / state.goals.proteinG} label="Protein" valueLabel={`${protein}g / ${state.goals.proteinG}g`} fillColor={macroColor.protein} />
          <ProgressBar progress={carbs / state.goals.carbsG} label="Carbs" valueLabel={`${carbs}g / ${state.goals.carbsG}g`} fillColor={macroColor.carbs} />
          <ProgressBar progress={fat / state.goals.fatG} label="Fat" valueLabel={`${fat}g / ${state.goals.fatG}g`} fillColor={macroColor.fat} />
        </View>
      </Card>

      <Card>
        <Text variant="h2">Micronutrient panel</Text>
        <View style={{ gap: space[12], marginTop: space[8] }}>
          {(Object.keys(MICRONUTRIENT_LABELS) as (keyof Micronutrients)[]).map((k) => {
            const meta = MICRONUTRIENT_LABELS[k];
            const value = microTotals[k];
            return (
              <View key={k}>
                {value === undefined ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text variant="body" onPress={() => nav.navigate('MicronutrientDetail', { nutrient: k })}>
                      {meta.label}
                    </Text>
                    <Text variant="caption" colorToken={color.neutral.warmgray700}>
                      No data for this food
                    </Text>
                  </View>
                ) : (
                  <ProgressBar
                    progress={value / MICRONUTRIENT_TARGETS[k]}
                    label={meta.label}
                    valueLabel={`${Math.round(value * 10) / 10}${meta.unit}`}
                    fillColor={color.primary.deepgreen}
                  />
                )}
              </View>
            );
          })}
        </View>
      </Card>
      <Button label="View history / calendar" variant="secondary" onPress={() => nav.navigate('NutritionHistory')} />
    </ScreenContainer>
  );
}
