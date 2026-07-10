import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PortionUnitPicker } from '../../components/PortionUnitPicker';
import { PortionPhotoReference } from '../../components/PortionPhotoReference';
import { ProgressBar } from '../../components/ProgressBar';
import { Input } from '../../components/Input';
import { color, macroColor, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getFoodById, MICRONUTRIENT_LABELS, MICRONUTRIENT_TARGETS, Micronutrients } from '../../data/foodDatabase';

/**
 * N4/N5. Ingredient Detail & Composite Meal Detail — implemented as one
 * component since the design system specifies "the same portion-selector
 * pattern" for both (§ N5); the only differences are recipe-note visibility
 * and copy ("ingredient" vs "dish"). See BUILD_NOTES.md for this
 * consolidation note.
 */
export function FoodDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId, slot } = route.params;
  const { dispatch, isOnline } = useAppState();
  const food = getFoodById(foodId);

  const [unitId, setUnitId] = useState(food?.units[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [advancedGrams, setAdvancedGrams] = useState('');
  const [recipeOpen, setRecipeOpen] = useState(false);

  if (!food) {
    return (
      <ScreenContainer>
        <Text variant="h2">Food not found</Text>
      </ScreenContainer>
    );
  }

  const unit = food.units.find((u) => u.id === unitId);
  const grams = advancedMode ? Number(advancedGrams) || 0 : (unit?.gramsPerUnit ?? 0) * quantity;
  const ratio = unit?.gramsPerUnit ? grams / unit.gramsPerUnit : quantity;
  const calories = Math.round(food.caloriesPerUnit * ratio);
  const protein = Math.round(food.proteinG * ratio);
  const carbs = Math.round(food.carbsG * ratio);
  const fat = Math.round(food.fatG * ratio);
  const scaledMicros: Micronutrients = useMemo(() => {
    const out: Micronutrients = {};
    (Object.keys(food.micronutrients) as (keyof Micronutrients)[]).forEach((k) => {
      out[k] = +(food.micronutrients[k]! * ratio).toFixed(1);
    });
    return out;
  }, [food, ratio]);

  const goToConfirm = () => {
    nav.navigate('ConfirmLog', {
      foodId,
      slot,
      unitLabel: advancedMode ? `${grams}g (advanced)` : unit?.label ?? '',
      quantity: advancedMode ? 1 : quantity,
      grams,
      calories,
      proteinG: protein,
      carbsG: carbs,
      fatG: fat,
      micronutrients: scaledMicros,
    });
  };

  return (
    <ScreenContainer density="compact">
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text variant="h2">{food.name}</Text>
        <Text variant="micro" colorToken={color.neutral.warmgray700}>
          {food.region}
        </Text>
      </View>

      <PortionUnitPicker
        units={food.units}
        selectedUnitId={unitId}
        quantity={quantity}
        onSelectUnit={(id) => {
          setUnitId(id);
          setAdvancedMode(false);
        }}
        onChangeQuantity={setQuantity}
        advancedMode={advancedMode}
        onUseAdvancedGrams={() => setAdvancedMode((m) => !m)}
      />
      {advancedMode ? (
        <Input label="Exact grams" keyboardType="numeric" value={advancedGrams} onChangeText={setAdvancedGrams} placeholder="e.g. 175" />
      ) : null}

      <PortionPhotoReference
        references={food.photoRefs}
        onExpand={() => nav.navigate('PortionReferenceGuide', { foodId })}
        offline={!isOnline}
      />

      {food.kind === 'composite' && food.recipeNote ? (
        <Card onPress={() => setRecipeOpen((o) => !o)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3">Ingredients / recipe breakdown</Text>
            <Ionicons name={recipeOpen ? 'chevron-up' : 'chevron-down'} size={18} color={color.neutral.warmgray700} />
          </View>
          {recipeOpen ? (
            <Text variant="caption" colorToken={color.neutral.warmgray700} style={{ marginTop: space[8] }}>
              {food.recipeNote}
            </Text>
          ) : null}
        </Card>
      ) : null}

      <Card>
        <Text variant="h3">Nutrition for this portion</Text>
        <Text variant="body">{calories} kcal · P {protein}g · C {carbs}g · F {fat}g</Text>
        <View style={{ gap: space[8], marginTop: space[8] }}>
          {(Object.keys(MICRONUTRIENT_LABELS) as (keyof Micronutrients)[]).map((k) => {
            const meta = MICRONUTRIENT_LABELS[k];
            const value = scaledMicros[k];
            if (value === undefined) {
              return (
                <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant="caption">{meta.label}</Text>
                  <Text variant="caption" colorToken={color.neutral.warmgray700}>
                    No data for this food
                  </Text>
                </View>
              );
            }
            return (
              <ProgressBar
                key={k}
                progress={value / MICRONUTRIENT_TARGETS[k]}
                label={meta.label}
                valueLabel={`${value}${meta.unit}`}
                fillColor={color.primary.deepgreen}
              />
            );
          })}
        </View>
      </Card>

      <Button label="Add to diary" onPress={goToConfirm} />
      <View style={{ flexDirection: 'row', gap: space[12] }}>
        <Button
          label="View portion guide"
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => nav.navigate('PortionReferenceGuide', { foodId })}
        />
        <Button
          label="Favorite"
          variant="secondary"
          style={{ flex: 1 }}
          onPress={() => dispatch({ type: 'TOGGLE_FAVORITE', foodId })}
        />
      </View>
    </ScreenContainer>
  );
}
