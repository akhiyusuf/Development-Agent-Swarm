import React, { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, SingleSelectChips, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { OnboardingProgress } from '../../components/OnboardingProgress';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import type { ActivityLevel, Goal, Sex } from '../../state/types';

/**
 * Profile Setup — name, sex, height, current weight, activity level, primary goal.
 *
 * DATA CONTRACT: on Continue, commit the form values below to the local
 * onboarding draft (user-flows §0.1). Expected shape:
 *   { name: string; sex: string; heightCm: string; weightKg: string;
 *     activity: string; goal: 'lose'|'maintain'|'gain' }
 * [CP-VALIDATION]: Continue is disabled until name + sex + goal + numeric
 * height/weight are present.
 */
export function ProfileSetupScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const existing = useAppState().profile;
  const { width } = useWindowDimensions();
  const wide = width >= 700;

  const [name, setName] = useState(existing.name);
  const [sex, setSex] = useState<string | null>(existing.sex);
  const [height, setHeight] = useState(existing.heightCm ? String(existing.heightCm) : '');
  const [weight, setWeight] = useState(existing.weightKg ? String(existing.weightKg) : '');
  const [activity, setActivity] = useState<string | null>(existing.activity);
  const [goal, setGoal] = useState<string | null>(existing.goal);
  const [touched, setTouched] = useState(false);

  const numeric = (v: string) => v.trim() !== '' && !Number.isNaN(Number(v));
  const valid = name.trim() !== '' && !!sex && numeric(height) && numeric(weight) && !!activity && !!goal;

  return (
    <Screen contentStyle={{ maxWidth: wide ? 560 : undefined, alignSelf: 'center', width: '100%' }}>
      <OnboardingProgress step={1} total={5} />
      <AppText variant="h1">Set up your profile</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        We use this to estimate your calorie and macro targets. You can change it any time.
      </AppText>

      <Card>
        <View style={{ gap: theme.spacing.space16 }}>
          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            error={touched && name.trim() === ''}
            errorMessage="Name is required"
          />

          <Section title="Sex">
            <SingleSelectChips
              value={sex}
              onChange={setSex}
              options={[
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
                { value: 'other', label: 'Prefer not to say' },
              ]}
              error={touched && !sex}
              errorMessage="Select one"
            />
          </Section>

          <View style={{ flexDirection: wide ? 'row' : 'column', gap: theme.spacing.space16 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="170"
                error={touched && !numeric(height)}
                errorMessage="Enter a number"
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="Current weight (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="80"
                error={touched && !numeric(weight)}
                errorMessage="Enter a number"
              />
            </View>
          </View>

          <Section title="Activity level">
            <SingleSelectChips
              value={activity}
              onChange={setActivity}
              options={[
                { value: 'sedentary', label: 'Sedentary' },
                { value: 'light', label: 'Light' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'active', label: 'Active' },
              ]}
            />
          </Section>

          <Section title="Primary goal">
            <SingleSelectChips
              value={goal}
              onChange={setGoal}
              options={[
                { value: 'lose', label: 'Lose weight' },
                { value: 'maintain', label: 'Maintain' },
                { value: 'gain', label: 'Gain weight' },
              ]}
            />
          </Section>
        </View>
      </Card>

      <Button
        label="Continue"
        onPress={() => {
          // [CP-VALIDATION]: surface field errors rather than submitting invalid data.
          setTouched(true);
          if (valid) {
            dispatch({
              type: 'SET_PROFILE',
              profile: {
                name,
                sex: sex as Sex,
                heightCm: Number(height),
                weightKg: Number(weight),
                activity: activity as ActivityLevel,
                goal: goal as Goal,
              },
            });
            dispatch({ type: 'SET_ONBOARDING_STEP', step: 'GoalSetup' });
            navigation.navigate('GoalSetup');
          }
        }}
      />
      <PreAuthLoginLink />
    </Screen>
  );
}
