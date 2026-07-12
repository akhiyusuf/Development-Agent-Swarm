import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, StatusBadge, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { OnboardingProgress } from '../../components/OnboardingProgress';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Module Interest — nutrition always on; workout (calisthenics/Pilates) optional.
 *
 * DATA CONTRACT: commits `{ trackNutrition: true; trainWorkout: boolean }`.
 * Fork (user-flows A2): if workout is selected AND live -> AssessmentIntro;
 * otherwise -> Auth (join). `workoutLive` gates the "coming soon" branch (A2a):
 * when false, selecting workout registers interest only and skips placement.
 * The injury-liability disclaimer is a one-time BLOCKING acknowledgment at
 * first workout opt-in (user-flows E7 default) — modeled here by the required
 * toggle before placement can begin.
 */
export function ModuleInterestScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const existing = useAppState().moduleInterest;

  // The workout module is live at this build (fast-follow already shipped).
  const workoutLive = true;

  const [train, setTrain] = useState(existing.trainWorkout);
  const [ack, setAck] = useState(existing.injuryDisclaimerAckAt != null);
  const [needAck, setNeedAck] = useState(false);

  function onContinue() {
    dispatch({ type: 'SET_MODULE_INTEREST', trainWorkout: train && workoutLive });
    if (train && workoutLive) {
      if (!ack) {
        setNeedAck(true);
        return;
      }
      dispatch({ type: 'ACK_INJURY_DISCLAIMER' });
      dispatch({ type: 'SET_ONBOARDING_STEP', step: 'AssessmentIntro' });
      navigation.navigate('AssessmentIntro');
    } else {
      dispatch({ type: 'SET_ONBOARDING_STEP', step: 'Auth' });
      navigation.navigate('Auth', { mode: 'signup' });
    }
  }

  return (
    <Screen>
      <OnboardingProgress step={4} total={5} />
      <AppText variant="h1">What do you want to track?</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Nutrition is the flagship and always on. Add the workout skill tree now or later.
      </AppText>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Track nutrition</AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Regional foods, macros and micronutrients.
            </AppText>
          </View>
          <StatusBadge tone="success" label="Always on" />
        </Row>
      </Card>

      <Card onPress={() => setTrain((t) => !t)}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <AppText variant="h3">Train (calisthenics / Pilates)</AppText>
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              Progression-gated skill tree with objective mastery gates.
            </AppText>
            {!workoutLive ? (
              <View style={{ marginTop: theme.spacing.space8 }}>
                <StatusBadge tone="info" label="Coming soon" />
              </View>
            ) : null}
          </View>
          <Ionicons
            name={train ? 'checkmark-circle' : 'ellipse-outline'}
            size={26}
            color={train ? theme.brand.terracotta : theme.neutrals.placeholder}
          />
        </Row>
      </Card>

      {train && workoutLive ? (
        <Card error={needAck && !ack}>
          <ToggleSwitch
            label="I acknowledge the workout injury-liability disclaimer"
            value={ack}
            onChange={(v) => {
              setAck(v);
              if (v) setNeedAck(false);
            }}
          />
          {needAck && !ack ? (
            <AppText variant="caption" color={theme.semantic.error}>
              Please acknowledge before starting the placement assessment.
            </AppText>
          ) : (
            <AppText variant="caption" color={theme.neutrals.charcoal}>
              The full disclaimer is always available later under Profile → Legal &amp; Disclaimers.
            </AppText>
          )}
        </Card>
      ) : null}

      <Button label="Continue" onPress={onContinue} />
      <PreAuthLoginLink />
    </Screen>
  );
}
