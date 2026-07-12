import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CalendarDatePicker, Card, ListRow, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { SAMPLE_MARKED_DAYS } from '../../data/sampleData';

// PLACEHOLDER past sessions (real session history is app-builder's job).
const SAMPLE_SESSIONS = [
  { id: 's1', date: 'Fri, Jul 11', summary: '3 attempts · push + handstand lines' },
  { id: 's2', date: 'Wed, Jul 09', summary: '2 attempts · pull + core lines' },
];

/**
 * Workout History / Session Calendar (W8) — past sessions (Req 8, 11).
 *
 * DATA CONTRACT: `{ markedDates; sessions: Session[] }`. Tapping a day/session
 * opens that session's logged attempts (read view). Zero sessions shows an
 * explanatory empty state with a CTA into Log Workout Session (C5).
 */
export function WorkoutHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [month, setMonth] = useState(new Date(2026, 6, 1));
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <Screen>
      <AppText variant="h2">Session history</AppText>
      <Card>
        <CalendarDatePicker
          month={month}
          selectedDate={selected}
          markedDates={SAMPLE_MARKED_DAYS}
          onChangeMonth={setMonth}
          onSelectDay={setSelected}
        />
      </Card>

      <Section title="Recent sessions">
        {SAMPLE_SESSIONS.map((s) => (
          <Card key={s.id}>
            <ListRow title={s.date} subtitle={s.summary} showChevron onPress={() => navigation.navigate('WorkoutSessionLog')} />
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
