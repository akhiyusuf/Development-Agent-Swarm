import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TrendChart, TrendPoint } from '../../components/TrendChart';
import { StatusBadge, BadgeTone } from '../../components/StatusBadge';
import { macroColor, color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack } from '../../data/skillTree';

const STATE_TONE: Record<string, BadgeTone> = {
  locked: 'neutral',
  unlocked: 'info',
  inprogress: 'info',
  completed: 'success',
  mastered: 'warning',
};

/**
 * P1. Combined Progress Dashboard — three separately-titled sections
 * (carry-forward #6): weight trend, calorie-balance trend, workout
 * tier-progression summary. Carbs ring (gold-dark) and unlocked-node
 * indicator (node.unlocked) are kept in separate sections, each always
 * carrying its icon/label pairing, so the two never read as adjacent.
 */
export function CombinedProgressDashboardScreen() {
  const nav = useNavigation<any>();
  const { state } = useAppState();

  const weightTrend: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const entry = state.weightLog.find((w) => w.date === dateStr);
      points.push({ label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), value: entry ? entry.kg : null });
    }
    return points;
  }, [state.weightLog]);

  const calorieTrend: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayEntries = state.diary.filter((e) => e.date === dateStr);
      const total = dayEntries.reduce((s, e) => s + e.calories, 0);
      points.push({ label: d.toLocaleDateString(undefined, { weekday: 'short' }), value: dayEntries.length ? total : null });
    }
    return points;
  }, [state.diary]);

  const carbsToday = state.diary
    .filter((d) => d.date === new Date().toISOString().slice(0, 10))
    .reduce((s, e) => s + e.carbsG, 0);

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Progress</Text>

      <Card>
        <Text variant="h2">Weight trend</Text>
        <TrendChart data={weightTrend} unit="kg" lineColor={color.primary.terracotta} />
        <Button label="View weight log" variant="tertiary" onPress={() => nav.navigate('WeightLog')} />
      </Card>

      <Card>
        <Text variant="h2">Calorie-balance trend</Text>
        <TrendChart data={calorieTrend} unit="kcal" targetValue={state.goals.calorieTarget} lineColor={macroColor.calories} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], marginTop: space[8] }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: macroColor.carbs }} />
          <Text variant="caption">Carbs today: {carbsToday}g</Text>
        </View>
        <Button label="View daily summary" variant="tertiary" onPress={() => nav.navigate('Nutrition', { screen: 'DailyNutritionSummary' })} />
      </Card>

      <Card>
        <Text variant="h2">Workout tier progression</Text>
        {(['calisthenics', 'pilates'] as const).map((track) => {
          const nodes = nodesForTrack(track);
          const unlocked = nodes.filter((n) => (state.nodeStates[n.id] ?? n.defaultState) === 'unlocked');
          const mastered = nodes.filter((n) => (state.nodeStates[n.id] ?? n.defaultState) === 'mastered');
          return (
            <View key={track} style={{ marginTop: space[8] }}>
              <Text variant="h3">{track === 'calisthenics' ? 'Calisthenics' : 'Pilates'}</Text>
              <Text variant="caption" colorToken={color.neutral.warmgray700}>
                {mastered.length} mastered
              </Text>
              {unlocked.map((n) => (
                <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], marginTop: space[4] }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: color.node.unlocked }} />
                  <Text variant="caption">{n.name} — unlocked</Text>
                </View>
              ))}
            </View>
          );
        })}
        <Button label="View progression status" variant="tertiary" onPress={() => nav.navigate('Workout', { screen: 'ProgressionStatus' })} />
      </Card>
    </ScreenContainer>
  );
}
