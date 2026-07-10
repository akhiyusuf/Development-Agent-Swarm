import React, { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatusBadge } from '../../components/StatusBadge';
import { space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { searchFoods, getFoodById, FOOD_DATABASE, customFoodToFoodItem } from '../../data/foodDatabase';
import { FoodResultsList } from './FoodResultsList';

/** N2. Add Food Entry — tabs: Search / Recent / Favorites / Custom. */
export function AddEntryScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const slot = route.params?.slot ?? 'snack';
  const { state, isOnline } = useAppState();
  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');

  // Custom foods (N7 saves) are first-class here: always included alongside
  // the seed database rather than being a save-only dead end (see
  // BUILD_NOTES.md — Req 2 fix).
  const customFoodItems = useMemo(() => state.customFoods.map(customFoodToFoodItem), [state.customFoods]);

  const regionFiltered = useMemo(
    () => [
      ...customFoodItems,
      ...FOOD_DATABASE.filter(
        (f) => f.region === state.region.market || (state.region.includeWestern && f.region === 'Diaspora/Western')
      ),
    ],
    [state.region, customFoodItems]
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return regionFiltered;
    const q = query.trim().toLowerCase();
    return [...customFoodItems.filter((f) => f.name.toLowerCase().includes(q)), ...searchFoods(query)];
  }, [query, regionFiltered, customFoodItems]);

  const recentFoods = state.recents
    .map((id) => getFoodById(id) ?? customFoodItems.find((f) => f.id === id))
    .filter(Boolean) as typeof FOOD_DATABASE;
  const favoriteFoods = state.favorites
    .map((id) => getFoodById(id) ?? customFoodItems.find((f) => f.id === id))
    .filter(Boolean) as typeof FOOD_DATABASE;

  const selectFood = (foodId: string) => {
    nav.navigate('FoodDetail', { foodId, slot });
  };

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Add to {slot}</Text>
      <SegmentedControl
        options={[
          { value: 'search', label: 'Search' },
          { value: 'recent', label: 'Recent' },
          { value: 'favorites', label: 'Favorites' },
          { value: 'custom', label: 'Custom' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {!isOnline && tab === 'search' ? (
        <StatusBadge tone="info" label="Offline — showing cached/recent results" />
      ) : null}

      {tab === 'search' ? (
        <>
          <Input placeholder="Search foods…" value={query} onChangeText={setQuery} />
          {query.trim().length > 0 && searchResults.length === 0 ? (
            <Button label="Create a custom food" variant="tertiary" onPress={() => setTab('custom')} />
          ) : null}
          <FoodResultsList foods={searchResults} onSelect={(f) => selectFood(f.id)} />
        </>
      ) : tab === 'recent' ? (
        <FoodResultsList foods={recentFoods} onSelect={(f) => selectFood(f.id)} emptyLabel="No recent foods yet." />
      ) : tab === 'favorites' ? (
        <FoodResultsList foods={favoriteFoods} onSelect={(f) => selectFood(f.id)} emptyLabel="No favorites yet." />
      ) : (
        <>
          <Button label="Build a custom food or meal" onPress={() => nav.navigate('CustomFoodBuilder', { slot })} />
          <FoodResultsList
            foods={customFoodItems}
            onSelect={(f) => selectFood(f.id)}
            emptyLabel="No custom foods yet — build one above."
          />
        </>
      )}
    </ScreenContainer>
  );
}
