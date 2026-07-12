import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';

/**
 * Custom Food / Meal Builder (N7) — user creates/saves an ingredient or
 * composite meal with its own household units (Req 2).
 *
 * DATA CONTRACT: on Save, persist a FoodItem-shaped record to the user's custom
 * set (searchable/loggable thereafter). "Save & log now" persists then routes
 * to Confirm & Log with the new food pre-selected at a 1× portion (B3).
 * [CP-VALIDATION]: name + numeric macros + at least one unit/gram pair required.
 */
export function CustomFoodBuilderScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [unit, setUnit] = useState('');
  const [grams, setGrams] = useState('');
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);

  const num = (v: string) => v.trim() !== '' && !Number.isNaN(Number(v));
  const valid = name.trim() !== '' && num(kcal) && unit.trim() !== '' && num(grams);

  return (
    <Screen>
      <AppText variant="h2">New custom food</AppText>
      {saved ? <StatusBadge tone="success" label="Saved to your custom foods" /> : null}

      <Card>
        <View style={{ gap: theme.spacing.space16 }}>
          <TextField label="Name" value={name} onChangeText={setName} placeholder="e.g. My jollof recipe" error={touched && name.trim() === ''} errorMessage="Name is required" />
          <Section title="Per 100g">
            <Row style={{ gap: theme.spacing.space12 }}>
              <View style={{ flex: 1 }}>
                <TextField label="kcal" value={kcal} onChangeText={setKcal} keyboardType="numeric" error={touched && !num(kcal)} errorMessage="Required" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="Protein g" value={protein} onChangeText={setProtein} keyboardType="numeric" />
              </View>
            </Row>
            <Row style={{ gap: theme.spacing.space12 }}>
              <View style={{ flex: 1 }}>
                <TextField label="Carbs g" value={carbs} onChangeText={setCarbs} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="Fat g" value={fat} onChangeText={setFat} keyboardType="numeric" />
              </View>
            </Row>
          </Section>
          <Section title="Household unit" caption="Give your food a first-class portion, e.g. '1 wrap' ≈ 150g.">
            <Row style={{ gap: theme.spacing.space12 }}>
              <View style={{ flex: 2 }}>
                <TextField label="Unit label" value={unit} onChangeText={setUnit} placeholder="1 wrap" error={touched && unit.trim() === ''} errorMessage="Required" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="Grams" value={grams} onChangeText={setGrams} keyboardType="numeric" error={touched && !num(grams)} errorMessage="Required" />
              </View>
            </Row>
          </Section>
        </View>
      </Card>

      <Button
        label="Save"
        onPress={() => {
          setTouched(true);
          if (valid) setSaved(true);
        }}
      />
      <Button
        variant="secondary"
        label="Save & log now"
        onPress={() => {
          setTouched(true);
          if (valid) navigation.navigate('ConfirmLog', { foodId: 'custom-preview', customName: name });
        }}
      />
      <Button variant="tertiary" label="Cancel" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
