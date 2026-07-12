import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { MicroBar } from '../../components/MicroBar';
import { microRows, totalsForEntries } from '../../data/compute';
import { SAMPLE_DIARY, SAMPLE_TARGETS } from '../../data/sampleData';

/**
 * Daily Nutrition Summary (N10) — calories, macro breakdown, full micronutrient
 * panel with graceful per-nutrient "no data" states (Req 3, Req 4).
 *
 * DATA CONTRACT: `{ entries: DiaryEntry[]; targets: Targets; date }`. Each
 * nutrient row taps into Micronutrient Detail. First-run zero-logged shows the
 * target-only state (B5), not empty rings.
 */
export function DailyNutritionSummaryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const totals = totalsForEntries(SAMPLE_DIARY);
  const micros = microRows(SAMPLE_DIARY);

  return (
    <Screen>
      <AppText variant="h2">Daily summary</AppText>

      <Card>
        <Row style={{ justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <ProgressRing progress={totals.kcal / SAMPLE_TARGETS.kcal} color={theme.macro.calories} label="Calories" valueText={`${totals.kcal}`} size={110} />
          <View style={{ gap: theme.spacing.space8 }}>
            <ProgressRing progress={totals.protein_g / SAMPLE_TARGETS.protein_g} color={theme.macro.protein} label="Protein" valueText={`${Math.round(totals.protein_g)}g`} size={68} />
            <ProgressRing progress={totals.fat_g / SAMPLE_TARGETS.fat_g} color={theme.macro.fat} label="Fat" valueText={`${Math.round(totals.fat_g)}g`} size={68} />
          </View>
        </Row>
      </Card>

      <Section title="Micronutrients" caption="Tap a nutrient for its weekly trend. Uncoded foods read 'no data', never zero.">
        {micros.map((row) => (
          <Card key={String(row.key)} onPress={() => navigation.navigate('MicronutrientDetail', { nutrientKey: row.key, label: row.label, unit: row.unit })}>
            <MicroBar row={row} />
          </Card>
        ))}
      </Section>

      <Button variant="tertiary" label="View history" onPress={() => navigation.navigate('NutritionHistory')} />
    </Screen>
  );
}
