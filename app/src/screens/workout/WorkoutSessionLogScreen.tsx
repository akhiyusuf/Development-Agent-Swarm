import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ListRow, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { CALISTHENICS_LINES, describeThreshold } from '../../data/skillTree';
import { useAppDispatch } from '../../state/AppStateContext';
import { useNodeStateResolver, todayKey } from '../../state/selectors';
import type { SessionRowRecord } from '../../state/types';

/**
 * Workout Session Log (W7, modal) — FREEFORM logging only. Per the pipeline
 * carry-forward, there is deliberately NO guided Session Player screen here
 * (the design system's SessionPlayer has no sitemap destination; W7 stays
 * freeform-logging-only). Req 11.
 *
 * DATA CONTRACT: `{ rows: SessionRow[] }`. Each attempt row reuses the Log
 * Attempt entry pattern against a chosen actionable node. Save records the
 * whole session as one unit ([CP-OFFLINE] at session AND row level). The whole
 * in-progress session is discarded on back-out (C4) — unlike per-node Log
 * Attempt (C2) which commits immediately. Save is blocked until ≥1 row exists.
 */
export function WorkoutSessionLogScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const nodeState = useNodeStateResolver();
  const [rows, setRows] = useState<SessionRowRecord[]>([]);

  // Actionable nodes the user could add an attempt against.
  const actionable = CALISTHENICS_LINES.flatMap((l) => l.nodes).filter((n) => nodeState(n.id) !== 'locked');

  function addRow() {
    if (actionable.length === 0) return;
    const next = actionable[rows.length % actionable.length];
    setRows((r) => [...r, { nodeId: next.id, nodeName: next.name, result: describeThreshold(next.threshold) }]);
  }

  return (
    <Screen>
      <AppText variant="h2">Session log</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        A freeform journal of what you trained. Attempts here don't need to hit a gate.
      </AppText>

      <Card>
        {rows.length === 0 ? (
          <StatusBadge tone="info" label="Add at least one attempt to save a session" />
        ) : (
          <View>
            {rows.map((r, i) => (
              <ListRow key={`${r.nodeId}-${i}`} title={r.nodeName} subtitle={r.result} />
            ))}
          </View>
        )}
      </Card>

      <Row style={{ justifyContent: 'space-between' }}>
        <AppText variant="bodyEmphasis">{rows.length} attempts</AppText>
        <Button variant="tertiary" label="Add attempt" onPress={addRow} />
      </Row>

      <Button
        label="Save session"
        onPress={() => {
          if (rows.length > 0) {
            dispatch({ type: 'SAVE_SESSION', rows, date: todayKey() });
            navigation.goBack();
          }
        }}
      />
      <Button variant="tertiary" label="Discard" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
