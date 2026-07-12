import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, ListRow, StatusBadge, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { SAMPLE_QUEUED_COUNT } from '../../data/sampleData';

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
  const [lowData, setLowData] = useState(false);

  return (
    <Screen>
      <Section title="Sync status">
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <AppText variant="bodyEmphasis">
              {SAMPLE_QUEUED_COUNT > 0 ? `${SAMPLE_QUEUED_COUNT} entries queued` : 'Everything synced'}
            </AppText>
            {SAMPLE_QUEUED_COUNT > 0 ? <StatusBadge tone="info" label="Pending" /> : <StatusBadge tone="success" label="Synced" />}
          </Row>
        </Card>
        <Button label="Sync now" onPress={() => { /* app-builder triggers sync */ }} />
      </Section>

      <Section title="Low-data mode">
        <Card>
          <ToggleSwitch label="Reduce image and sync data usage" value={lowData} onChange={setLowData} />
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            Portion photos load on demand and background sync is throttled.
          </AppText>
        </Card>
      </Section>

      <Section title="Needs attention">
        <Card>
          {SAMPLE_QUEUED_COUNT > 0 ? (
            <ListRow
              title="Akara × 3 (breakfast)"
              subtitle="Waiting to sync"
              trailingText="Retry"
              onPress={() => { /* retry this item */ }}
              badge={{ color: theme.semantic.info, icon: 'cloud-upload-outline', label: 'Queued' }}
            />
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
