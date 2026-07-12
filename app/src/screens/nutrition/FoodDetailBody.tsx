import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Card,
  HouseholdUnitPortionPicker,
  PortionPhotoReference,
  ProgressRing,
  StatusBadge,
  useTheme,
} from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { MicroBar } from '../../components/MicroBar';
import { findFood, gramsForUnit, scaleMacros, unitsForFood } from '../../data/foods';
import { microRowsForFood } from '../../data/compute';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';

/**
 * Shared body for Ingredient Detail (N4) and Composite Meal Detail (N5) — same
 * portion-selector pattern, differing only in composite recipe-level extras.
 *
 * DATA CONTRACT: `{ foodId }` resolves a FoodItem; local UI state holds the
 * selected household unit, quantity, and optional exact-gram override. "Add to
 * diary" carries `{ foodId, unitLabel, quantity }` to Confirm & Log (B1). The
 * portion-photo reference (§4.4) is first-class here; its inline tile is omitted
 * when a food has no reference photo (a data gap — see data-sourcing.md), with
 * the standalone Portion Reference Guide reachable via the button.
 */
export function FoodDetailBody({ foodId, composite }: { foodId: string; composite: boolean }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { customFoods, favorites } = useAppState();
  const food = findFood(foodId) ?? customFoods.find((f) => f.id === foodId);

  const units = food ? unitsForFood(food) : [];
  const [unitKey, setUnitKey] = useState<string | null>(units[0]?.key ?? null);
  const [quantity, setQuantity] = useState(1);
  const [gramOverride, setGramOverride] = useState('');
  const favorited = favorites.includes(foodId);
  const [showRecipe, setShowRecipe] = useState(false);

  if (!food) {
    return (
      <Screen>
        <AppText variant="h2">Food not found</AppText>
        <Button label="Back" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  const unitGrams = gramsForUnit(food, unitKey);
  const grams = gramOverride ? Number(gramOverride) || 0 : (unitGrams ?? 0) * quantity;
  const macros = scaleMacros(food.per100g, grams);
  const micros = microRowsForFood(food, grams);
  const selectedUnitLabel = units.find((u) => u.key === unitKey)?.label ?? `${grams}g`;

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <AppText variant="h2">{food.name}</AppText>
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            {food.region} · {food.category}
          </AppText>
        </View>
        <Button
          variant="tertiary"
          label={favorited ? '★ Favorited' : '☆ Favorite'}
          onPress={() => dispatch({ type: 'TOGGLE_FAVORITE', foodId })}
        />
      </Row>

      <StatusBadge
        tone={food.confidence === 'direct-fct' || food.confidence === 'usda' ? 'success' : 'info'}
        label={`Source confidence: ${food.confidence}`}
      />

      {/* Household-unit portion picker — the default control (§4.3). */}
      <Card>
        <Section title="Portion">
          <HouseholdUnitPortionPicker
            units={units}
            selectedUnitKey={unitKey}
            quantity={quantity}
            onSelectUnit={(k) => { setUnitKey(k); setGramOverride(''); }}
            onQuantityChange={setQuantity}
            advancedGramValue={gramOverride}
            onAdvancedGramChange={setGramOverride}
          />
          {/* Portion-photo reference (§4.4). No bundled reference photo exists
              for this dish yet (a documented data gap), so the inline tile
              omits itself; the standalone guide is still reachable. */}
          <PortionPhotoReference caption={`${selectedUnitLabel} ≈ ${Math.round(grams)}g ${food.name}`} />
          <Button variant="tertiary" label="See portion photos" onPress={() => navigation.navigate('PortionReferenceGuide', { foodId: food.id })} />
        </Section>
      </Card>

      {/* Macro preview for the selected portion. */}
      <Card>
        <Section title="For this portion">
          <Row style={{ justifyContent: 'space-around' }}>
            <ProgressRing progress={1} color={theme.macro.calories} label="Calories" valueText={`${macros.kcal}`} size={80} />
            <ProgressRing progress={1} color={theme.macro.protein} label="Protein" valueText={`${macros.protein_g}g`} size={72} />
            <ProgressRing progress={1} color={theme.macro.carbs} label="Carbs" valueText={`${macros.carbs_g}g`} size={72} />
            <ProgressRing progress={1} color={theme.macro.fat} label="Fat" valueText={`${macros.fat_g}g`} size={72} />
          </Row>
        </Section>
      </Card>

      {/* Micronutrient preview — explicit no-data states (Req 4). */}
      <Card>
        <Section title="Micronutrients" caption="Only nutrients with sourced values are shown; the rest read 'no data'.">
          <View style={{ gap: theme.spacing.space12 }}>
            {micros.map((row) => (
              <MicroBar key={String(row.key)} row={row} />
            ))}
          </View>
        </Section>
      </Card>

      {composite ? (
        <Card onPress={() => setShowRecipe((s) => !s)}>
          <Row style={{ justifyContent: 'space-between' }}>
            <AppText variant="h3">About this dish</AppText>
            <Ionicons name={showRecipe ? 'chevron-up' : 'chevron-down'} size={20} color={theme.neutrals.placeholder} />
          </Row>
          {showRecipe ? (
            <View style={{ marginTop: theme.spacing.space8, gap: theme.spacing.space8 }}>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                Recipe-level nutrition. Home recipes vary — {food.valueSpread ?? 'values are a defensible default, not a fixed truth.'}
              </AppText>
              <AppText variant="micro" color={theme.neutrals.placeholder}>
                Source: {food.source.name}
              </AppText>
            </View>
          ) : null}
        </Card>
      ) : (
        <AppText variant="micro" color={theme.neutrals.placeholder}>
          Source: {food.source.name}
        </AppText>
      )}

      <Button
        label="Add to diary"
        onPress={() => navigation.navigate('ConfirmLog', { foodId: food.id, unitLabel: selectedUnitLabel, quantity })}
      />
    </Screen>
  );
}
