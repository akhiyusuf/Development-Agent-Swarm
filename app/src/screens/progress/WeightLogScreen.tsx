import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ListRow, TrendChart, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Weight Log (P2) — add/view weight entries; also reachable as quick-add from
 * Home (Req 12).
 *
 * DATA CONTRACT: `{ entries: { date, kg }[] }`. Add opens the Quick-add sheet;
 * delete requires an explicit confirm (matching N9). Offline: queues
 * ([CP-OFFLINE]). 0/1 points shows the "log more to see a trend" state (D2).
 */
export function WeightLogScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { weights } = useAppState();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <Screen>
      <Section title="Trend" caption={weights.length < 2 ? 'Log more entries to see a trend.' : undefined}>
        <Card>
          <TrendChart points={weights.map((w) => ({ label: w.date.slice(5), value: w.kg }))} color={theme.brand.deepGreen} unit="kg" />
        </Card>
      </Section>

      <Button label="Add weight" onPress={() => navigation.navigate('QuickAddWeight')} />

      <Section title="Entries">
        {weights.length === 0 ? (
          <AppText variant="caption" color={theme.neutrals.placeholder}>
            No weight entries yet.
          </AppText>
        ) : (
          weights.slice().reverse().map((w) => {
            const id = w.id;
            const confirming = confirmId === id;
            return (
              <Card key={id} error={confirming}>
                <ListRow
                  title={`${w.kg} kg`}
                  subtitle={w.date}
                  trailingText={confirming ? undefined : 'Delete'}
                  onPress={() => setConfirmId(confirming ? null : id)}
                />
                {confirming ? (
                  <View style={{ gap: theme.spacing.space8, marginTop: theme.spacing.space8 }}>
                    <AppText variant="caption" color={theme.semantic.error}>
                      Delete this entry?
                    </AppText>
                    <Button
                      label="Yes, delete"
                      error
                      errorMessage=""
                      onPress={() => {
                        dispatch({ type: 'DELETE_WEIGHT', id });
                        setConfirmId(null);
                      }}
                    />
                    <Button variant="tertiary" label="Cancel" onPress={() => setConfirmId(null)} />
                  </View>
                ) : null}
              </Card>
            );
          })
        )}
      </Section>
    </Screen>
  );
}
