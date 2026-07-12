import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, SegmentedControl, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { CALISTHENICS_LINES } from '../../data/skillTree';

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
  const [view, setView] = useState<'calisthenics' | 'pilates' | 'combined'>('combined');

  const showCal = view !== 'pilates';
  const showPil = view !== 'calisthenics';

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
                {CALISTHENICS_LINES.length} skill lines · currently Tier 2
              </AppText>
            </View>
            <StatusBadge tone="success" label="Placed" />
          </Row>
          <Button label="Continue" onPress={() => navigation.navigate('TierNodeMap', { track: 'calisthenics' })} />
        </Card>
      ) : null}

      {showPil ? (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Pilates</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                Classical mat · Basic → Intermediate → Advanced
              </AppText>
            </View>
            <StatusBadge tone="success" label="Placed" />
          </Row>
          <Button label="Continue" onPress={() => navigation.navigate('TierNodeMap', { track: 'pilates' })} />
        </Card>
      ) : null}

      {/* Deferred re-entry (A9): a not-yet-placed track shows this instead of a map. */}
      <Card>
        <AppText variant="bodyEmphasis">Deferred a placement at onboarding?</AppText>
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          A track with no placement yet shows "Complete placement" here — it launches that track's
          assessment directly and returns to the skill tree.
        </AppText>
        {/* A9 re-entry is post-auth: `context: 'account'` suppresses the §0.2 pre-auth login link. */}
        <Button variant="secondary" label="Complete Pilates placement" onPress={() => navigation.navigate('PilatesPlacementSteps', { context: 'account' })} />
      </Card>

      <Button variant="tertiary" label="Progression status" onPress={() => navigation.navigate('ProgressionStatus')} />
      <Button variant="tertiary" label="Session history" onPress={() => navigation.navigate('WorkoutHistory')} />
    </Screen>
  );
}
