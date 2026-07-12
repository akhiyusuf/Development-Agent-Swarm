import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FoodDetailBody } from './FoodDetailBody';
import type { RootParamList } from '../../navigation/types';

/** Ingredient Detail (N4) — household-unit picker + portion-photo reference + macro/micro preview. */
export function IngredientDetailScreen() {
  const route = useRoute<RouteProp<RootParamList, 'IngredientDetail'>>();
  return <FoodDetailBody foodId={route.params.foodId} composite={false} />;
}
