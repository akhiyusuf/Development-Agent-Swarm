import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FoodDiaryScreen } from '../screens/nutrition/FoodDiaryScreen';
import { AddEntryScreen } from '../screens/nutrition/AddEntryScreen';
import { FoodDetailScreen } from '../screens/nutrition/FoodDetailScreen';
import { PortionReferenceGuideScreen } from '../screens/nutrition/PortionReferenceGuideScreen';
import { CustomFoodBuilderScreen } from '../screens/nutrition/CustomFoodBuilderScreen';
import { ConfirmLogScreen } from '../screens/nutrition/ConfirmLogScreen';
import { EditDeleteEntryScreen } from '../screens/nutrition/EditDeleteEntryScreen';
import { DailyNutritionSummaryScreen } from '../screens/nutrition/DailyNutritionSummaryScreen';
import { MicronutrientDetailScreen } from '../screens/nutrition/MicronutrientDetailScreen';
import { NutritionHistoryScreen } from '../screens/nutrition/NutritionHistoryScreen';
import { FavoritesRecentsScreen } from '../screens/nutrition/FavoritesRecentsScreen';

const Stack = createNativeStackNavigator();

/**
 * Nutrition tab — nested drill-down per sitemap §2: Food Diary -> Add Entry
 * -> Food/Composite Meal Detail (-> Portion Reference Guide) -> Confirm & Log.
 * Modal-presented screens (Add Entry, Portion Reference Guide, Custom Food
 * Builder, Confirm & Log, Edit/Delete Entry) use native-stack's 'modal'
 * presentation to match the design system's bottom-sheet convention (§4.9).
 */
export function NutritionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FoodDiary" component={FoodDiaryScreen} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="PortionReferenceGuide" component={PortionReferenceGuideScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="CustomFoodBuilder" component={CustomFoodBuilderScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="ConfirmLog" component={ConfirmLogScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="EditDeleteEntry" component={EditDeleteEntryScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="DailyNutritionSummary" component={DailyNutritionSummaryScreen} />
      <Stack.Screen name="MicronutrientDetail" component={MicronutrientDetailScreen} />
      <Stack.Screen name="NutritionHistory" component={NutritionHistoryScreen} />
      <Stack.Screen name="FavoritesRecents" component={FavoritesRecentsScreen} />
    </Stack.Navigator>
  );
}
