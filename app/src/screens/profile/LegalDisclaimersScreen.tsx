import React, { useState } from 'react';
import { Button, Card, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';

/**
 * Legal & Disclaimers (S7) — health-data privacy, injury liability, and the
 * "tracking/education, not medical advice" positioning (risk mitigation).
 *
 * DATA CONTRACT: the injury-liability disclaimer is a one-time BLOCKING
 * acknowledgment at first workout opt-in (E7 default, handled at Module
 * Interest); this screen is the passively-available full text plus an Acknowledge
 * action for that gate. Fully readable offline.
 */
export function LegalDisclaimersScreen() {
  const theme = useTheme();
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Screen>
      <Section title="Not medical advice">
        <Card>
          <AppText variant="body" color={theme.neutrals.charcoal}>
            Fit &amp; Fed is a tracking and education tool. Nutrition figures are compiled from cited food
            composition tables and USDA data and are starting estimates, not lab-precise values. Consult a
            qualified professional before making significant dietary or training changes.
          </AppText>
        </Card>
      </Section>

      <Section title="Workout injury liability">
        <Card>
          <AppText variant="body" color={theme.neutrals.charcoal}>
            The skill-tree progressions are a well-sourced synthesis of published calisthenics and classical
            Pilates systems. They have not been reviewed by a certified coach or physiotherapist. Train within
            your ability, warm up, and stop if you feel pain. You assume the risk of exercise.
          </AppText>
        </Card>
      </Section>

      <Section title="Health-data privacy">
        <Card>
          <AppText variant="body" color={theme.neutrals.charcoal}>
            Your data is tied to your account and handled per our privacy notice (NDPR/NDPA, GDPR, CCPA as
            applicable). Deleting your account purges server and local data.
          </AppText>
        </Card>
      </Section>

      {acknowledged ? (
        <StatusBadge tone="success" label="Acknowledged" />
      ) : (
        <Button label="Acknowledge" onPress={() => setAcknowledged(true)} />
      )}
    </Screen>
  );
}
