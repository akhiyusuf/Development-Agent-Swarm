import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row } from '../ui/layout';
import type { MicroRow } from '../data/compute';

/**
 * One micronutrient row. Renders the explicit Req-4 graceful "no data" state
 * (icon + caption, never a false zero) when the logged foods carry no value.
 */
export function MicroBar({ row }: { row: MicroRow }) {
  const theme = useTheme();
  const hasData = row.value != null;
  const pct = hasData ? (row.value as number) / row.target : 0;

  return (
    <View style={{ gap: theme.spacing.space4 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="caption">{row.label}</AppText>
        {hasData ? (
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            {row.value} / {row.target} {row.unit}
          </AppText>
        ) : (
          <Row style={{ gap: 4 }}>
            <Ionicons name="help-circle-outline" size={14} color={theme.neutrals.placeholder} />
            <AppText variant="caption" color={theme.neutrals.placeholder}>
              No data
            </AppText>
          </Row>
        )}
      </Row>
      <ProgressBar progress={pct} color={hasData ? theme.macro.protein : theme.neutrals.border} />
    </View>
  );
}
