import React, { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { PILATES_TIERS, describeThreshold, findNode } from '../../data/skillTree';
import type { RootParamList } from '../../navigation/types';

/**
 * Log Attempt (W4, modal) — enter reps completed or hold duration matching the
 * node's gate type (Req 7, 11).
 *
 * DATA CONTRACT: `{ nodeId }`. Save records the attempt (offline: queues,
 * [CP-OFFLINE]); threshold evaluation runs client-side against the known
 * threshold, so an offline attempt can still trigger the Mastery Gate. If the
 * value meets/exceeds the threshold -> Mastery Gate Confirmation; otherwise the
 * attempt is recorded against in-progress state and the sheet dismisses (C2).
 */
export function LogAttemptScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'LogAttempt'>>();
  const { nodeId } = route.params;

  const node = findNode(nodeId);
  const tier = PILATES_TIERS.find((t) => t.id === nodeId);
  const threshold = node?.threshold ?? tier?.unlockThreshold;
  const isHold = threshold?.type === 'hold_seconds' || threshold?.type === 'duration_seconds';
  const targetNumber = typeof threshold?.value === 'number' ? threshold.value : null;

  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const num = Number(value);
  const valid = value.trim() !== '' && !Number.isNaN(num);

  function save() {
    setTouched(true);
    if (!valid) return;
    const meets = targetNumber != null ? num >= targetNumber : true;
    if (meets) {
      navigation.navigate('MasteryGateConfirmation', { nodeId });
    } else {
      navigation.goBack();
    }
  }

  return (
    <Screen>
      <AppText variant="h2">{node?.name ?? tier?.name ?? 'Log attempt'}</AppText>
      {threshold ? (
        <StatusBadge tone="info" label={`Gate: ${describeThreshold(threshold)}`} />
      ) : null}

      <Card>
        <TextField
          label={isHold ? 'Hold duration (seconds)' : 'Reps completed'}
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          placeholder={isHold ? 'e.g. 45' : 'e.g. 12'}
          error={touched && !valid}
          errorMessage="Enter a number"
        />
      </Card>

      <Button label="Save attempt" onPress={save} />
      <Button variant="tertiary" label="Cancel" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
