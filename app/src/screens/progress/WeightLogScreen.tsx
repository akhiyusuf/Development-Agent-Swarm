import React, { useMemo, useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ListRow } from '../../components/ListRow';
import { TrendChart, TrendPoint } from '../../components/TrendChart';
import { BottomSheet } from '../../components/BottomSheet';
import { Input } from '../../components/Input';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** P2. Weight Log — add/view weight entries. */
export function WeightLogScreen() {
  const { state, dispatch, isOnline, uid, todayStr } = useAppState();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [input, setInput] = useState('');
  // Deletion requires an explicit confirm step (matches N9 entry-delete and
  // S2 account-delete) rather than deleting on a bare row tap.
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const trend: TrendPoint[] = useMemo(() => {
    const points: TrendPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const entry = state.weightLog.find((w) => w.date === dateStr);
      points.push({ label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), value: entry ? entry.kg : null });
    }
    return points;
  }, [state.weightLog]);

  const save = () => {
    const kg = Number(input);
    if (!kg) return;
    dispatch({ type: 'ADD_WEIGHT', entry: { id: uid(), date: todayStr(), kg, queued: !isOnline } });
    setInput('');
    setSheetVisible(false);
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Weight Log</Text>
      <Card>
        <TrendChart data={trend} unit="kg" />
      </Card>
      <Button label="Add weight" onPress={() => setSheetVisible(true)} />
      {state.weightLog.map((w) =>
        confirmDeleteId === w.id ? (
          <Card key={w.id} state="error">
            <Text variant="body" colorToken={color.semantic.error}>
              Delete the {w.kg} kg entry from {w.date}? This can't be undone.
            </Text>
            <Button
              label="Yes, delete"
              destructive
              variant="tertiary"
              onPress={() => {
                dispatch({ type: 'DELETE_WEIGHT', id: w.id });
                setConfirmDeleteId(null);
              }}
            />
            <Button label="Cancel" variant="tertiary" onPress={() => setConfirmDeleteId(null)} />
          </Card>
        ) : (
          <ListRow
            key={w.id}
            title={`${w.kg} kg`}
            subtitle={w.date}
            onPress={() => setConfirmDeleteId(w.id)}
            meta={w.queued ? 'Queued' : undefined}
          />
        )
      )}
      <Text variant="caption" colorToken={color.neutral.warmgray700}>
        Tap an entry to remove it (a confirm step follows before anything is deleted).
      </Text>

      <BottomSheet visible={sheetVisible} onDismiss={() => setSheetVisible(false)} title="Log your weight">
        <Input label="Weight (kg)" keyboardType="numeric" value={input} onChangeText={setInput} placeholder="70" />
        <Button label="Save" onPress={save} />
      </BottomSheet>
    </ScreenContainer>
  );
}
