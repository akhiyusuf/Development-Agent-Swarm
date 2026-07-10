import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { SingleSelect } from '../../components/SingleSelect';
import { color } from '../../theme/tokens';

/**
 * A7c / A7e. Placement Steps — generic, content-TBD movement-pattern checks.
 * Kept structurally parallel across tracks (per carry-forward #3) but NOT
 * asserting the same criteria, since Pilates placement is materially
 * different from calisthenics placement per the sitemap.
 */
const STEP_LABELS: Record<'calisthenics' | 'pilates', string[]> = {
  calisthenics: ['Push pattern check', 'Pull pattern check', 'Squat/hinge pattern check', 'Core-hold check'],
  pilates: ['Core/breath control check', 'Mobility check', 'Mat-position tolerance check'],
};

export function PlacementStepsScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const track: 'calisthenics' | 'pilates' = route.params.track;
  const returnTo = route.params?.returnTo ?? 'Welcome';
  const steps = STEP_LABELS[track];

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'yes' | 'no'>>({});

  const answer = answers[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const next = () => {
    if (isLast) {
      const yesCount = Object.values(answers).filter((a) => a === 'yes').length;
      nav.navigate('PlacementResult', { track, returnTo, yesCount, totalSteps: steps.length });
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <ScreenContainer density="relaxed">
      <ProgressBar progress={(stepIndex + 1) / steps.length} label={`${track === 'calisthenics' ? 'Calisthenics' : 'Pilates'} placement`} />
      <Text variant="h1">{steps[stepIndex]}</Text>
      <Card>
        <Text variant="body" colorToken={color.neutral.warmgray700}>
          [Placeholder assessment content] — a real instructional still and generic movement
          description would appear here. Self-report whether you can complete this check
          comfortably with good form.
        </Text>
      </Card>
      <SingleSelect
        label="Can you do this comfortably?"
        value={answer}
        onChange={(v) => setAnswers((a) => ({ ...a, [stepIndex]: v as 'yes' | 'no' }))}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: "Not yet" },
        ]}
      />
      <Button label={isLast ? 'See result' : 'Next'} onPress={next} state={answer ? 'default' : 'disabled'} />
      <Button
        label="Skip this step"
        variant="tertiary"
        onPress={() => {
          setAnswers((a) => ({ ...a, [stepIndex]: 'no' }));
          next();
        }}
      />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
