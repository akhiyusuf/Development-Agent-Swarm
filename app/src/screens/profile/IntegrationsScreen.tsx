import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** S4. Integrations — Google Fit / Apple Health optional sync. */
export function IntegrationsScreen() {
  const { state, dispatch } = useAppState();

  return (
    <ScreenContainer>
      <Text variant="h1">Integrations</Text>
      {(['googleFit', 'appleHealth'] as const).map((key) => {
        const connected = state.integrations[key];
        return (
          <Card key={key}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[12] }}>
              <Ionicons name={key === 'googleFit' ? 'logo-google' : 'heart-outline'} size={24} color={color.primary.deepgreen} />
              <View style={{ flex: 1 }}>
                <Text variant="h3">{key === 'googleFit' ? 'Google Fit' : 'Apple Health'}</Text>
                {connected ? <StatusBadge tone="success" label="Connected" /> : <StatusBadge tone="neutral" label="Not connected" />}
              </View>
              <Button
                label={connected ? 'Disconnect' : 'Connect'}
                variant={connected ? 'secondary' : 'primary'}
                onPress={() => dispatch({ type: 'SET_INTEGRATION', key, value: !connected })}
              />
            </View>
          </Card>
        );
      })}
    </ScreenContainer>
  );
}
