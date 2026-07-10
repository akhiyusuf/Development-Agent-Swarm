import React from 'react';
import { Modal, View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, radius, space } from '../theme/tokens';
import { Text } from './Typography';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: React.ReactNode;
  errorBanner?: string;
}

/**
 * §4.9 Modals/sheets — bottom sheet on mobile, warmgray-100 surface, 16px
 * top-corner radius, drag-handle affordance (visual only — no gesture-handler
 * dependency in this build, see BUILD_NOTES). Dismissable via backdrop tap or
 * an explicit close action from the caller; carries no deep nav state.
 */
export function BottomSheet({ visible, onDismiss, title, children, errorBanner }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss} />
      <SafeAreaView style={styles.sheetWrap} edges={['bottom']} pointerEvents="box-none">
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {title ? (
            <Text variant="h2" style={{ marginBottom: space[12] }}>
              {title}
            </Text>
          ) : null}
          {errorBanner ? (
            <View style={styles.errorBanner}>
              <Text variant="caption" colorToken={color.semantic.error}>
                {errorBanner}
              </Text>
            </View>
          ) : null}
          <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ gap: space[16] }}>
            {children}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(32,33,29,0.4)' },
  sheetWrap: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheet: {
    backgroundColor: color.neutral.warmgray100,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space[16],
    maxHeight: '90%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.neutral.warmgray400,
    marginBottom: space[12],
  },
  errorBanner: {
    backgroundColor: 'rgba(179,39,30,0.1)',
    borderRadius: radius.sm,
    padding: space[12],
    marginBottom: space[12],
  },
});
