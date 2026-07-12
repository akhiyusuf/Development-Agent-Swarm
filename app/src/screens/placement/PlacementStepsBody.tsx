import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressBar, SingleSelectChips, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import type { RootParamList } from '../../navigation/types';

export type PlacementStep = { key: string; title: string; prompt: string };

const SELF_REPORT = [
  { value: 'none', label: "Can't yet" },
  { value: 'some', label: 'A few' },
  { value: 'comfortable', label: 'Comfortably' },
];

/**
 * Shared Assessment-Steps body for both tracks (A3/A7c/A7e). Content is kept
 * GENERIC (movement patterns, not specific exercises) per Open Question 1.
 *
 * Behavior: per-step self-report; "Skip this step" is a DISTINCT action from
 * leaving it blank and records the step as skipped (§G #18), never a fabricated
 * value. Mid-assessment abandonment is NOT resumed — a fresh mount restarts at
 * step 1 (§A3 default). On the last step, routes to the result screen.
 *
 * DATA CONTRACT: emits `Record<stepKey, 'none'|'some'|'comfortable'|'skipped'>`
 * into the draft (or straight to the account when run post-auth from A9).
 */
export function PlacementStepsBody({
  title,
  steps,
  resultRoute,
}: {
  title: string;
  steps: PlacementStep[];
  resultRoute: keyof RootParamList;
}) {
  const theme = useTheme();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const answer = answers[step.key] ?? null;

  function commit(nextAnswer?: string) {
    if (nextAnswer !== undefined) {
      setAnswers((a) => ({ ...a, [step.key]: nextAnswer }));
    }
    if (isLast) {
      navigation.navigate(resultRoute as never);
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <Screen>
      <AppText variant="micro" color={theme.neutrals.charcoal}>
        {title} — step {index + 1} of {steps.length}
      </AppText>
      <ProgressBar progress={(index + 1) / steps.length} color={theme.brand.terracotta} />

      <Card>
        <View style={{ gap: theme.spacing.space12 }}>
          <AppText variant="h2">{step.title}</AppText>
          <AppText variant="body" color={theme.neutrals.charcoal}>
            {step.prompt}
          </AppText>
          <SingleSelectChips
            accessibilityLabel={step.title}
            value={answer}
            onChange={(v) => setAnswers((a) => ({ ...a, [step.key]: v }))}
            options={SELF_REPORT}
          />
        </View>
      </Card>

      <Button
        label={isLast ? 'See result' : 'Next'}
        onPress={() => commit(answer ?? 'skipped')}
      />
      <Button variant="tertiary" label="Skip this step" onPress={() => commit('skipped')} />
      {index > 0 ? (
        <Button variant="tertiary" label="Back" onPress={() => setIndex((i) => i - 1)} />
      ) : null}
    </Screen>
  );
}
