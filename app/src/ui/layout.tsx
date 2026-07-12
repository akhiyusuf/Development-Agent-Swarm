/**
 * App-level layout scaffolding. These are NOT re-implementations of
 * design-system primitives (the design system exports no Text / Screen /
 * Row primitive) — they are thin composition helpers that read the
 * design-system theme so every screen shares the same tokens. All visual
 * primitives with real states (Button, Card, ListRow, TextField, chips,
 * rings, charts, skill nodes, sheets, tab bar…) come from
 * `@fit-and-fed/design-system` and are never restyled here.
 */
import React from 'react';
import {
  ScrollView,
  StyleProp,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@fit-and-fed/design-system';

type TypeVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyEmphasis'
  | 'caption'
  | 'micro'
  | 'timerXl';

export function AppText({
  variant = 'body',
  color,
  style,
  ...rest
}: TextProps & { variant?: TypeVariant; color?: string }) {
  const theme = useTheme();
  const t = theme.type[variant];
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize: t.fontSize,
          lineHeight: t.lineHeight,
          fontWeight: t.fontWeight,
          color: color ?? theme.neutrals.ink,
        },
        style,
      ]}
    />
  );
}

/** Full-screen container: themed background + safe-area top + scrollable body. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pad = padded ? theme.spacing.space16 : 0;

  const inner = (
    <View style={[{ padding: pad, gap: theme.spacing.space16 }, contentStyle]}>
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.neutrals.background, paddingTop: insets.top }}>
        {inner}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.neutrals.background }}
      contentContainerStyle={{ paddingTop: insets.top + theme.spacing.space8, paddingBottom: theme.spacing.space48 }}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}

export function Gap({ size = 16 }: { size?: number }) {
  return <View style={{ height: size }} />;
}

export function Row({ style, children, ...rest }: ViewProps) {
  return (
    <View {...rest} style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {children}
    </View>
  );
}

/** A titled section grouping — a label above whatever content follows. */
export function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.space8 }}>
      <AppText variant="h3">{title}</AppText>
      {caption ? (
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          {caption}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}
