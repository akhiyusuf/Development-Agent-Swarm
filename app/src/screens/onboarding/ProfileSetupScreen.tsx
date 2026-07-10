import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SingleSelect } from '../../components/SingleSelect';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** A3. Profile Setup — name, sex, height, current weight, activity level, primary goal. */
export function ProfileSetupScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();
  const [name, setName] = useState(state.profile.name);
  const [sex, setSex] = useState(state.profile.sex);
  const [height, setHeight] = useState(state.profile.heightCm?.toString() ?? '');
  const [weight, setWeight] = useState(state.profile.weightKg?.toString() ?? '');
  const [activity, setActivity] = useState(state.profile.activityLevel);
  const [goal, setGoal] = useState(state.profile.goal);

  const valid = name.trim().length > 0 && height && weight && sex && activity && goal;

  const onContinue = () => {
    dispatch({
      type: 'SET_PROFILE',
      payload: {
        name,
        sex,
        heightCm: Number(height),
        weightKg: Number(weight),
        activityLevel: activity,
        goal,
      },
    });
    nav.navigate('GoalSetup');
  };

  return (
    <ScreenContainer density="relaxed">
      <ProgressBar progress={2 / 8} label="Step 2 of 8" />
      <Text variant="h1">Tell us about you</Text>
      <Card style={{ gap: space[16] }}>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Your name" />
        <SingleSelect
          label="Sex"
          value={sex}
          onChange={(v) => setSex(v as any)}
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
          ]}
        />
        <View style={{ flexDirection: 'row', gap: space[12] }}>
          <View style={{ flex: 1 }}>
            <Input label="Height (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} placeholder="170" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="70" />
          </View>
        </View>
        <SingleSelect
          label="Activity level"
          value={activity}
          onChange={(v) => setActivity(v as any)}
          options={[
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'light', label: 'Light' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'active', label: 'Active' },
          ]}
        />
        <SingleSelect
          label="Primary goal"
          value={goal}
          onChange={(v) => setGoal(v as any)}
          options={[
            { value: 'lose', label: 'Lose weight' },
            { value: 'maintain', label: 'Maintain' },
            { value: 'gain', label: 'Gain' },
          ]}
        />
      </Card>
      <Button label="Continue" onPress={onContinue} state={valid ? 'default' : 'disabled'} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
