import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

export type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  errorMessage?: string;
  children: React.ReactNode;
};

/**
 * Bottom sheet / modal. Bottom-anchored, rounded top corners, drag-handle
 * affordance, and bottom safe-area padding so sheet content never sits under
 * the home indicator / gesture bar. Inline error banner uses a tinted
 * background plus icon+text, never color alone.
 */
export function BottomSheet({ visible, onClose, title, errorMessage, children }: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reducedMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <Pressable style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.4)' }]} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.neutrals.background,
              borderTopLeftRadius: theme.radii.lg,
              borderTopRightRadius: theme.radii.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.space16),
              paddingHorizontal: theme.spacing.space16,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.neutrals.border }]} />
          {title ? (
            <Text
              style={{
                fontSize: theme.type.h2.fontSize,
                fontWeight: theme.type.h2.fontWeight,
                color: theme.neutrals.ink,
                marginTop: theme.spacing.space12,
                marginBottom: theme.spacing.space12,
              }}
            >
              {title}
            </Text>
          ) : null}
          {errorMessage ? (
            <View
              style={{
                backgroundColor: theme.semantic.error + '1A',
                borderRadius: theme.radii.sm,
                padding: theme.spacing.space12,
                marginBottom: theme.spacing.space12,
              }}
            >
              <Text style={{ color: theme.semantic.error, fontSize: theme.type.caption.fontSize }}>
                ⚠ {errorMessage}
              </Text>
            </View>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
});
