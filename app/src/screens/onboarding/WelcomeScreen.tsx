import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressRing } from '../../components/ProgressRing';
import { macroColor, space, color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** A8. Onboarding Complete / Welcome Summary. */
export function WelcomeScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();

  const finish = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  return (
    <ScreenContainer density="relaxed">
      <Text variant="display" colorToken={color.primary.terracotta} center>
        Welcome, {state.profile.name || 'friend'}!
      </Text>
      <Card>
        <Text variant="h3">Your daily target</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: space[12] }}>
          <ProgressRing progress={1} size={64} fillColor={macroColor.calories} centerLabel={`${state.goals.calorieTarget}`} centerSubLabel="kcal" />
          <ProgressRing progress={1} size={64} fillColor={macroColor.protein} centerLabel={`${state.goals.proteinG}g`} centerSubLabel="protein" />
        </View>
      </Card>
      <Card>
        <Text variant="h3">Region</Text>
        <Text variant="body">{state.region.market}{state.region.includeWestern ? ' + Western/diaspora foods' : ''}</Text>
      </Card>
      {state.moduleInterest.workout ? (
        <Card>
          <Text variant="h3">Workout placement</Text>
          <Text variant="body">
            Calisthenics: {state.placement.calisthenics.status === 'done' ? `Tier ${state.placement.calisthenics.startingTier}` : 'Not yet placed'}
          </Text>
          <Text variant="body">
            Pilates: {state.placement.pilates.status === 'done' ? `Tier ${state.placement.pilates.startingTier}` : 'Not yet placed'}
          </Text>
        </Card>
      ) : null}
      <Button label="Go to Home" onPress={finish} />
    </ScreenContainer>
  );
}
