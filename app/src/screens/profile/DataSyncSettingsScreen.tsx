import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, ListRow, StatusBadge, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Data & Sync Settings (S3) — the terminal/observable surface for every
 * [CP-OFFLINE] queue in the app (Req 5, 13 partial).
 *
 * DATA CONTRACT: `{ queuedCount, failedItems[], lowDataMode, syncNow(), retry(id) }`.
 * Sync now can itself fail (inline non-blocking error, retry; queue never
 * cleared). Per-item retry for repeatedly-failed items (E3).
 */
export function DataSyncSettingsScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { syncQueue, settings, isOnline } = useAppState();
  const queuedCount = syncQueue.length;

  return (
    <Screen>
      <Section title="Sync status">
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <AppText variant="bodyEmphasis">
              {queuedCount > 0 ? `${queuedCount} entries queued` : 'Everything synced'}
            </AppText>
            {queuedCount > 0 ? <StatusBadge tone="info" label="Pending" /> : <StatusBadge tone="success" label="Synced" />}
          </Row>
          {!isOnline ? (
            <AppText variant="caption" color={theme.semantic.warning}>
              Offline — sync will resume automatically once you're back online.
            </AppText>
          ) : null}
        </Card>
        <Button label="Sync now" onPress={() => dispatch({ type: 'SYNC_NOW' })} />
      </Section>

      <Section title="Low-data mode">
        <Card>
          <ToggleSwitch
            label="Reduce image and sync data usage"
            value={settings.lowDataMode}
            onChange={(v) => dispatch({ type: 'SET_LOW_DATA_MODE', value: v })}
          />
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            Portion photos load on demand and background sync is throttled.
          </AppText>
        </Card>
      </Section>

      <Section title="Needs attention">
        <Card>
          {queuedCount > 0 ? (
            syncQueue.map((item) => (
              <ListRow
                key={item.id}
                title={item.description}
                subtitle="Waiting to sync"
                trailingText="Retry"
                onPress={() => dispatch({ type: 'RETRY_SYNC_ITEM', id: item.id })}
                badge={{ color: theme.semantic.info, icon: 'cloud-upload-outline', label: 'Queued' }}
              />
            ))
          ) : (
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              No failed items.
            </AppText>
          )}
        </Card>
      </Section>
    </Screen>
  );
}
