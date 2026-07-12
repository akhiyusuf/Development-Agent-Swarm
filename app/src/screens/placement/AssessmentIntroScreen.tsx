import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import { useAppDispatch } from '../../state/AppStateContext';

/**
 * Assessment Intro — states what placement measures, a safety note, and that
 * placement is done PER TRACK (user-flows A3).
 *
 * Actions: Begin -> Track Selection (both tracks opted in; if only one, an
 * app-builder branch skips straight to that track's steps — §G #17). "Skip for
 * now" defers BOTH tracks and proceeds to Auth; deferred placement re-enters
 * later from Skill Tree Home (A9). Placement content is kept GENERIC per the
 * sitemap's scope note — no specific exercises/thresholds asserted here.
 */
export function AssessmentIntroScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  return (
    <Screen>
      <AppText variant="h1">Find your starting point</AppText>
      <AppText variant="body" color={theme.neutrals.charcoal}>
        A short self-report assessment places you at the right tier so you are neither bored nor
        overwhelmed. It is done separately for each track you chose — calisthenics, Pilates, or both.
      </AppText>

      <Card>
        <Row style={{ gap: theme.spacing.space12 }}>
          <Ionicons name="shield-checkmark-outline" size={22} color={theme.semantic.info} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyEmphasis" color={theme.semantic.info}>
              Safety note
            </AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Only attempt movements that feel safe. These gates are a synthesized starting point, not a
              certified medical or training prescription.
            </AppText>
          </View>
        </Row>
      </Card>

      <Button
        label="Begin"
        onPress={() => {
          dispatch({ type: 'SET_ONBOARDING_STEP', step: 'TrackSelection' });
          navigation.navigate('TrackSelection');
        }}
      />
      <Button
        variant="tertiary"
        label="Skip for now — do this later"
        onPress={() => {
          dispatch({ type: 'SET_ONBOARDING_STEP', step: 'Auth' });
          navigation.navigate('Auth', { mode: 'signup' });
        }}
      />
      <PreAuthLoginLink />
    </Screen>
  );
}
