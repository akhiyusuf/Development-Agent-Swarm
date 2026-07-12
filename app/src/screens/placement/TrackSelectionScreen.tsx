import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Track Selection — shown only when BOTH tracks were opted into (A3). User does
 * Calisthenics, Pilates, or both, in either order; either may be deferred.
 *
 * DATA CONTRACT: reads `{ calisthenics: PlacementState; pilates: PlacementState }`
 * where PlacementState is 'not-started' | 'done'. "Continue" enables once at
 * least one track is placed OR the rest is explicitly deferred; routes to
 * Combined Summary (both done) else Auth (join). Deferred tracks re-enter from
 * Skill Tree Home later (A9).
 */
export function TrackSelectionScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { placement } = useAppState();
  const calDone = placement.calisthenics.status === 'done';
  const pilDone = placement.pilates.status === 'done';

  return (
    <Screen>
      <AppText variant="h1">Which placement first?</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Do one now and the other later, or both. Nothing is locked in — you can retake any time.
      </AppText>

      <Card onPress={() => navigation.navigate('CalisthenicsPlacementSteps')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Calisthenics placement</AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Push, pull, squat/hinge and core-hold checks.
            </AppText>
          </View>
          <StatusBadge tone={calDone ? 'success' : 'info'} label={calDone ? 'Placed' : 'Not started'} />
        </Row>
      </Card>

      <Card onPress={() => navigation.navigate('PilatesPlacementSteps')}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Pilates placement</AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Core/breath control, mobility and mat-position tolerance.
            </AppText>
          </View>
          <StatusBadge tone={pilDone ? 'success' : 'info'} label={pilDone ? 'Placed' : 'Not started'} />
        </Row>
      </Card>

      <Button
        label="Continue (both placed)"
        onPress={() => {
          dispatch({ type: 'SET_ONBOARDING_STEP', step: 'CombinedSummary' });
          navigation.navigate('CombinedSummary');
        }}
      />
      <Button
        variant="tertiary"
        label="Skip the rest for now"
        onPress={() => {
          dispatch({ type: 'SET_ONBOARDING_STEP', step: 'Auth' });
          navigation.navigate('Auth', { mode: 'signup' });
        }}
      />
      <PreAuthLoginLink />
    </Screen>
  );
}
