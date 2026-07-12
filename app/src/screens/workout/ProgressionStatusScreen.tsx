import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, NodeStateBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { CALISTHENICS_LINES, PILATES_TIERS, describeThreshold } from '../../data/skillTree';
import { useNodeStateResolver } from '../../state/selectors';

/**
 * Progression Status (W6) — per skill line, "what you're on now / what's next",
 * across both tracks (Req 8).
 *
 * DATA CONTRACT: derived from the per-user `nodeState` resolver. A freshly-placed
 * zero-attempt track simply shows its starting node as current (C3, no special
 * empty state). Deferred/unplaced tracks are out of scope here (Skill Tree Home).
 */
export function ProgressionStatusScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const nodeState = useNodeStateResolver();

  return (
    <Screen>
      <AppText variant="h2">Progression</AppText>

      <Section title="Calisthenics">
        {CALISTHENICS_LINES.map((line) => {
          const ordered = [...line.nodes].sort((a, b) => a.tier - b.tier);
          const current = [...ordered].reverse().find((n) => nodeState(n.id) !== 'locked') ?? ordered[0];
          const currentIdx = ordered.findIndex((n) => n.id === current.id);
          const next = ordered[currentIdx + 1];
          return (
            <Card key={line.id} onPress={() => navigation.navigate('NodeDetail', { nodeId: current.id })}>
              <AppText variant="bodyEmphasis">{line.name}</AppText>
              <Row style={{ justifyContent: 'space-between', marginTop: theme.spacing.space8 }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" color={theme.neutrals.charcoal}>
                    Now: {current.name}
                  </AppText>
                  {next ? (
                    <AppText variant="caption" color={theme.neutrals.charcoal}>
                      Next: {next.name} · {describeThreshold(next.threshold)}
                    </AppText>
                  ) : (
                    <AppText variant="caption" color={theme.neutrals.charcoal}>
                      Line complete
                    </AppText>
                  )}
                </View>
                <NodeStateBadge state={nodeState(current.id)} />
              </Row>
            </Card>
          );
        })}
      </Section>

      <Section title="Pilates">
        {PILATES_TIERS.map((tier) => (
          <Card key={tier.id} onPress={() => navigation.navigate('NodeDetail', { nodeId: tier.id })}>
            <Row style={{ justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <AppText variant="bodyEmphasis">{tier.name}</AppText>
                <AppText variant="caption" color={theme.neutrals.charcoal}>
                  {tier.exercises.length} exercises
                </AppText>
              </View>
              <NodeStateBadge state={nodeState(tier.id)} />
            </Row>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
