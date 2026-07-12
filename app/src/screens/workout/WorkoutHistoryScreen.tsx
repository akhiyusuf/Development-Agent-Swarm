import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CalendarDatePicker, Card, ListRow, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { useAppState } from '../../state/AppStateContext';

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
  const { sessions } = useAppState();
  const markedDates = new Set(sessions.map((s) => s.date));
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  return (
    <Screen>
      <AppText variant="h2">Session history</AppText>
      <Card>
        <CalendarDatePicker
          month={month}
          selectedDate={selected}
          markedDates={markedDates}
          onChangeMonth={setMonth}
          onSelectDay={setSelected}
        />
      </Card>

      <Section title="Recent sessions">
        {sessions.length === 0 ? (
          <Card>
            <AppText variant="body" color={theme.neutrals.charcoal}>
              No sessions logged yet.
            </AppText>
            <StatusBadge tone="info" label="Log a session to see it here" />
          </Card>
        ) : (
          sessions.map((s) => (
            <Card key={s.id}>
              <ListRow
                title={s.date}
                subtitle={`${s.rows.length} attempt${s.rows.length === 1 ? '' : 's'} · ${s.rows
                  .map((r) => r.nodeName)
                  .slice(0, 2)
                  .join(', ')}`}
                showChevron
                onPress={() => navigation.navigate('WorkoutSessionLog')}
                badge={s.queued ? { color: theme.semantic.info, icon: 'cloud-upload-outline', label: 'Queued' } : undefined}
              />
            </Card>
          ))
        )}
      </Section>
    </Screen>
  );
}
