import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, SegmentedControl, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { CALISTHENICS_LINES, PILATES_TIERS } from '../../data/skillTree';
import { useAppState } from '../../state/AppStateContext';

/**
 * Skill Tree Home (W1) — track selector + per-track summary; also the deferred-
 * placement re-entry point (Req 6, Req 9 / A9).
 *
 * DATA CONTRACT: `{ tracks: { id, placement: 'placed'|'deferred', currentTier }[] }`.
 * A placed track's card continues into its Node Map; a deferred/unplaced track
 * shows "Complete placement" which launches that track's Assessment Steps
 * directly (skipping Intro/Track Selection) and returns HERE on completion (A9).
 * "Never opted in" and "deferred" are treated identically (§G #7).
 */
export function SkillTreeHomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { placement } = useAppState();
  const [view, setView] = useState<'calisthenics' | 'pilates' | 'combined'>('combined');

  const showCal = view !== 'pilates';
  const showPil = view !== 'calisthenics';
  const calPlaced = placement.calisthenics.status === 'done';
  const pilPlaced = placement.pilates.status === 'done';
  const pilTierName = placement.pilates.startingTier
    ? PILATES_TIERS.find((t) => t.tier === placement.pilates.startingTier)?.name ?? `Tier ${placement.pilates.startingTier}`
    : null;

  return (
    <Screen>
      <AppText variant="h2">Skill tree</AppText>
      <SegmentedControl
        value={view}
        onChange={(v) => setView(v as typeof view)}
        options={[
          { value: 'calisthenics', label: 'Calisthenics' },
          { value: 'pilates', label: 'Pilates' },
          { value: 'combined', label: 'Combined' },
        ]}
      />

      {showCal ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Calisthenics</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                {CALISTHENICS_LINES.length} skill lines
                {calPlaced ? ` · currently Tier ${placement.calisthenics.startingTier}` : ''}
              </AppText>
            </View>
            <StatusBadge tone={calPlaced ? 'success' : 'info'} label={calPlaced ? 'Placed' : 'Not placed'} />
          </Row>
          {calPlaced ? (
            <Button label="Continue" onPress={() => navigation.navigate('TierNodeMap', { track: 'calisthenics' })} />
          ) : (
            <Button
              variant="secondary"
              label="Complete calisthenics placement"
              onPress={() => navigation.navigate('CalisthenicsPlacementSteps', { context: 'account' })}
            />
          )}
        </Card>
      ) : null}

      {showPil ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Pilates</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                {pilPlaced ? `Currently ${pilTierName}` : 'Classical mat · Basic → Intermediate → Advanced'}
              </AppText>
            </View>
            <StatusBadge tone={pilPlaced ? 'success' : 'info'} label={pilPlaced ? 'Placed' : 'Not placed'} />
          </Row>
          {pilPlaced ? (
            <Button label="Continue" onPress={() => navigation.navigate('TierNodeMap', { track: 'pilates' })} />
          ) : (
            <Button
              variant="secondary"
              label="Complete Pilates placement"
              onPress={() => navigation.navigate('PilatesPlacementSteps', { context: 'account' })}
            />
          )}
        </Card>
      ) : null}

      <Button variant="tertiary" label="Progression status" onPress={() => navigation.navigate('ProgressionStatus')} />
      <Button variant="tertiary" label="Session history" onPress={() => navigation.navigate('WorkoutHistory')} />
    </Screen>
  );
}
