import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingText?: string;
  showChevron?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  /** Small colored dot + glyph badge, e.g. a sync-error indicator. Never color alone. */
  badge?: { color: string; icon: keyof typeof Ionicons.glyphMap; label: string };
};

/**
 * Formal list-row component, used pervasively (diary entries, settings rows,
 * search results) as a lightweight variant of Card with a title/subtitle/
 * trailing-content layout, per the sitemap's flagged need for a dedicated
 * row component distinct from a general card.
 */
export function ListRow({
  title,
  subtitle,
  leadingIcon,
  trailingText,
  showChevron,
  onPress,
  disabled,
  badge,
}: ListRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.row,
        {
          minHeight: theme.minTouchTarget,
          paddingVertical: theme.spacing.space12,
          paddingHorizontal: theme.spacing.space16,
          backgroundColor: pressed && onPress ? theme.neutrals.background : 'transparent',
          opacity: disabled ? 0.6 : 1,
          borderBottomWidth: 1,
          borderBottomColor: theme.neutrals.border,
        },
      ]}
    >
      {leadingIcon ? (
        <Ionicons
          name={leadingIcon}
          size={22}
          color={theme.neutrals.charcoal}
          style={{ marginRight: theme.spacing.space12 }}
        />
      ) : null}
      <View style={styles.textCol}>
        <Text
          style={{
            fontSize: theme.type.h3.fontSize,
            fontWeight: theme.type.h3.fontWeight,
            color: disabled ? theme.neutrals.placeholder : theme.neutrals.ink,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontSize: theme.type.caption.fontSize,
              color: theme.neutrals.charcoal,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Ionicons name={badge.icon} size={12} color={theme.neutrals.white} />
        </View>
      ) : null}
      {trailingText ? (
        <Text style={{ fontSize: theme.type.body.fontSize, color: theme.neutrals.charcoal }}>
          {trailingText}
        </Text>
      ) : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={20} color={theme.neutrals.placeholder} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  textCol: {
    flex: 1,
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
});
