import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CalendarDatePicker, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { SAMPLE_MARKED_DAYS } from '../../data/sampleData';

/**
 * Nutrition History / Calendar (N12) — past days, tap into any day (Req 3).
 *
 * DATA CONTRACT: `markedDates: Set<'YYYY-MM-DD'>` of days with logged data;
 * each marked day carries a completeness indicator (the calendar's dot). Empty
 * days route to the same first-run empty Diary/Summary state (B6).
 */
export function NutritionHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [month, setMonth] = useState(new Date(2026, 6, 1));
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <Screen>
      <AppText variant="h2">History</AppText>
      <Card>
        <CalendarDatePicker
          month={month}
          selectedDate={selected}
          markedDates={SAMPLE_MARKED_DAYS}
          onChangeMonth={setMonth}
          onSelectDay={(d) => {
            setSelected(d);
            navigation.navigate('DailyNutritionSummary');
          }}
        />
      </Card>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Dots mark days with logged entries. Tap any day to open its summary.
      </AppText>
    </Screen>
  );
}
