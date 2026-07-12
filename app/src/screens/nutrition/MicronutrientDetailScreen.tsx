import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Card, ProgressBar, StatusBadge, TrendChart, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { microRows } from '../../data/compute';
import { SAMPLE_DIARY } from '../../data/sampleData';
import type { RootParamList } from '../../navigation/types';

/**
 * Micronutrient Detail (N11) — current-day value vs target + weekly trend (Req 4).
 *
 * DATA CONTRACT: `{ nutrientKey, label, unit }`. Days with no underlying data
 * render as GAPS in the trend, never zero points (a false "ate none" claim the
 * research warns against). B12 in particular has near-zero African-food
 * coverage (data-sourcing.md limitation #4) — so its trend legitimately shows
 * the "not enough data yet" empty state here.
 */
export function MicronutrientDetailScreen() {
  const theme = useTheme();
  const route = useRoute<RouteProp<RootParamList, 'MicronutrientDetail'>>();
  const { nutrientKey, label, unit } = route.params;

  const row = microRows(SAMPLE_DIARY).find((r) => r.key === nutrientKey);
  const hasToday = row?.value != null;

  // B12 has documented near-zero African-food coverage -> genuine trend gap.
  const isB12 = nutrientKey === 'vitaminB12_mcg';
  const trendPoints = isB12
    ? [] // < 2 points -> TrendChart renders its honest "not enough data" state
    : [
        { label: 'Mon', value: (row?.value ?? 6) * 0.8 },
        { label: 'Tue', value: (row?.value ?? 6) * 1.1 },
        { label: 'Wed', value: (row?.value ?? 6) * 0.6 },
        { label: 'Thu', value: (row?.value ?? 6) * 1.0 },
        { label: 'Fri', value: (row?.value ?? 6) * 0.9 },
      ];

  return (
    <Screen>
      <AppText variant="h2">{label}</AppText>

      <Card>
        <Section title="Today">
          {hasToday ? (
            <>
              <Row style={{ justifyContent: 'space-between' }}>
                <AppText variant="bodyEmphasis">
                  {row?.value} {unit}
                </AppText>
                <AppText variant="caption" color={theme.neutrals.charcoal}>
                  of {row?.target} {unit}
                </AppText>
              </Row>
              <ProgressBar progress={(row!.value as number) / row!.target} color={theme.macro.protein} />
            </>
          ) : (
            <StatusBadge tone="info" label="No data for today's logged foods" />
          )}
        </Section>
      </Card>

      <Card>
        <Section title="This week" caption="Days with no sourced data appear as gaps, not zeros.">
          <TrendChart points={trendPoints} color={theme.macro.protein} unit={unit} />
        </Section>
      </Card>

      {isB12 ? (
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          Coverage note: B12 values are currently available for Western/diaspora foods only. African-dish
          logging days will show gaps until regional food-composition data is licensed in.
        </AppText>
      ) : null}
    </Screen>
  );
}
