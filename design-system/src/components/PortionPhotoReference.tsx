import React, { useState } from 'react';
import { Image, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type PortionPhotoReferenceProps = {
  /** Reference photo for "what does 1 ladle / half plate actually look like". Omit the whole tile if none exists yet — never render a placeholder/broken-image box. */
  source?: ImageSourcePropType;
  caption: string; // e.g. "1 ladle ≈ 150g jollof rice"
};

/**
 * Portion-photo reference — first-class, reusable component (not incidental
 * imagery) used inline on Ingredient Detail, within Composite Meal Detail's
 * portion selector, and as the core content of the standalone Portion
 * Reference Guide. Static photography only, no auto-play. If the image
 * fails to load (offline/low bandwidth) this is treated as an expected
 * offline state — falls back to caption + icon, never an error toast.
 */
export function PortionPhotoReference({ source, caption }: PortionPhotoReferenceProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Per spec: if there is no reference photo for this dish, omit the tile
  // entirely rather than showing an empty/broken placeholder.
  if (!source) return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => !failed && setExpanded(true)}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Expand reference photo: ${caption}`}
        style={({ pressed }) => [
          styles.tile,
          {
            borderRadius: theme.radii.sm,
            backgroundColor: theme.neutrals.surface,
            opacity: pressed && !reducedMotion ? 0.85 : 1,
          },
        ]}
      >
        {failed ? (
          <View style={styles.fallback}>
            <Ionicons name="image-outline" size={28} color={theme.neutrals.placeholder} />
          </View>
        ) : (
          <Image
            source={source}
            style={styles.image}
            resizeMode="cover"
            onError={() => setFailed(true)}
            accessibilityIgnoresInvertColors
          />
        )}
      </Pressable>
      <Text
        style={{
          fontSize: theme.type.caption.fontSize,
          color: theme.neutrals.charcoal,
          marginTop: theme.spacing.space4,
          maxWidth: 96,
        }}
      >
        {caption}
      </Text>

      <Modal visible={expanded} transparent animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={() => setExpanded(false)}>
        <Pressable
          style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.7)' }]}
          onPress={() => setExpanded(false)}
        >
          <Image source={source} style={styles.modalImage} resizeMode="contain" />
          <Text style={{ color: theme.neutrals.white, marginTop: theme.spacing.space16, fontSize: theme.type.body.fontSize }}>
            {caption}
          </Text>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 96,
  },
  tile: {
    width: 96,
    height: 96,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalImage: {
    width: '100%',
    height: '60%',
  },
});
