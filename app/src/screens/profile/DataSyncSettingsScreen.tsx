import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { StatusBadge } from '../../components/StatusBadge';
import { ListRow } from '../../components/ListRow';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** S3. Data & Sync Settings — offline status, manual sync, low-data-mode toggle. */
export function DataSyncSettingsScreen() {
  const { state, dispatch, isOnline, queuedCount } = useAppState();

  const failedEntries = state.diary.filter((d) => d.syncFailed);

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Data & Sync</Text>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="h3">Status</Text>
          {isOnline ? <StatusBadge tone="success" label="Online" /> : <StatusBadge tone="warning" label="Offline" />}
        </View>
        <Text variant="body" style={{ marginTop: space[8] }}>
          {queuedCount} item(s) queued for sync
        </Text>
        {state.settings.lastSyncedAt ? (
          <Text variant="caption" colorToken={color.neutral.warmgray700}>
            Last synced: {new Date(state.settings.lastSyncedAt).toLocaleString()}
          </Text>
        ) : null}
      </Card>
      <Button label="Sync now" onPress={() => dispatch({ type: 'SYNC_NOW' })} state={queuedCount > 0 && isOnline ? 'default' : 'disabled'} />
      <Card>
        <ToggleSwitch
          label="Low-data mode (reduce image/photo loading)"
          value={state.settings.lowDataMode}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', payload: { lowDataMode: v } })}
        />
      </Card>
      <Card>
        <ToggleSwitch
          label="Simulate offline (demo)"
          value={state.settings.simulateOffline}
          onChange={(v) => dispatch({ type: 'SET_SETTINGS', payload: { simulateOffline: v } })}
        />
        <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ marginTop: space[4] }}>
          For demoing the offline queue without changing real device connectivity — see BUILD_NOTES.md.
        </Text>
      </Card>
      {failedEntries.length > 0 ? (
        <View style={{ gap: space[8] }}>
          <Text variant="h3">Sync-failed items</Text>
          {failedEntries.map((e) => (
            <ListRow key={e.id} title={e.foodName} subtitle="Sync failed" state="error" onPress={() => dispatch({ type: 'SYNC_NOW' })} />
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}
