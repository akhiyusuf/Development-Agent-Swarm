import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { PortionPhotoReference } from '../../components/PortionPhotoReference';
import { color, space } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';
import { getFoodById } from '../../data/foodDatabase';

/** N6. Portion Reference Guide — standalone expanded photo set (§4.4 core content). */
export function PortionReferenceGuideScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId } = route.params;
  const { isOnline } = useAppState();
  const food = getFoodById(foodId);

  if (!food) return null;

  return (
    <ScreenContainer density="relaxed">
      <Text variant="h1">{food.name} — portion guide</Text>
      <Text variant="caption" colorToken={color.neutral.warmgray700}>
        Reference photos for common household-unit portions of this dish.
      </Text>
      {food.photoRefs.length === 0 ? (
        <Text variant="body" colorToken={color.neutral.warmgray700}>
          No reference photos available for this food yet.
        </Text>
      ) : (
        <View style={{ gap: space[16] }}>
          <PortionPhotoReference references={food.photoRefs} size={140} offline={!isOnline} />
        </View>
      )}
      <Button label="Use this portion" onPress={() => nav.goBack()} />
      <Button label="Dismiss" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
