import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { MicroBar } from '../../components/MicroBar';
import { useAppState } from '../../state/AppStateContext';
import { todayKey, useDayTotals, useMicroRows } from '../../state/selectors';

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
  const { targets } = useAppState();
  const date = todayKey();
  const totals = useDayTotals(date);
  const micros = useMicroRows(date);

  return (
    <Screen>
      <AppText variant="h2">Daily summary</AppText>

      <Card>
        <Row style={{ justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <ProgressRing progress={totals.kcal / targets.kcal} color={theme.macro.calories} label="Calories" valueText={`${totals.kcal}`} size={110} />
          <View style={{ gap: theme.spacing.space8 }}>
            <ProgressRing progress={totals.protein_g / targets.protein_g} color={theme.macro.protein} label="Protein" valueText={`${Math.round(totals.protein_g)}g`} size={68} />
            <ProgressRing progress={totals.fat_g / targets.fat_g} color={theme.macro.fat} label="Fat" valueText={`${Math.round(totals.fat_g)}g`} size={68} />
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
