import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { MicroBar } from '../../components/MicroBar';
import { microRows, totalsForEntries } from '../../data/compute';
import { SAMPLE_DIARY, SAMPLE_QUEUED_COUNT, SAMPLE_TARGETS } from '../../data/sampleData';

/**
 * Home (Today Dashboard) — energy-balance card, micronutrient snapshot, quick
 * actions, and the offline/sync status indicator (Req 3 + Req 12 aggregation).
 *
 * DATA CONTRACT: expects
 *   { entries: DiaryEntry[]; targets: Targets; queuedCount: number;
 *     logMeal(): void; logWorkoutSession(): void; quickAddWeight(): void }
 * Cache-first render, no spinner on the common case (F1); first-run zero-data
 * shows the empty states below, not a loader. Quick actions open modals as
 * OVERLAYS on Home and rejoin back to Home on save/discard (F1 fork/join).
 */
export function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const totals = totalsForEntries(SAMPLE_DIARY);
  const micros = microRows(SAMPLE_DIARY);
  const calProgress = totals.kcal / SAMPLE_TARGETS.kcal;
  const calStatus = calProgress > 1 ? 'exceeded' : calProgress > 0.9 ? 'approaching' : 'normal';

  return (
    <Screen>
      {/* Sync / offline status — Req 5 screen-level surface. */}
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="h2">Today</AppText>
        {SAMPLE_QUEUED_COUNT > 0 ? (
          <StatusBadge tone="info" label={`${SAMPLE_QUEUED_COUNT} queued to sync`} />
        ) : (
          <StatusBadge tone="success" label="Synced" />
        )}
      </Row>

      {/* Energy-balance summary */}
      <Card>
        <Row style={{ justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <ProgressRing
            progress={calProgress}
            color={theme.macro.calories}
            label="Calories"
            valueText={`${totals.kcal}`}
            status={calStatus}
            size={120}
          />
          <View style={{ justifyContent: 'space-around', gap: theme.spacing.space12 }}>
            <ProgressRing progress={totals.protein_g / SAMPLE_TARGETS.protein_g} color={theme.macro.protein} label="Protein" valueText={`${Math.round(totals.protein_g)}g`} size={72} />
            <ProgressRing progress={totals.carbs_g / SAMPLE_TARGETS.carbs_g} color={theme.macro.carbs} label="Carbs" valueText={`${Math.round(totals.carbs_g)}g`} size={72} />
          </View>
        </Row>
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          {SAMPLE_TARGETS.kcal - totals.kcal} kcal remaining of {SAMPLE_TARGETS.kcal}
        </AppText>
      </Card>

      {/* Micronutrient snapshot — partial-coverage aware (Req 4). */}
      <Card>
        <Section title="Micronutrients" caption="No-data states are honest gaps, never a false zero.">
          <View style={{ gap: theme.spacing.space12 }}>
            {micros.map((row) => (
              <MicroBar key={String(row.key)} row={row} />
            ))}
          </View>
        </Section>
      </Card>

      {/* Quick actions — overlays that rejoin to Home (F1). */}
      <Button label="Log Meal" onPress={() => navigation.navigate('AddEntry')} />
      <Button variant="secondary" label="Log Workout Session" onPress={() => navigation.navigate('WorkoutSessionLog')} />
      <Button variant="tertiary" label="Quick-add Weight" onPress={() => navigation.navigate('QuickAddWeight')} />
    </Screen>
  );
}
