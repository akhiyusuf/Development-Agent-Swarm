import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, space, touchTarget } from '../theme/tokens';
import { Text } from './Typography';
import { Card } from './Card';

interface Props {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  state?: 'default' | 'error' | 'disabled';
}

/**
 * [Formalized gap #6] Lightweight list-row variant of Card (§4.5), used
 * pervasively: diary rows, search results, settings rows, favorites/recents.
 */
export function ListRow({ title, subtitle, meta, onPress, leading, trailing, state = 'default' }: Props) {
  return (
    <Card onPress={onPress} state={state} style={styles.card}>
      <View style={styles.row}>
        {leading}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="body">{title}</Text>
          {subtitle ? (
            <Text variant="caption" colorToken={color.neutral.warmgray700}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {meta ? <Text variant="caption">{meta}</Text> : null}
        {trailing}
        {onPress && !trailing ? (
          <Ionicons name="chevron-forward" size={18} color={color.neutral.warmgray700} />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: space[12], minHeight: touchTarget },
  row: { flexDirection: 'row', alignItems: 'center', gap: space[12] },
});
