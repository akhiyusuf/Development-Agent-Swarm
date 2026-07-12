import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, ListRow, StatusBadge, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';
import { FOODS, isComposite } from '../../data/foods';
import { useAppState } from '../../state/AppStateContext';

/**
 * Favorites & Recents Management (N13) — quick-log + edit/remove (Req 2).
 *
 * DATA CONTRACT: `{ favoriteIds, recentIds }`. Each row quick-logs (jumps to
 * Confirm & Log with the last-used portion pre-filled, B7). Each section shows
 * its own independent empty state.
 */
export function FavoritesRecentsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { favorites, recents, customFoods } = useAppState();
  const allFoods = [...FOODS, ...customFoods];

  function quickLog(id: string) {
    const f = allFoods.find((x) => x.id === id);
    if (!f) return;
    navigation.navigate('ConfirmLog', {
      foodId: id,
      unitLabel: f.householdPortions[0]?.unit,
      quantity: 1,
    });
  }

  function rows(ids: string[]) {
    return ids.map((id) => {
      const f = allFoods.find((x) => x.id === id);
      if (!f) return null;
      return (
        <ListRow
          key={id}
          title={f.name}
          subtitle={`${f.region} · ${isComposite(f) ? 'meal' : 'ingredient'}`}
          trailingText="Log"
          showChevron
          onPress={() => quickLog(id)}
        />
      );
    });
  }

  return (
    <Screen>
      <Section title="Favorites">
        <Card>
          {favorites.length === 0 ? (
            <StatusBadge tone="info" label="Nothing favorited yet" />
          ) : (
            rows(favorites)
          )}
        </Card>
      </Section>

      <Section title="Recents">
        <Card>
          {recents.length === 0 ? (
            <StatusBadge tone="info" label="Log something to build your recents" />
          ) : (
            rows(recents)
          )}
        </Card>
      </Section>

      <Button variant="tertiary" label="Add a new food" onPress={() => navigation.navigate('AddEntry')} />
    </Screen>
  );
}
