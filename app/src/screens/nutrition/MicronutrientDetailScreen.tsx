import React, { useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { TrendChart, TrendPoint } from '../../components/TrendChart';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { MICRONUTRIENT_LABELS, MICRONUTRIENT_TARGETS, Micronutrients } from '../../data/foodDatabase';

/** N11. Micronutrient Detail — per-nutrient weekly trend. */
export function MicronutrientDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const nutrient: keyof Micronutrients = route.params.nutrient;
  const { state, todayStr } = useAppState();
  const meta = MICRONUTRIENT_LABELS[nutrient];
  const target = MICRONUTRIENT_TARGETS[nutrient];
  const today = todayStr();

  const todayTotal = state.diary
    .filter((d) => d.date === today)
    .reduce((s, e) => s + (e.micronutrients[nutrient] ?? 0), 0);
  const hasTodayData = state.diary.some((d) => d.date === today && d.micronutrients[nutrient] !== undefined);

  const trend: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayEntries = state.diary.filter((e) => e.date === dateStr);
      const hasData = dayEntries.some((e) => e.micronutrients[nutrient] !== undefined);
      const total = dayEntries.reduce((s, e) => s + (e.micronutrients[nutrient] ?? 0), 0);
      points.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: hasData ? total : dayEntries.length ? 0 : null });
    }
    return points;
  }, [state.diary, nutrient]);

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">{meta.label}</Text>
      {hasTodayData ? (
        <ProgressBar progress={todayTotal / target} label="Today" valueLabel={`${Math.round(todayTotal * 10) / 10}${meta.unit} / ${target}${meta.unit}`} fillColor={color.primary.deepgreen} />
      ) : (
        <Card>
          <Text variant="body" colorToken={color.neutral.warmgray700}>
            No data for today yet.
          </Text>
        </Card>
      )}
      <Card>
        <Text variant="h3">7-day trend</Text>
        <TrendChart data={trend} unit={meta.unit} targetValue={target} lineColor={color.primary.deepgreen} />
      </Card>
      <Text variant="caption" colorToken={color.neutral.warmgray700}>
        Coverage caveat: this is placeholder/mock nutrition data (see BUILD_NOTES.md) — a
        production build would carry real food-composition-table coverage caveats per food.
      </Text>
      <Button label="Back to summary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
