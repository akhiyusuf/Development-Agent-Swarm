import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, useTheme } from '@fit-and-fed/design-system';
import { AppText, Row, Screen } from '../../ui/layout';
import { findFood } from '../../data/foods';
import type { RootParamList } from '../../navigation/types';

/**
 * Portion Reference Guide (N6, modal) — the standalone, browsable home of the
 * portion-photo reference (§4.4): an expanded set of labelled portion tiles for
 * the food, each with a gram estimate (Req 1, the sitemap's #1 differentiator).
 *
 * DATA CONTRACT: `{ foodId }`. Real reference photography is a documented
 * content gap (data-sourcing.md) — until it lands, each tile shows the caption
 * + a photo-pending fallback icon (the design system's own offline/no-photo
 * fallback), never a broken image box. "Use this portion" sets that unit on the
 * originating detail screen and dismisses.
 */
export function PortionReferenceGuideScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'PortionReferenceGuide'>>();
  const food = findFood(route.params.foodId);

  if (!food) {
    return (
      <Screen>
        <AppText variant="h2">No reference available</AppText>
        <Button label="Close" onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant="h2">{food.name} portions</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        Match your actual serving to a reference, then use it.
      </AppText>

      {food.householdPortions.map((p) => (
        <Card key={p.unit}>
          <Row style={{ gap: theme.spacing.space12 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: theme.radii.sm,
                backgroundColor: theme.neutrals.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="image-outline" size={28} color={theme.neutrals.placeholder} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyEmphasis">{p.unit}</AppText>
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                ≈ {p.grams}g · {Math.round((food.per100g.kcal * p.grams) / 100)} kcal
              </AppText>
            </View>
          </Row>
          <Button variant="tertiary" label="Use this portion" onPress={() => navigation.goBack()} />
        </Card>
      ))}
    </Screen>
  );
}
