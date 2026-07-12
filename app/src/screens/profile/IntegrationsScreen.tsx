import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import type { ConnectionState as ConnState } from '../../state/types';

/**
 * Integrations (S4) — Google Fit / Apple Health connect (Req 13).
 *
 * DATA CONTRACT: `{ providers: { id, state }[]; connect(id) }`. [CP-PERMDENY]:
 * denying the OAuth/permission prompt shows an explicit "not connected" state
 * with a Retry action — never a silently half-connected state (E4). Backing out
 * of the external OAuth flow is treated identically to denial.
 */
export function IntegrationsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { settings } = useAppState();
  const fit = settings.integrations.googleFit;
  const health = settings.integrations.appleHealth;
  const setFit = (s: ConnState) => dispatch({ type: 'SET_INTEGRATION', provider: 'googleFit', state: s });
  const setHealth = (s: ConnState) => dispatch({ type: 'SET_INTEGRATION', provider: 'appleHealth', state: s });

  function providerCard(name: string, state: ConnState, setState: (s: ConnState) => void) {
    return (
      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="h3">{name}</AppText>
          {state === 'connected' ? (
            <StatusBadge tone="success" label="Connected" />
          ) : state === 'denied' ? (
            <StatusBadge tone="warning" label="Not connected" />
          ) : (
            <StatusBadge tone="info" label="Not connected" />
          )}
        </Row>
        {state === 'connected' ? (
          <Button variant="tertiary" label="Disconnect" onPress={() => setState('disconnected')} />
        ) : (
          <Button
            variant="secondary"
            label={state === 'denied' ? 'Try connecting again' : 'Connect'}
            onPress={() => setState('connected')}
          />
        )}
      </Card>
    );
  }

  return (
    <Screen>
      <Section title="Health & fitness">
        {providerCard('Google Fit', fit, setFit)}
        {providerCard('Apple Health', health, setHealth)}
      </Section>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Optional. Connecting lets the app read basic activity data to refine your energy balance.
      </AppText>
    </Screen>
  );
}
