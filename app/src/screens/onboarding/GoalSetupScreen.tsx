import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ProgressRing, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { OnboardingProgress } from '../../components/OnboardingProgress';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';
import { SAMPLE_TARGETS } from '../../data/sampleData';

/**
 * Goal & Target Setup — computed calorie/macro target the user may adjust.
 *
 * DATA CONTRACT: `computed` is derived locally (Mifflin-St Jeor + activity +
 * goal) from Profile Setup's draft — no network call, so no loading state
 * (user-flows A1). Screen expects `{ computed: Targets }` and commits the
 * possibly-adjusted `{ kcal, protein_g, carbs_g, fat_g }` to the draft on
 * Continue. Over-aggressive adjustment shows a non-blocking warning, never a
 * hard block.
 */
export function GoalSetupScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  // PLACEHOLDER "computed" default (would come from the Profile Setup draft).
  const [kcal, setKcal] = useState(String(SAMPLE_TARGETS.kcal));
  const [protein, setProtein] = useState(String(SAMPLE_TARGETS.protein_g));
  const [carbs, setCarbs] = useState(String(SAMPLE_TARGETS.carbs_g));
  const [fat, setFat] = useState(String(SAMPLE_TARGETS.fat_g));

  const kcalNum = Number(kcal) || 0;
  const proteinKcal = (Number(protein) || 0) * 4;
  const carbsKcal = (Number(carbs) || 0) * 4;
  const fatKcal = (Number(fat) || 0) * 9;
  const aggressive = kcalNum > 0 && (kcalNum < 1200 || kcalNum > 4000);

  return (
    <Screen>
      <OnboardingProgress step={2} total={5} />
      <AppText variant="h1">Your daily targets</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Computed from your profile. Adjust anything and the preview updates live.
      </AppText>

      <Card>
        <AppText variant="h3">{kcalNum} kcal / day</AppText>
        <Row style={{ justifyContent: 'space-around', marginTop: theme.spacing.space16 }}>
          <ProgressRing
            progress={kcalNum ? proteinKcal / (kcalNum || 1) : 0}
            color={theme.macro.protein}
            label="Protein"
            valueText={`${protein}g`}
            size={84}
          />
          <ProgressRing
            progress={kcalNum ? carbsKcal / (kcalNum || 1) : 0}
            color={theme.macro.carbs}
            label="Carbs"
            valueText={`${carbs}g`}
            size={84}
          />
          <ProgressRing
            progress={kcalNum ? fatKcal / (kcalNum || 1) : 0}
            color={theme.macro.fat}
            label="Fat"
            valueText={`${fat}g`}
            size={84}
          />
        </Row>
      </Card>

      <Card>
        <View style={{ gap: theme.spacing.space16 }}>
          <AppText variant="bodyEmphasis">Adjust targets</AppText>
          <TextField label="Calories (kcal)" value={kcal} onChangeText={setKcal} keyboardType="numeric" />
          {aggressive ? (
            <AppText variant="caption" color={theme.semantic.warning}>
              ⚠ That target is outside a typical safe range. You can proceed, but consider a gentler goal.
            </AppText>
          ) : null}
          <Row style={{ gap: theme.spacing.space16 }}>
            <View style={{ flex: 1 }}>
              <TextField label="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <TextField label="Fat (g)" value={fat} onChangeText={setFat} keyboardType="numeric" />
            </View>
          </Row>
        </View>
      </Card>

      <Button label="Continue" onPress={() => navigation.navigate('RegionPreference')} />
      <Button variant="tertiary" label="Reset to computed" onPress={() => {
        setKcal(String(SAMPLE_TARGETS.kcal));
        setProtein(String(SAMPLE_TARGETS.protein_g));
        setCarbs(String(SAMPLE_TARGETS.carbs_g));
        setFat(String(SAMPLE_TARGETS.fat_g));
      }} />
      <PreAuthLoginLink />
    </Screen>
  );
}
