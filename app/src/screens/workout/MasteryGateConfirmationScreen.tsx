import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getNodeDef } from '../../data/skillTree';

/**
 * W5. Mastery Gate Confirmation — shown when a logged attempt meets/exceeds
 * the node's (placeholder) threshold. If this attempt didn't reach a gate,
 * shows a lightweight "attempt saved, keep going" state instead.
 */
export function MasteryGateConfirmationScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { nodeId } = route.params;
  const { state, dispatch } = useAppState();
  const def = getNodeDef(nodeId);
  const event = state.lastGateEvent?.masteredNodeId === nodeId ? state.lastGateEvent : null;

  useEffect(() => {
    return () => {
      dispatch({ type: 'CLEAR_GATE_EVENT' });
    };
  }, []);

  if (!def) return null;

  if (!event) {
    return (
      <ScreenContainer density="relaxed" forceDark>
        <Text variant="h1" colorToken={color.neutral.white}>
          Attempt saved
        </Text>
        <Text variant="body" colorToken="#C9C6BE">
          Keep logging — {def.name} isn't at its gate yet.
        </Text>
        <Button label="Continue" onPress={() => nav.navigate('TierNodeMap', { track: def.track })} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer density="relaxed" forceDark>
      <View style={{ alignItems: 'center', gap: space[12] }}>
        <Ionicons name="star" size={56} color={color.node.mastered} />
        <Text variant="h1" colorToken={color.neutral.white} center>
          {event.nowState === 'mastered' ? 'Mastered!' : 'Gate cleared!'}
        </Text>
        <Text variant="body" colorToken="#C9C6BE" center>
          {def.name} is now {event.nowState}.
        </Text>
      </View>

      {event.newlyUnlockedIds.length > 0 ? (
        <Card forceDark>
          <Text variant="h3" colorToken={color.neutral.white}>
            Newly unlocked
          </Text>
          {event.newlyUnlockedIds.map((id) => (
            <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: space[8], marginTop: space[8] }}>
              <Ionicons name="ellipse-outline" size={20} color={color.node.unlocked} />
              <Text variant="body" colorToken={color.neutral.white}>
                {getNodeDef(id)?.name}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      <Button label="Continue" onPress={() => nav.navigate('TierNodeMap', { track: def.track })} />
      <Button label="View progression" variant="tertiary" onPress={() => nav.navigate('ProgressionStatus')} />
    </ScreenContainer>
  );
}
