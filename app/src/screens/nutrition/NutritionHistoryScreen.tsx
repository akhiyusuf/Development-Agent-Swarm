import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CalendarDatePicker, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { useAppState } from '../../state/AppStateContext';

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
  const { diary } = useAppState();
  const markedDates = new Set(Object.keys(diary).filter((d) => diary[d].length > 0));
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <Screen>
      <AppText variant="h2">History</AppText>
      <Card>
        <CalendarDatePicker
          month={month}
          selectedDate={selected}
          markedDates={markedDates}
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
