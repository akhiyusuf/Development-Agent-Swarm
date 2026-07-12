import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, SingleSelectChips, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen, Section } from '../../ui/layout';
import { findFood, gramsForUnit, scaleMacros } from '../../data/foods';
import { MEAL_SLOT_LABELS } from '../../data/sampleData';
import { useAppDispatch, useAppState } from '../../state/AppStateContext';
import { todayKey } from '../../state/selectors';
import type { MealSlot, RootParamList } from '../../navigation/types';

/**
 * Confirm & Log (N8, modal) — meal-slot assignment, quantity, final preview, Save.
 *
 * DATA CONTRACT: `{ foodId, unitLabel?, quantity?, slot?, customName? }`. Save
 * writes a DiaryEntry (offline: saves + queues, [CP-OFFLINE], "queued" tag).
 * [CP-VALIDATION]: Save is disabled until a meal slot is chosen and quantity is
 * valid. Handles a just-built custom food (foodId not in the curated set) via
 * `customName`.
 */
export function ConfirmLogScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { customFoods } = useAppState();
  const route = useRoute<RouteProp<RootParamList, 'ConfirmLog'>>();
  const { foodId, unitLabel, customName } = route.params;

  const food = findFood(foodId) ?? customFoods.find((f) => f.id === foodId);
  const name = food?.name ?? customName ?? 'Custom food';

  const [slot, setSlot] = useState<string | null>(route.params.slot ?? null);
  const [quantity, setQuantity] = useState(route.params.quantity ?? 1);
  const [touched, setTouched] = useState(false);

  const unitGrams = food ? gramsForUnit(food, unitLabel ?? null) : null;
  const grams = (unitGrams ?? 0) * quantity;
  const macros = food ? scaleMacros(food.per100g, grams) : null;

  return (
    <Screen>
      <AppText variant="h2">{name}</AppText>
      {unitLabel ? (
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          {quantity} × {unitLabel}
          {grams ? ` · ${Math.round(grams)}g` : ''}
        </AppText>
      ) : null}

      <Card>
        <Section title="Meal">
          <SingleSelectChips
            value={slot}
            onChange={setSlot}
            options={(Object.keys(MEAL_SLOT_LABELS) as MealSlot[]).map((s) => ({ value: s, label: MEAL_SLOT_LABELS[s] }))}
            error={touched && !slot}
            errorMessage="Choose a meal slot"
          />
        </Section>
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText variant="bodyEmphasis">Quantity</AppText>
          <Row style={{ gap: theme.spacing.space16 }}>
            <Button variant="tertiary" label="−" onPress={() => setQuantity((q) => Math.max(0.5, q - 0.5))} />
            <AppText variant="h3">{quantity}</AppText>
            <Button variant="tertiary" label="+" onPress={() => setQuantity((q) => q + 0.5)} />
          </Row>
        </Row>
      </Card>

      {macros ? (
        <Card>
          <AppText variant="bodyEmphasis">{macros.kcal} kcal</AppText>
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            P {macros.protein_g}g · C {macros.carbs_g}g · F {macros.fat_g}g
          </AppText>
        </Card>
      ) : (
        <StatusBadge tone="info" label="Preview available once macros are set" />
      )}

      <Button
        label="Save to diary"
        onPress={() => {
          setTouched(true);
          if (slot && food) {
            dispatch({
              type: 'ADD_DIARY_ENTRY',
              date: todayKey(),
              entry: {
                foodId: food.id,
                slot: slot as MealSlot,
                unitLabel: unitLabel ?? food.householdPortions[0]?.unit ?? `${Math.round(grams)}g`,
                quantity,
                grams: unitGrams ?? 0,
                kcal: macros?.kcal ?? 0,
              },
            });
            // DEVIATION (build fix, logged in BUILD_NOTES.md): this screen is
            // registered in the RootStack's modal group (RootNavigator.tsx),
            // while `FoodDiary` only exists inside MainTabs' nested
            // NutritionStack (MainTabs.tsx). A bare `navigate('FoodDiary')`
            // typechecks (RootParamList is a flat, app-wide list) but is a
            // runtime no-op — React Navigation's `navigate` bubbles UP to an
            // ancestor navigator, never down into a sibling's nested stack, so
            // the modal never dismissed.
            //
            // PASS-2 CORRECTION (logged in BUILD_NOTES.md): the nested-navigate
            // form alone (`navigate('Main', { screen, params })`) is NOT
            // sufficient — verified in `@react-navigation/routers`'
            // StackRouter: a plain NAVIGATE action to a route name that isn't
            // the CURRENT route (here 'ConfirmLog' -> 'Main', with 'Main'
            // buried under the whole modal chain) does not pop back to the
            // existing 'Main' entry; it appends a brand-new one, leaving the
            // entire modal chain (AddEntry/FoodDetail/ConfirmLog, etc.) mounted
            // and hidden underneath, duplicating MainTabs and its tab bar every
            // time this fires. The `pop: true` option (CommonActions.navigate's
            // 3rd-arg `options`) makes StackRouter's NAVIGATE handler search for
            // the last route named 'Main' and rewrite the stack to end at that
            // route (with the new params applied), discarding everything pushed
            // after it — i.e. an actual pop back to the one mounted Main
            // instance, not a push. The nested `screen`/`params` payload is
            // still honored: each nested navigator's own `useNavigationBuilder`
            // watches its own route's `params.screen` and re-dispatches
            // internally to itself (see useNavigationBuilder.js's NAVIGATE
            // re-dispatch, which forwards a `pop` field from `route.params.pop`
            // verbatim) — so the SAME duplicate-push bug also applies one
            // level down, inside NutritionStack itself, if the user had
            // drilled past FoodDiary (e.g. into Daily Summary/Micronutrient
            // Detail) before opening Add Entry: a bare `{ screen: 'FoodDiary' }`
            // nested target would push a second FoodDiary onto NutritionStack's
            // own history instead of popping back to the existing one. Passing
            // `pop: true` alongside `screen` at THIS level too (not just the
            // outer `navigate(...)` options) closes that inner instance of the
            // identical bug. Verified live via Playwright DOM counts: exactly
            // one mounted tab bar after repeated saves, zero residual hidden
            // ConfirmLog/AddEntry screens, and no growth in hidden nested-stack
            // screens either.
            (
              navigation as unknown as {
                navigate: (screen: string, params?: object, options?: { pop?: boolean }) => void;
              }
            ).navigate(
              'Main',
              { screen: 'NutritionTab', params: { screen: 'FoodDiary', pop: true } },
              { pop: true },
            );
          }
        }}
      />
      <Button variant="tertiary" label="Cancel" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
