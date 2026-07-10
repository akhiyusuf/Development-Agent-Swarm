import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { Input } from '../../components/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { nodesForTrack, getNodeDef } from '../../data/skillTree';
import type { Track } from '../../data/skillTree';

/**
 * W7. Workout Session Log — FREEFORM logging only (nodes attempted,
 * reps/holds recorded). Per the build's explicit carry-forward: no guided/
 * timed Session Player is built here (see BUILD_NOTES.md, deviation #3) —
 * the design-system's §4.8/§5 shared session-player component has no
 * sitemap destination, so it's intentionally not built.
 */
export function WorkoutSessionLogScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch, isOnline, uid, todayStr } = useAppState();
  const [track, setTrack] = useState<Track>('calisthenics');
  const [note, setNote] = useState('');
  const [sessionId] = useState(() => uid());

  const actionableNodes = nodesForTrack(track).filter((n) => {
    const s = state.nodeStates[n.id] ?? n.defaultState;
    return s !== 'locked';
  });

  const attemptsForSession = state.attempts.filter((a) => a.sessionId === sessionId);

  const addAttempt = (nodeId: string) => {
    nav.navigate('LogAttempt', { nodeId, sessionId });
  };

  const save = () => {
    dispatch({
      type: 'SAVE_SESSION',
      session: {
        id: sessionId,
        date: todayStr(),
        track,
        attemptIds: attemptsForSession.map((a) => a.id),
        note,
        queued: !isOnline,
      },
    });
    nav.goBack();
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">Log a session</Text>
      <SegmentedControl
        options={[
          { value: 'calisthenics', label: 'Calisthenics' },
          { value: 'pilates', label: 'Pilates' },
        ]}
        value={track}
        onChange={(v) => setTrack(v as Track)}
      />

      <Card>
        <Text variant="h3">Attempts this session</Text>
        {attemptsForSession.length === 0 ? (
          <Text variant="caption" colorToken={color.neutral.warmgray700}>
            No attempts logged yet — add one below.
          </Text>
        ) : (
          <View style={{ gap: space[8], marginTop: space[8] }}>
            {attemptsForSession.map((a) => (
              <Text key={a.id} variant="body">
                {getNodeDef(a.nodeId)?.name}: {a.value} {a.gateType === 'reps' ? 'reps' : 'sec hold'}
              </Text>
            ))}
          </View>
        )}
      </Card>

      <Text variant="h3">Actionable nodes</Text>
      <View style={{ gap: space[8] }}>
        {actionableNodes.map((n) => (
          <Card key={n.id} onPress={() => addAttempt(n.id)}>
            <Text variant="body">{n.name}</Text>
            <Text variant="caption" colorToken={color.neutral.warmgray700}>
              {state.nodeStates[n.id] ?? n.defaultState} · tap to log an attempt
            </Text>
          </Card>
        ))}
      </View>

      <Input label="Session note (optional)" value={note} onChangeText={setNote} placeholder="How did it feel?" />
      {!isOnline ? <StatusBadge tone="info" label="Offline — session will queue and sync later" /> : null}
      <Button label="Save session" onPress={save} />
      <Button label="Discard" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
