import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

export type TabItem = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Small error/sync-warning badge dot on this tab. Never rendered without the icon (color never alone). */
  hasErrorBadge?: boolean;
};

export type TabBarProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

/**
 * Five-tab bottom navigation bar (nav primitive). Handles safe-area inset at
 * the bottom so it never collides with the home indicator (iOS) / gesture
 * bar (Android) — required for App Review on both platforms. Active tab is
 * signaled by color AND an underline dot, never color alone.
 */
export function TabBar({ items, activeKey, onChange }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.neutrals.surface,
          borderTopWidth: 1,
          borderTopColor: theme.neutrals.border,
          paddingBottom: Math.max(insets.bottom, theme.spacing.space8),
        },
      ]}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        const color = active ? theme.brand.terracotta : theme.neutrals.placeholder;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
            style={[styles.tab, { minHeight: theme.minTouchTarget, minWidth: theme.minTouchTarget }]}
          >
            <View>
              <Ionicons name={item.icon} size={22} color={color} />
              {item.hasErrorBadge ? (
                <View style={[styles.badgeDot, { backgroundColor: theme.semantic.error }]}>
                  <Ionicons name="alert" size={8} color={theme.neutrals.white} />
                </View>
              ) : null}
            </View>
            <Text style={{ fontSize: theme.type.micro.fontSize, fontWeight: theme.type.micro.fontWeight, color, marginTop: 2 }}>
              {item.label}
            </Text>
            <View
              style={{
                marginTop: 2,
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: active ? theme.brand.terracotta : 'transparent',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
