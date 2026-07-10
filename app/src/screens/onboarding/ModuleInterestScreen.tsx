import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { StatusBadge } from '../../components/StatusBadge';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/**
 * A6. Module Interest Screen — nutrition always on; workout module selectable.
 * WORKOUT_MODULE_LIVE simulates the sitemap's rollout note: the tab may ship
 * disabled/"coming soon" at nutrition-only launch, then activate fast-follow.
 * Set to true here since this build implements the full workout mechanism.
 */
const WORKOUT_MODULE_LIVE = true;

export function ModuleInterestScreen() {
  const nav = useNavigation<any>();
  const { dispatch } = useAppState();
  const [wantsWorkout, setWantsWorkout] = useState(false);

  const onContinue = () => {
    dispatch({ type: 'SET_MODULE_INTEREST', payload: { workout: wantsWorkout && WORKOUT_MODULE_LIVE } });
    if (wantsWorkout && WORKOUT_MODULE_LIVE) {
      nav.navigate('AssessmentIntro');
    } else {
      nav.navigate('Welcome');
    }
  };

  return (
    <ScreenContainer density="relaxed">
      <ProgressBar progress={5 / 8} label="Step 5 of 8" />
      <Text variant="h1">What do you want to track?</Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: space[12], alignItems: 'center' }}>
          <Ionicons name="checkmark-circle" size={22} color={color.semantic.success} />
          <View style={{ flex: 1 }}>
            <Text variant="h3">Track nutrition</Text>
            <Text variant="caption" colorToken={color.neutral.warmgray700}>
              Our flagship — always on.
            </Text>
          </View>
        </View>
      </Card>
      <Card
        onPress={WORKOUT_MODULE_LIVE ? () => setWantsWorkout((w) => !w) : undefined}
        state={WORKOUT_MODULE_LIVE ? 'default' : 'disabled'}
      >
        <View style={{ flexDirection: 'row', gap: space[12], alignItems: 'center' }}>
          <Ionicons
            name={wantsWorkout ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={wantsWorkout ? color.semantic.success : color.neutral.warmgray700}
          />
          <View style={{ flex: 1 }}>
            <Text variant="h3">Train (calisthenics / Pilates)</Text>
            <Text variant="caption" colorToken={color.neutral.warmgray700}>
              Bodyweight skill-tree training, fast-follow module.
            </Text>
          </View>
          {!WORKOUT_MODULE_LIVE ? <StatusBadge tone="neutral" label="Coming soon" /> : null}
        </View>
      </Card>
      <Button label="Continue" onPress={onContinue} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
