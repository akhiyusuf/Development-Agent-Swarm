import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { color, space } from '../../theme/tokens';

const FAQ = [
  { q: 'How are household units converted to grams?', a: 'Each food defines its own household-unit-to-gram conversion; if a food has none yet, the picker falls back to exact grams.' },
  { q: 'What happens to my logs when I\'m offline?', a: 'They save locally immediately and are queued; they sync automatically once you\'re back online.' },
  { q: 'Are the workout skill names final?', a: 'No — this build uses generic placeholder skill names ("Skill Node A", etc.) pending content validation.' },
];

/** S8. Help / Support — FAQ + contact affordance, cached offline. */
export function HelpSupportScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ScreenContainer>
      <Text variant="h1">Help & Support</Text>
      {FAQ.map((item, i) => (
        <Card key={i} onPress={() => setOpenIndex(openIndex === i ? null : i)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3" style={{ flex: 1 }}>
              {item.q}
            </Text>
            <Ionicons name={openIndex === i ? 'chevron-up' : 'chevron-down'} size={18} color={color.neutral.warmgray700} />
          </View>
          {openIndex === i ? (
            <Text variant="body" colorToken={color.neutral.warmgray700} style={{ marginTop: space[8] }}>
              {item.a}
            </Text>
          ) : null}
        </Card>
      ))}
      <Button label="Contact support" onPress={() => {}} />
    </ScreenContainer>
  );
}
