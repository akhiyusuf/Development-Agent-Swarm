import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, ListRow, SegmentedControl, StatusBadge, TextField, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { FOODS, FoodItem, isComposite } from '../../data/foods';
import type { RootParamList } from '../../navigation/types';

type Tab = 'search' | 'recent' | 'favorites' | 'custom';

// PLACEHOLDER recent/favorite ids (real user history is app-builder's job).
const RECENT_IDS = ['ng-jollof-rice', 'ke-sukuma-wiki', 'diaspora-egg-boiled'];
const FAVORITE_IDS: string[] = [];

/**
 * Add Food Entry (modal) — tabs Search / Recent / Favorites / Custom (Req 2).
 * The Search tab renders "Food Search Results" (N3) inline.
 *
 * DATA CONTRACT: `{ recentIds, favoriteIds, search(query): FoodItem[],
 *   customFoods: FoodItem[] }`. Selecting a result routes to Ingredient/Composite
 *   Detail by category, then Confirm & Log — one modal flow ([CP-MODAL-BACKOUT]).
 *   Offline: search falls back to cached/recent with an info banner (B1);
 *   [CP-EMPTY-SEARCH]: zero results -> "Create a custom food".
 */
export function AddEntryScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootParamList, 'AddEntry'>>();
  const slot = route.params?.slot;

  const [tab, setTab] = useState<Tab>('search');
  const [query, setQuery] = useState('');

  const results: FoodItem[] =
    query.trim() === ''
      ? FOODS.slice(0, 6)
      : FOODS.filter((f) => f.name.toLowerCase().includes(query.trim().toLowerCase()));

  function openDetail(food: FoodItem) {
    if (isComposite(food)) navigation.navigate('CompositeMealDetail', { foodId: food.id });
    else navigation.navigate('IngredientDetail', { foodId: food.id });
  }

  function resultRow(food: FoodItem) {
    return (
      <ListRow
        key={food.id}
        title={food.name}
        subtitle={`${food.region} · ${food.per100g.kcal} kcal/100g`}
        showChevron
        onPress={() => openDetail(food)}
      />
    );
  }

  function foodById(id: string) {
    return FOODS.find((f) => f.id === id);
  }

  return (
    <Screen>
      {slot ? (
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          Adding to {slot}
        </AppText>
      ) : null}

      <SegmentedControl
        value={tab}
        onChange={(v) => setTab(v as Tab)}
        options={[
          { value: 'search', label: 'Search' },
          { value: 'recent', label: 'Recent' },
          { value: 'favorites', label: 'Favorites' },
          { value: 'custom', label: 'Custom' },
        ]}
      />

      {tab === 'search' ? (
        <View style={{ gap: theme.spacing.space12 }}>
          <TextField label="Search foods" value={query} onChangeText={setQuery} placeholder="e.g. jollof, ugali, egg" />
          <Card>
            {results.length === 0 ? (
              <View style={{ gap: theme.spacing.space12 }}>
                <AppText variant="body">No matches for "{query}".</AppText>
                <Button label="Create a custom food" onPress={() => navigation.navigate('CustomFoodBuilder')} />
              </View>
            ) : (
              results.map(resultRow)
            )}
          </Card>
        </View>
      ) : null}

      {tab === 'recent' ? (
        <Card>
          {RECENT_IDS.map((id) => {
            const f = foodById(id);
            return f ? resultRow(f) : null;
          })}
        </Card>
      ) : null}

      {tab === 'favorites' ? (
        <Card>
          {FAVORITE_IDS.length === 0 ? (
            <View style={{ gap: theme.spacing.space12 }}>
              <StatusBadge tone="info" label="Nothing here yet" />
              <AppText variant="caption" color={theme.neutrals.charcoal}>
                Favorite a food from its detail screen and it'll show up here for one-tap logging.
              </AppText>
              <Button variant="tertiary" label="Search foods instead" onPress={() => setTab('search')} />
            </View>
          ) : (
            FAVORITE_IDS.map((id) => {
              const f = foodById(id);
              return f ? resultRow(f) : null;
            })
          )}
        </Card>
      ) : null}

      {tab === 'custom' ? (
        <Card>
          <View style={{ gap: theme.spacing.space12 }}>
            <AppText variant="body">Create your own ingredient or composite meal with its own portions.</AppText>
            <Button label="Open Custom Food Builder" onPress={() => navigation.navigate('CustomFoodBuilder')} />
          </View>
        </Card>
      ) : null}
    </Screen>
  );
}
