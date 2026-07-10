import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar, DayCompleteness } from '../../components/Calendar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getNodeDef } from '../../data/skillTree';

/** W8. Workout History / Session Calendar. */
export function WorkoutHistoryScreen() {
  const { state } = useAppState();
  const [selected, setSelected] = useState<Date | undefined>();

  const getCompleteness = (date: Date): DayCompleteness => {
    const dateStr = date.toISOString().slice(0, 10);
    return state.sessions.some((s) => s.date === dateStr) ? 'logged' : 'none';
  };

  const selectedStr = selected?.toISOString().slice(0, 10);
  const sessionsForDay = state.sessions.filter((s) => s.date === selectedStr);

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Workout history</Text>
      <Calendar getCompleteness={getCompleteness} onSelectDay={setSelected} selectedDate={selected} />
      {selected ? (
        <View style={{ gap: space[8] }}>
          <Text variant="h3">{selected.toDateString()}</Text>
          {sessionsForDay.length === 0 ? (
            <Text variant="caption" colorToken={color.neutral.warmgray700}>
              No sessions logged this day.
            </Text>
          ) : (
            sessionsForDay.map((s) => {
              const attempts = state.attempts.filter((a) => s.attemptIds.includes(a.id));
              return (
                <Card key={s.id}>
                  <Text variant="h3">{s.track === 'calisthenics' ? 'Calisthenics' : 'Pilates'} session</Text>
                  {attempts.map((a) => (
                    <Text key={a.id} variant="body">
                      {getNodeDef(a.nodeId)?.name}: {a.value} {a.gateType === 'reps' ? 'reps' : 'sec'}
                    </Text>
                  ))}
                  {s.note ? (
                    <Text variant="caption" colorToken={color.neutral.warmgray700}>
                      "{s.note}"
                    </Text>
                  ) : null}
                </Card>
              );
            })
          )}
        </View>
      ) : null}
    </ScreenContainer>
  );
}
