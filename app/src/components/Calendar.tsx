import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, radius, space } from '../theme/tokens';
import { Text } from './Typography';

export type DayCompleteness = 'none' | 'partial' | 'logged';

interface Props {
  initialMonth?: Date;
  getCompleteness?: (date: Date) => DayCompleteness;
  onSelectDay: (date: Date) => void;
  selectedDate?: Date;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const COMPLETENESS_ICON: Record<DayCompleteness, keyof typeof Ionicons.glyphMap> = {
  none: 'ellipse-outline',
  partial: 'contrast-outline',
  logged: 'checkmark-circle',
};
const COMPLETENESS_COLOR: Record<DayCompleteness, string> = {
  none: color.neutral.warmgray700,
  partial: color.semantic.warning,
  logged: color.semantic.success,
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/**
 * [Additive component — design-system gap #4, flagged in docs/screens.md]
 * Month calendar/date-picker used by Nutrition History (N12) and Workout
 * History (W8). Each day cell carries a completeness indicator via icon +
 * color (never color alone, §6.5). Falls back visually fine on narrow
 * widths since cells are proportionally sized, not fixed px.
 */
export function Calendar({ initialMonth = new Date(), getCompleteness, onSelectDay, selectedDate }: Props) {
  const [month, setMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDayOfWeek = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const today = new Date();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, m, d));

  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          onPress={() => setMonth(new Date(year, m - 1, 1))}
          style={styles.navBtn}
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={20} color={color.primary.terracotta} />
        </Pressable>
        <Text variant="h3">{monthLabel}</Text>
        <Pressable onPress={() => setMonth(new Date(year, m + 1, 1))} style={styles.navBtn} accessibilityLabel="Next month">
          <Ionicons name="chevron-forward" size={20} color={color.primary.terracotta} />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={i} variant="micro" colorToken={color.neutral.warmgray700} style={styles.weekCell}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((date, i) => {
          if (!date) return <View key={i} style={styles.cell} />;
          const completeness = getCompleteness?.(date) ?? 'none';
          const isToday = sameDay(date, today);
          const isSelected = selectedDate && sameDay(date, selectedDate);
          return (
            <Pressable
              key={i}
              onPress={() => onSelectDay(date)}
              style={[styles.cell, styles.dayCell, isSelected && styles.selectedCell, isToday && styles.todayCell]}
              accessibilityLabel={`${date.toDateString()}, ${completeness}`}
            >
              <Text variant="caption" colorToken={isSelected ? color.neutral.white : undefined}>
                {date.getDate()}
              </Text>
              <Ionicons
                name={COMPLETENESS_ICON[completeness]}
                size={10}
                color={isSelected ? color.neutral.white : COMPLETENESS_COLOR[completeness]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space[8] },
  navBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  weekRow: { flexDirection: 'row' },
  weekCell: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayCell: { borderRadius: radius.sm, gap: 2 },
  selectedCell: { backgroundColor: color.primary.terracotta },
  todayCell: { borderWidth: 1, borderColor: color.primary.terracotta },
});
