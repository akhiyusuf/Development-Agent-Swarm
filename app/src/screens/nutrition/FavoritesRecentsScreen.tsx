import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { ListRow } from '../../components/ListRow';
import { color, space, touchTarget } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getFoodById } from '../../data/foodDatabase';

/** N13. Favorites & Recents Management. */
export function FavoritesRecentsScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();
  const favorites = state.favorites.map((id) => getFoodById(id)).filter(Boolean) as ReturnType<typeof getFoodById>[];
  const recents = state.recents.map((id) => getFoodById(id)).filter(Boolean) as ReturnType<typeof getFoodById>[];

  return (
    <ScreenContainer>
      <Text variant="h1">Favorites & Recents</Text>
      <Text variant="h3">Favorites</Text>
      <View style={{ gap: space[8] }}>
        {favorites.length === 0 ? (
          <Text variant="caption" colorToken={color.neutral.warmgray700}>
            No favorites yet.
          </Text>
        ) : (
          favorites.map((f) =>
            f ? (
              <ListRow
                key={f.id}
                title={f.name}
                subtitle={`${f.caloriesPerUnit} kcal / ${f.units[0]?.label}`}
                onPress={() => nav.navigate('FoodDetail', { foodId: f.id, slot: 'snack' })}
                trailing={
                  <Pressable
                    onPress={() => dispatch({ type: 'TOGGLE_FAVORITE', foodId: f.id })}
                    style={{ minWidth: touchTarget, minHeight: touchTarget, alignItems: 'center', justifyContent: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel="Remove favorite"
                  >
                    <Ionicons name="star" size={20} color={color.primary.gold} />
                  </Pressable>
                }
              />
            ) : null
          )
        )}
      </View>
      <Text variant="h3">Recents</Text>
      <View style={{ gap: space[8] }}>
        {recents.length === 0 ? (
          <Text variant="caption" colorToken={color.neutral.warmgray700}>
            No recent foods yet.
          </Text>
        ) : (
          recents.map((f, i) =>
            f ? (
              <ListRow
                key={`${f.id}-${i}`}
                title={f.name}
                subtitle={`${f.caloriesPerUnit} kcal / ${f.units[0]?.label}`}
                onPress={() => nav.navigate('FoodDetail', { foodId: f.id, slot: 'snack' })}
              />
            ) : null
          )
        )}
      </View>
    </ScreenContainer>
  );
}
