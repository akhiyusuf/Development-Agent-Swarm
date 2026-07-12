import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';

const FAQ = [
  { q: 'Why does a nutrient say "no data"?', a: 'Some regional foods have no sourced value for that nutrient yet. We show an honest "no data" instead of a misleading zero.' },
  { q: 'Are the workout thresholds a certified program?', a: 'No — they are a well-sourced synthesis of published systems, pending review by a qualified coach. Train within your ability.' },
  { q: 'Does logging work offline?', a: 'Yes. Entries save locally and sync automatically when you reconnect.' },
];

/**
 * Help / Support (S8) — expandable FAQ + contact action.
 *
 * DATA CONTRACT: FAQ content readable offline; the contact action requires
 * connectivity ([CP-NETFAIL]) and queues the message when offline (E8 default).
 */
export function HelpSupportScreen() {
  const theme = useTheme();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Screen>
      <Section title="FAQ">
        {FAQ.map((item, i) => (
          <Card key={i} onPress={() => setOpen(open === i ? null : i)}>
            <Row style={{ justifyContent: 'space-between' }}>
              <AppText variant="bodyEmphasis" style={{ flex: 1 }}>
                {item.q}
              </AppText>
              <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={20} color={theme.neutrals.placeholder} />
            </Row>
            {open === i ? (
              <AppText variant="caption" color={theme.neutrals.charcoal} style={{ marginTop: theme.spacing.space8 }}>
                {item.a}
              </AppText>
            ) : null}
          </Card>
        ))}
      </Section>

      <Button label="Contact support" onPress={() => { /* [CP-NETFAIL] / queue when offline */ }} />
    </Screen>
  );
}
