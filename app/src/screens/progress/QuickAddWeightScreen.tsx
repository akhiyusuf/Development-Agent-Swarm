import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { useAppDispatch } from '../../state/AppStateContext';
import { todayKey } from '../../state/selectors';

/**
 * Quick-add Weight Entry (modal) — single numeric input, Save. Reached
 * identically from Home and from within Weight Log (D2).
 *
 * DATA CONTRACT: on Save, append a weight entry (offline: queues). [CP-VALIDATION]:
 * plausible-range check on the numeric input. Home shows no weight card, so from
 * Home this just returns to Home; the effect is visible in Progress (D2/F1).
 */
export function QuickAddWeightScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const num = Number(value);
  const valid = value.trim() !== '' && !Number.isNaN(num) && num > 20 && num < 400;

  return (
    <Screen>
      <AppText variant="h2">Add weight</AppText>
      <Card>
        <TextField
          label="Weight (kg)"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          placeholder="80"
          error={touched && !valid}
          errorMessage="Enter a plausible weight (20–400 kg)"
        />
      </Card>
      <Button
        label="Save"
        onPress={() => {
          setTouched(true);
          if (valid) {
            dispatch({ type: 'ADD_WEIGHT', kg: num, date: todayKey() });
            navigation.goBack();
          }
        }}
      />
      <Button variant="tertiary" label="Cancel" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
