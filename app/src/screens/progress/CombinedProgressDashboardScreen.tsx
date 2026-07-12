import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, NodeStateBadge, ProgressRing, TrendChart, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { totalsForEntries } from '../../data/compute';
import { useAppState } from '../../state/AppStateContext';
import { todayKey, useDayTotals, useNodeStateResolver } from '../../state/selectors';
import { CALISTHENICS_LINES, PILATES_TIERS } from '../../data/skillTree';

/**
 * Combined Progress Dashboard (P1) — the cross-module payoff: weight trend,
 * calorie-balance trend, and workout tier-progression in three clearly SEPARATE
 * titled sections (Req 8, Req 12).
 *
 * Carry-forward #6: the carbs macro (gold-dark #A9761E) and the unlocked-node
 * indicator (#A85F12) are perceptually close, so they live in different titled
 * sections AND each carries its icon/label pairing (ProgressRing label /
 * NodeStateBadge) — never bare adjacent colored dots.
 *
 * DATA CONTRACT: `{ weights[], calTrend[], targets, workoutTiers[] }`. The whole
 * workout section is OMITTED for users who never opted in / fully deferred both
 * tracks (D1, §G #9) — not shown as a locked placeholder.
 */
export function CombinedProgressDashboardScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { weights, diary, targets, moduleInterest, placement, customFoods } = useAppState();
  const nodeState = useNodeStateResolver();
  const date = todayKey();
  const totals = useDayTotals(date);

  const last7Dates: string[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const calTrend = last7Dates.map((d) => ({ label: d.slice(5), value: totalsForEntries(diary[d] ?? [], customFoods).kcal }));

  const showWorkout = moduleInterest.trainWorkout && (placement.calisthenics.status === 'done' || placement.pilates.status === 'done');

  const calCurrent = [...CALISTHENICS_LINES.flatMap((l) => l.nodes)]
    .filter((n) => nodeState(n.id) !== 'locked')
    .sort((a, b) => b.tier - a.tier)[0];
  const pilCurrent = [...PILATES_TIERS].filter((t) => nodeState(t.id) !== 'locked').sort((a, b) => b.tier - a.tier)[0];

  return (
    <Screen>
      <AppText variant="h2">Your progress</AppText>

      <Section title="Weight trend">
        <Card onPress={() => navigation.navigate('WeightLog')}>
          <TrendChart points={weights.map((w) => ({ label: w.date.slice(5), value: w.kg }))} color={theme.brand.deepGreen} unit="kg" />
        </Card>
      </Section>

      <Section title="Calorie balance">
        <Card onPress={() => navigation.navigate('DailyNutritionSummary')}>
          <TrendChart points={calTrend} color={theme.macro.calories} unit="kcal" />
          <Row style={{ justifyContent: 'space-around', marginTop: theme.spacing.space12 }}>
            <ProgressRing progress={totals.carbs_g / targets.carbs_g} color={theme.macro.carbs} label="Carbs" valueText={`${Math.round(totals.carbs_g)}g`} size={72} />
            <ProgressRing progress={totals.protein_g / targets.protein_g} color={theme.macro.protein} label="Protein" valueText={`${Math.round(totals.protein_g)}g`} size={72} />
          </Row>
        </Card>
      </Section>

      {/* Workout section OMITTED for users who never opted in / fully deferred both tracks (D1, §G #9). */}
      {showWorkout ? (
        <Section title="Workout tiers">
          <Card onPress={() => navigation.navigate('ProgressionStatus')}>
            {placement.calisthenics.status === 'done' ? (
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyEmphasis">Calisthenics · Tier {placement.calisthenics.startingTier}</AppText>
                  <AppText variant="caption" color={theme.neutrals.charcoal}>
                    {calCurrent ? `Now working on ${calCurrent.name}` : 'No lines started yet'}
                  </AppText>
                </View>
                <NodeStateBadge state={calCurrent ? nodeState(calCurrent.id) : 'locked'} />
              </Row>
            ) : null}
            {placement.pilates.status === 'done' ? (
              <Row style={{ justifyContent: 'space-between', marginTop: theme.spacing.space12 }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyEmphasis">Pilates · {pilCurrent?.name ?? 'Basic Mat'}</AppText>
                  <AppText variant="caption" color={theme.neutrals.charcoal}>
                    {pilCurrent ? `Working toward the next tier` : 'Not started yet'}
                  </AppText>
                </View>
                <NodeStateBadge state={pilCurrent ? nodeState(pilCurrent.id) : 'locked'} />
              </Row>
            ) : null}
          </Card>
        </Section>
      ) : null}
    </Screen>
  );
}
