import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Calendar, DayCompleteness } from '../../components/Calendar';
import { useAppState } from '../../state/AppStateContext';

/** N12. Nutrition History / Calendar. */
export function NutritionHistoryScreen() {
  const nav = useNavigation<any>();
  const { state } = useAppState();
  const [selected, setSelected] = useState<Date | undefined>();

  const getCompleteness = (date: Date): DayCompleteness => {
    const dateStr = date.toISOString().slice(0, 10);
    const entries = state.diary.filter((d) => d.date === dateStr);
    if (entries.length === 0) return 'none';
    const slotsLogged = new Set(entries.map((e) => e.slot)).size;
    return slotsLogged >= 3 ? 'logged' : 'partial';
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">History</Text>
      <Calendar getCompleteness={getCompleteness} onSelectDay={setSelected} selectedDate={selected} />
      {selected ? (
        <Button
          label={`View ${selected.toDateString()}`}
          onPress={() => nav.navigate('DailyNutritionSummary', { date: selected.toISOString().slice(0, 10) })}
        />
      ) : null}
    </ScreenContainer>
  );
}
