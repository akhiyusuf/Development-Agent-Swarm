import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, NodeStateBadge, ProgressRing, TrendChart, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { SAMPLE_CAL_TREND, SAMPLE_TARGETS, SAMPLE_WEIGHTS } from '../../data/sampleData';
import { totalsForEntries } from '../../data/compute';
import { SAMPLE_DIARY } from '../../data/sampleData';

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
  const totals = totalsForEntries(SAMPLE_DIARY);

  return (
    <Screen>
      <AppText variant="h2">Your progress</AppText>

      <Section title="Weight trend">
        <Card onPress={() => navigation.navigate('WeightLog')}>
          <TrendChart points={SAMPLE_WEIGHTS.map((w) => ({ label: w.date, value: w.kg }))} color={theme.brand.deepGreen} unit="kg" />
        </Card>
      </Section>

      <Section title="Calorie balance">
        <Card onPress={() => navigation.navigate('DailyNutritionSummary')}>
          <TrendChart points={SAMPLE_CAL_TREND} color={theme.macro.calories} unit="kcal" />
          <Row style={{ justifyContent: 'space-around', marginTop: theme.spacing.space12 }}>
            <ProgressRing progress={totals.carbs_g / SAMPLE_TARGETS.carbs_g} color={theme.macro.carbs} label="Carbs" valueText={`${Math.round(totals.carbs_g)}g`} size={72} />
            <ProgressRing progress={totals.protein_g / SAMPLE_TARGETS.protein_g} color={theme.macro.protein} label="Protein" valueText={`${Math.round(totals.protein_g)}g`} size={72} />
          </Row>
        </Card>
      </Section>

      <Section title="Workout tiers">
        <Card onPress={() => navigation.navigate('ProgressionStatus')}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyEmphasis">Calisthenics · Tier 2</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                Next unlocks approaching on the push and handstand lines.
              </AppText>
            </View>
            <NodeStateBadge state="unlocked" />
          </Row>
          <Row style={{ justifyContent: 'space-between', marginTop: theme.spacing.space12 }}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyEmphasis">Pilates · Basic Mat</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                Working toward the Intermediate tier.
              </AppText>
            </View>
            <NodeStateBadge state="inProgress" />
          </Row>
        </Card>
      </Section>
    </Screen>
  );
}
