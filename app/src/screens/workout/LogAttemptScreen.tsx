import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper';
import { StatusBadge } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getNodeDef } from '../../data/skillTree';

/** W4. Log Attempt — reps or hold duration; routes to Mastery Gate Confirmation on success. */
export function LogAttemptScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { nodeId, sessionId } = route.params;
  const def = getNodeDef(nodeId);
  const { dispatch, isOnline, uid } = useAppState();
  const [value, setValue] = useState(def?.gateType === 'hold' ? 15 : 8);

  if (!def) return null;

  const save = () => {
    dispatch({
      type: 'LOG_ATTEMPT',
      attempt: {
        id: uid(),
        nodeId,
        track: def.track,
        value,
        gateType: def.gateType,
        timestamp: new Date().toISOString(),
        sessionId: sessionId ?? 'standalone',
        queued: !isOnline,
      },
    });
    // AppStateContext computes lastGateEvent synchronously in the reducer;
    // MasteryGateConfirmation reads it directly from state.
    nav.navigate('MasteryGateConfirmation', { nodeId });
  };

  return (
    <ScreenContainer density="relaxed" forceDark>
      <Text variant="h1" colorToken={color.neutral.white}>
        Log attempt
      </Text>
      <Text variant="body" colorToken="#C9C6BE">
        {def.name} · {def.gateType === 'reps' ? 'Reps completed' : 'Hold duration (seconds)'}
      </Text>
      <Text variant="timerXl" colorToken={color.neutral.white} center>
        {value}
      </Text>
      <Stepper value={value} onChange={setValue} min={1} max={def.gateType === 'hold' ? 300 : 100} step={def.gateType === 'hold' ? 5 : 1} />
      {!isOnline ? <StatusBadge tone="info" label="Offline — will queue and sync later" /> : null}
      <Button label="Save attempt" onPress={save} />
      <Button label="Dismiss" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
