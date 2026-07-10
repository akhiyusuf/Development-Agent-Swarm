import React from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** S7. Legal & Disclaimers — health-data privacy notice, workout injury-liability disclaimer. */
export function LegalDisclaimersScreen() {
  const { state, dispatch } = useAppState();

  return (
    <ScreenContainer>
      <Text variant="h1">Legal & Disclaimers</Text>

      <Text variant="h3">Health-data privacy notice</Text>
      <Text variant="body" colorToken={color.neutral.charcoal}>
        Your nutrition, weight, and workout-attempt data is treated as sensitive health-adjacent
        data. It is stored on your device and, when connected, synced to your account for backup
        and cross-device access. We do not sell your personal data. Depending on your region, this
        processing may be governed by Nigeria's NDPA, Ghana's Data Protection Act, or similar
        frameworks, as well as GDPR/CCPA where applicable to diaspora users.
      </Text>

      <Text variant="h3">Workout injury-liability disclaimer</Text>
      <Text variant="body" colorToken={color.neutral.charcoal}>
        The calisthenics and Pilates skill-tree content in this app is for tracking and education
        purposes only. Placement results, node thresholds, and form cues are not medical or
        professional-training advice. Stop any exercise that causes pain and consult a qualified
        professional before beginning a new training program, especially if you have a pre-existing
        condition.
      </Text>

      <Text variant="h3">Tracking / education, not medical advice</Text>
      <Text variant="body" colorToken={color.neutral.charcoal}>
        Nutrition targets, macro/micronutrient estimates, and workout progression in this app are
        general tracking and educational tools. They do not diagnose, treat, or replace guidance
        from a doctor, registered dietitian, or physiotherapist.
      </Text>

      <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ marginTop: space[8] }}>
        This build's copy is illustrative placeholder legal language, not reviewed legal counsel
        text — see BUILD_NOTES.md.
      </Text>

      {!state.legalAcknowledged ? (
        <Button label="Acknowledge" onPress={() => dispatch({ type: 'ACKNOWLEDGE_LEGAL' })} />
      ) : (
        <Text variant="caption" colorToken={color.semantic.success}>
          Acknowledged.
        </Text>
      )}
    </ScreenContainer>
  );
}
