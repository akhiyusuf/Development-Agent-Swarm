import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, space } from '../theme/tokens';
import { Text } from './Typography';

export interface PhotoReference {
  id: string;
  caption: string; // e.g. "1 ladle ≈ 150g jollof rice"
  /**
   * No real commissioned/sourced photography is available in this build
   * environment (see BUILD_NOTES.md). `tone` selects a flat placeholder
   * color standing in for where an authentic reference photo would render;
   * this is never generic "African-coded" stock art and never bakes text
   * into the tile — the caption below is real text (§6.9).
   */
  tone?: string;
}

interface Props {
  references: PhotoReference[];
  size?: number;
  onExpand?: () => void;
  offline?: boolean;
}

/**
 * §4.4 Portion-photo reference component (first-class). Appears inline on
 * Ingredient Detail / Composite Meal Detail, and is the core content of the
 * standalone Portion Reference Guide. If no reference exists for a food, the
 * tile is omitted entirely — never a broken/empty placeholder box (§4.4). If
 * offline/image load fails, falls back to caption + icon (expected offline
 * state, not an error, §6.8).
 */
export function PortionPhotoReference({ references, size = 96, onExpand, offline }: Props) {
  if (!references.length) return null;
  return (
    <View style={styles.row}>
      {references.map((ref) => (
        <Pressable key={ref.id} onPress={onExpand} style={styles.tileWrap} accessibilityRole="imagebutton">
          {offline ? (
            <View style={[styles.tile, { width: size, height: size, backgroundColor: color.neutral.warmgray200 }]}>
              <Ionicons name="image-outline" size={28} color={color.neutral.warmgray700} />
            </View>
          ) : (
            <View style={[styles.tile, { width: size, height: size, backgroundColor: ref.tone ?? color.primary.deepgreen }]}>
              <Ionicons name="restaurant-outline" size={28} color={color.neutral.white} />
            </View>
          )}
          <Text variant="caption" style={{ width: size }} colorToken={color.neutral.warmgray700}>
            {ref.caption}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[12] },
  tileWrap: { gap: 4 },
  tile: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
