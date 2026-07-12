import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export type CalendarDatePickerProps = {
  /** First-of-month date representing the displayed month. */
  month: Date;
  selectedDate?: Date;
  /** Dates (YYYY-MM-DD) that should render a small activity dot. */
  markedDates?: Set<string>;
  onSelectDay: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Calendar / date-picker — fills the sitemap-flagged gap needed by
 * Nutrition History and Workout History/Session Calendar. Cell Pressables
 * fill their entire 7-column grid cell (not just the smaller visible day
 * disc), and `hitSlop` is computed from the actually-measured column width
 * (via `onLayout`, not assumed) so each cell's real hit area is topped up to
 * the touch-target floor even on the narrowest supported screen widths,
 * rather than relying on a fixed hit-slop guess that only works at typical
 * widths.
 */
export function CalendarDatePicker({ month, selectedDate, markedDates, onSelectDay, onChangeMonth }: CalendarDatePickerProps) {
  const theme = useTheme();
  const today = new Date();
  const [columnWidth, setColumnWidth] = useState<number | null>(null);
  // Before the first onLayout measurement, assume the worst case so no frame
  // ever renders under-floor: a hit area of exactly minTouchTarget requires
  // hitSlop = minTouchTarget on each side if the real cell were 0-width.
  const cellHitSlop = columnWidth != null
    ? Math.max(4, Math.ceil((theme.minTouchTarget - columnWidth) / 2))
    : theme.minTouchTarget;

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIndex, d));

  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <View>
      <View style={[styles.header, { marginBottom: theme.spacing.space12 }]}>
        <Pressable
          onPress={() => onChangeMonth(new Date(year, monthIndex - 1, 1))}
          accessibilityLabel="Previous month"
          style={{ minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.neutrals.ink} />
        </Pressable>
        <Pressable
          onPress={() => onChangeMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
          accessibilityRole="button"
          accessibilityLabel={`${monthLabel}, jump to current month`}
          style={{ minHeight: theme.minTouchTarget, justifyContent: 'center', paddingHorizontal: theme.spacing.space8 }}
        >
          <Text style={{ fontSize: theme.type.h3.fontSize, fontWeight: theme.type.h3.fontWeight, color: theme.neutrals.ink }}>
            {monthLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeMonth(new Date(year, monthIndex + 1, 1))}
          accessibilityLabel="Next month"
          style={{ minWidth: theme.minTouchTarget, minHeight: theme.minTouchTarget, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-forward" size={22} color={theme.neutrals.ink} />
        </Pressable>
      </View>

      <View style={styles.row}>
        {WEEKDAY_LABELS.map((wd, i) => (
          <Text
            key={`${wd}-${i}`}
            style={{ width: `${100 / 7}%`, textAlign: 'center', fontSize: theme.type.micro.fontSize, color: theme.neutrals.placeholder }}
          >
            {wd}
          </Text>
        ))}
      </View>

      <View
        style={styles.grid}
        onLayout={(e) => setColumnWidth(e.nativeEvent.layout.width / 7)}
      >
        {cells.map((date, idx) => {
          if (!date) return <View key={`empty-${idx}`} style={styles.cellWrap} />;
          const key = toKey(date);
          const isSelected = selectedDate && toKey(selectedDate) === key;
          const isToday = toKey(today) === key;
          const marked = markedDates?.has(key);
          return (
            <View key={key} style={styles.cellWrap}>
              {/* Pressable fills the entire grid column (not just the smaller
                  visible day disc below), and hitSlop tops up any remaining
                  shortfall — see cellHitSlop above — so the real hit area
                  always meets the touch-target floor. */}
              <Pressable
                onPress={() => onSelectDay(date)}
                hitSlop={cellHitSlop}
                accessibilityRole="button"
                accessibilityLabel={date.toDateString()}
                style={styles.cellPressable}
              >
                <View
                  style={[
                    styles.cell,
                    {
                      borderRadius: 8,
                      backgroundColor: isSelected ? theme.brand.terracotta : 'transparent',
                      borderWidth: isToday && !isSelected ? 1.5 : 0,
                      borderColor: theme.brand.terracotta,
                    },
                  ]}
                >
                  <Text style={{ color: isSelected ? theme.neutrals.white : theme.neutrals.ink, fontSize: theme.type.body.fontSize }}>
                    {date.getDate()}
                  </Text>
                  {marked ? (
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 2,
                        marginTop: 2,
                        backgroundColor: isSelected ? theme.neutrals.white : theme.brand.deepGreen,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellWrap: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** The actual Pressable hit area: the full grid column, not the smaller
   * visible day disc — see `cell` below, and the `cellHitSlop` computation
   * in the component for how the remaining floor shortfall is topped up. */
  cellPressable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** The visible day disc, inset within the (larger) Pressable above. */
  cell: {
    width: '86%',
    height: '86%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
