import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Card, SkillNode, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { CALISTHENICS_LINES, PILATES_TIERS, findNode, nodeState } from '../../data/skillTree';
import type { RootParamList } from '../../navigation/types';

/**
 * Tier / Node Map (W2) — visual tree per track; each node shows its state and
 * prerequisites (Req 6, Req 8).
 *
 * DATA CONTRACT: `{ track }` + a per-user `nodeState(id)` resolver. Locked nodes
 * are fully NON-INTERACTIVE (the design system's SkillNode enforces this) — a
 * locked node's prerequisite shows as a static caption, never a control (C1).
 * Actionable nodes route to Node Detail. In dark mode the screen background is
 * the design system's #17181A app-bg, where the mastered node's outline/icon —
 * not its fill — carries contrast (design-system carry-forward #7).
 */
export function TierNodeMapScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'TierNodeMap'>>();
  const track = route.params.track;

  if (track === 'pilates') {
    return (
      <Screen>
        <AppText variant="h2">Pilates — classical mat</AppText>
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          Taught as three ordered tiers rather than an exercise-by-exercise tree.
        </AppText>
        <Card>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.space24, padding: theme.spacing.space8 }}>
            {PILATES_TIERS.map((tier) => (
              <SkillNode
                key={tier.id}
                label={tier.name}
                state={nodeState(tier.id)}
                milestone
                onPress={() => navigation.navigate('NodeDetail', { nodeId: tier.id })}
              />
            ))}
          </ScrollView>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h2">Calisthenics map</AppText>
      {CALISTHENICS_LINES.map((line) => (
        <Section key={line.id} title={line.name}>
          <Card>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.space24, padding: theme.spacing.space8, alignItems: 'flex-start' }}>
              {line.nodes.map((node) => {
                const state = nodeState(node.id);
                const prereqNames = node.prerequisites
                  .map((p) => findNode(p)?.name)
                  .filter(Boolean)
                  .join(', ');
                return (
                  <View key={node.id} style={{ width: 96, alignItems: 'center', gap: theme.spacing.space4 }}>
                    <SkillNode
                      label={node.name}
                      state={state}
                      milestone={node.milestone}
                      onPress={() => navigation.navigate('NodeDetail', { nodeId: node.id })}
                    />
                    {state === 'locked' && prereqNames ? (
                      <AppText variant="micro" color={theme.neutrals.placeholder} style={{ textAlign: 'center' }}>
                        Requires: {prereqNames}
                      </AppText>
                    ) : null}
                  </View>
                );
              })}
            </ScrollView>
          </Card>
        </Section>
      ))}
    </Screen>
  );
}
