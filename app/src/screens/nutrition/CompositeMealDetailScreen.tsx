import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FoodDetailBody } from './FoodDetailBody';
import type { RootParamList } from '../../navigation/types';

/** Composite Meal Detail (N5) — same portion pattern, plus recipe-level extras. */
export function CompositeMealDetailScreen() {
  const route = useRoute<RouteProp<RootParamList, 'CompositeMealDetail'>>();
  return <FoodDetailBody foodId={route.params.foodId} composite />;
}
