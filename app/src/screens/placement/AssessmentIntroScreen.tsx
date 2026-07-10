import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { color, space } from '../../theme/tokens';

/**
 * A7a. Assessment Intro — states placement is done per-track (Calisthenics
 * and/or Pilates), with a safety-note info callout (§1.3 info, icon + text).
 * `returnTo` (route param) is where the whole placement sub-flow lands once
 * finished/deferred: 'Welcome' from onboarding, or 'SkillTreeHome' when
 * re-entered later per carry-forward #3.
 */
export function AssessmentIntroScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const returnTo = route.params?.returnTo ?? 'Welcome';
  const forceTrack = route.params?.forceTrack as 'calisthenics' | 'pilates' | undefined;
  const showStepBar = returnTo === 'Welcome';

  const begin = () => {
    if (forceTrack) {
      nav.navigate('PlacementSteps', { track: forceTrack, returnTo });
    } else {
      nav.navigate('TrackSelection', { returnTo });
    }
  };

  return (
    <ScreenContainer density="relaxed">
      {showStepBar ? <ProgressBar progress={6 / 8} label="Step 6 of 8" /> : null}
      <Text variant="h1">Let's find your starting point</Text>
      <Text variant="body">
        This short check-in estimates where to place you in each track's skill tree so you're not
        starting too easy or too hard.
      </Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: space[12] }}>
          <Ionicons name="information-circle" size={22} color={color.semantic.info} />
          <Text variant="caption" style={{ flex: 1 }}>
            Safety note: stop any check if you feel pain (not normal exertion). This measures a
            starting point only — it is not medical advice.
          </Text>
        </View>
      </Card>
      <Card>
        <Text variant="body">
          Placement is done <Text variant="bodyEmphasis">per track</Text>: you can complete
          Calisthenics placement, Pilates placement, or both — in either order, and you can defer
          either one for later.
        </Text>
      </Card>
      <Button label="Begin" onPress={begin} />
      <Button
        label="Skip for now / do this later"
        variant="tertiary"
        onPress={() => nav.navigate(returnTo)}
      />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
