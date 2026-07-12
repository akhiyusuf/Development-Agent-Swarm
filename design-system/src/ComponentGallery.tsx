import React, { useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useThemeMode } from './theme/ThemeContext';
import { brandColors, lightNeutrals, darkNeutrals, semanticColors, nodeColors, macroColors } from './theme/tokens';

import { Button } from './components/Button';
import { TextField } from './components/TextField';
import { Card } from './components/Card';
import { ListRow } from './components/ListRow';
import { SegmentedControl } from './components/SegmentedControl';
import { SingleSelectChips } from './components/SingleSelectChips';
import { ToggleSwitch } from './components/ToggleSwitch';
import { HouseholdUnitPortionPicker } from './components/HouseholdUnitPortionPicker';
import { PortionPhotoReference } from './components/PortionPhotoReference';
import { TabBar } from './components/TabBar';
import { BottomSheet } from './components/BottomSheet';
import { ProgressRing } from './components/ProgressRing';
import { ProgressBar } from './components/ProgressBar';
import { SkillNode, NodeState } from './components/SkillNode';
import { NodeStateBadge } from './components/NodeStateBadge';
import { StatusBadge } from './components/StatusBadge';
import { SessionPlayer, SessionPlayerPhase } from './components/SessionPlayer';
import { CalendarDatePicker } from './components/CalendarDatePicker';
import { TrendChart } from './components/TrendChart';

const SECTIONS = [
  'Foundations',
  'Buttons',
  'Inputs',
  'Selection controls',
  'Portion logging',
  'Cards & rows',
  'Navigation',
  'Sheets',
  'Progress',
  'Skill tree',
  'Session player',
  'Calendar & trends',
] as const;

function Section({ title, children, onLayout }: { title: string; children: React.ReactNode; onLayout?: (y: number) => void }) {
  const theme = useTheme();
  return (
    <View
      onLayout={(e) => onLayout?.(e.nativeEvent.layout.y)}
      style={{ marginBottom: theme.spacing.space32, paddingHorizontal: theme.spacing.space16 }}
    >
      <Text
        style={{
          fontSize: theme.type.h1.fontSize,
          fontWeight: theme.type.h1.fontWeight,
          color: theme.neutrals.ink,
          marginBottom: theme.spacing.space16,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Text
      style={{
        fontSize: theme.type.caption.fontSize,
        fontWeight: '600',
        color: theme.neutrals.placeholder,
        marginTop: theme.spacing.space16,
        marginBottom: theme.spacing.space8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {children}
    </Text>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  const theme = useTheme();
  return (
    <View style={{ width: 92, marginRight: theme.spacing.space12, marginBottom: theme.spacing.space12 }}>
      <View style={{ width: 92, height: 48, borderRadius: theme.radii.sm, backgroundColor: hex, borderWidth: 1, borderColor: theme.neutrals.border }} />
      <Text style={{ fontSize: theme.type.micro.fontSize, color: theme.neutrals.ink, marginTop: 4 }} numberOfLines={1}>
        {name}
      </Text>
      <Text style={{ fontSize: theme.type.micro.fontSize, color: theme.neutrals.placeholder }}>{hex}</Text>
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{children}</View>;
}

/**
 * Renders every component in this package in every documented state, on one
 * navigable, scrollable surface, organized by section — this is what makes
 * the package genuinely previewable rather than a folder of unused files.
 * Wired as the package's default screen (see App.tsx).
 */
export function ComponentGallery() {
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  // --- interactive demo state ---
  const [textValue, setTextValue] = useState('');
  const [segment, setSegment] = useState('search');
  const [singleSelect, setSingleSelect] = useState<string | null>('lose');
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [unitKey, setUnitKey] = useState<string | null>('ladle');
  const [unitQty, setUnitQty] = useState(1);
  const [activeTab, setActiveTab] = useState('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());
  const [calSelected, setCalSelected] = useState<Date | undefined>(new Date());
  const [calisthenicsPhase, setCalisthenicsPhase] = useState<SessionPlayerPhase>('active');
  const [pilatesPhase, setPilatesPhase] = useState<SessionPlayerPhase>('active');

  const jumpTo = (title: string) => {
    const y = sectionOffsets.current[title];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: y - 8, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.neutrals.background }}>
      <View
        style={{
          paddingTop: insets.top + theme.spacing.space8,
          paddingHorizontal: theme.spacing.space16,
          paddingBottom: theme.spacing.space8,
          backgroundColor: theme.neutrals.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.neutrals.border,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: theme.type.h2.fontSize, fontWeight: theme.type.h2.fontWeight, color: theme.neutrals.ink }}>
            Fit & Fed — Design System
          </Text>
          <SegmentedControl
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            value={mode === 'system' ? 'light' : mode}
            onChange={(v) => setMode(v as 'light' | 'dark')}
            accessibilityLabel="Toggle color scheme"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: theme.spacing.space8 }}>
          {SECTIONS.map((s) => (
            <Text
              key={s}
              onPress={() => jumpTo(s)}
              style={{
                fontSize: theme.type.caption.fontSize,
                color: theme.brand.terracotta,
                marginRight: theme.spacing.space16,
                paddingVertical: 4,
              }}
            >
              {s}
            </Text>
          ))}
        </ScrollView>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingTop: theme.spacing.space24, paddingBottom: theme.spacing.space48 }}>
        {/* ---------------- Foundations ---------------- */}
        <Section title="Foundations" onLayout={(y) => (sectionOffsets.current['Foundations'] = y)}>
          <SubLabel>Brand</SubLabel>
          <Row>
            {Object.entries(brandColors).map(([k, v]) => (
              <Swatch key={k} hex={v} name={k} />
            ))}
          </Row>
          <SubLabel>Neutrals ({theme.mode})</SubLabel>
          <Row>
            {Object.entries(theme.mode === 'dark' ? darkNeutrals : lightNeutrals).map(([k, v]) => (
              <Swatch key={k} hex={v} name={k} />
            ))}
          </Row>
          <SubLabel>Semantic (fixed, system-wide)</SubLabel>
          <Row>
            {Object.entries(semanticColors).map(([k, v]) => (
              <Swatch key={k} hex={v} name={k} />
            ))}
          </Row>
          <SubLabel>Node / skill-tree state (fixed, exclusive)</SubLabel>
          <Row>
            {Object.entries(nodeColors).map(([k, v]) => (
              <Swatch key={k} hex={v} name={k} />
            ))}
          </Row>
          <SubLabel>Macro-ring accents</SubLabel>
          <Row>
            {Object.entries(macroColors).map(([k, v]) => (
              <Swatch key={k} hex={v} name={k} />
            ))}
          </Row>
          <SubLabel>Type scale</SubLabel>
          {(['display', 'timerXl', 'h1', 'h2', 'h3', 'body', 'bodyEmphasis', 'caption', 'micro'] as const).map((t) => (
            <Text
              key={t}
              style={{
                fontSize: theme.type[t].fontSize,
                fontWeight: theme.type[t].fontWeight,
                color: theme.neutrals.ink,
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {t} — {theme.type[t].fontSize}/{theme.type[t].lineHeight}
            </Text>
          ))}
          <SubLabel>Spacing scale</SubLabel>
          <Row>
            {Object.entries(theme.spacing).map(([k, v]) => (
              <View key={k} style={{ marginRight: 12, marginBottom: 8, alignItems: 'center' }}>
                <View style={{ width: v, height: 12, backgroundColor: theme.brand.terracotta }} />
                <Text style={{ fontSize: theme.type.micro.fontSize, color: theme.neutrals.charcoal }}>{k}: {v}</Text>
              </View>
            ))}
          </Row>
        </Section>

        {/* ---------------- Buttons ---------------- */}
        <Section title="Buttons" onLayout={(y) => (sectionOffsets.current['Buttons'] = y)}>
          <SubLabel>Primary — default / disabled / error</SubLabel>
          <Row>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Log meal" variant="primary" onPress={() => {}} /></View>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Log meal" variant="primary" disabled /></View>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Retry" variant="primary" error errorMessage="Save failed — try again" onPress={() => {}} /></View>
          </Row>
          <SubLabel>Secondary (terracotta-outlined — single owner) — default / disabled / error</SubLabel>
          <Row>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Cancel" variant="secondary" onPress={() => {}} /></View>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Cancel" variant="secondary" disabled /></View>
            <View style={{ marginRight: 12, marginBottom: 12, width: 160 }}><Button label="Cancel" variant="secondary" error onPress={() => {}} /></View>
          </Row>
          <SubLabel>Tertiary — default / disabled</SubLabel>
          <Row>
            <View style={{ marginRight: 12, marginBottom: 12, width: 120 }}><Button label="Skip" variant="tertiary" onPress={() => {}} /></View>
            <View style={{ marginRight: 12, marginBottom: 12, width: 120 }}><Button label="Skip" variant="tertiary" disabled /></View>
          </Row>
        </Section>

        {/* ---------------- Inputs ---------------- */}
        <Section title="Inputs" onLayout={(y) => (sectionOffsets.current['Inputs'] = y)}>
          <SubLabel>Default (focus on tap)</SubLabel>
          <TextField label="Food search" placeholder="e.g. jollof rice" value={textValue} onChangeText={setTextValue} />
          <SubLabel>Disabled</SubLabel>
          <TextField label="Email" placeholder="you@example.com" disabled />
          <SubLabel>Error</SubLabel>
          <TextField label="Weight (kg)" placeholder="0" error errorMessage="Enter a value between 20 and 300" />
        </Section>

        {/* ---------------- Selection controls ---------------- */}
        <Section title="Selection controls" onLayout={(y) => (sectionOffsets.current['Selection controls'] = y)}>
          <SubLabel>Segmented control</SubLabel>
          <SegmentedControl
            options={[
              { value: 'search', label: 'Search' },
              { value: 'recent', label: 'Recent' },
              { value: 'favorites', label: 'Favorites' },
              { value: 'custom', label: 'Custom' },
            ]}
            value={segment}
            onChange={setSegment}
            accessibilityLabel="Add entry source"
          />
          <SubLabel>Single-select chips (default / error)</SubLabel>
          <SingleSelectChips
            options={[
              { value: 'lose', label: 'Lose weight' },
              { value: 'maintain', label: 'Maintain' },
              { value: 'gain', label: 'Gain' },
            ]}
            value={singleSelect}
            onChange={setSingleSelect}
            accessibilityLabel="Primary goal"
          />
          <View style={{ height: 12 }} />
          <SingleSelectChips
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
            ]}
            value={null}
            onChange={() => {}}
            error
            errorMessage="Select one option to continue"
          />
          <SubLabel>Toggle / switch — on / off / disabled</SubLabel>
          <ToggleSwitch value={toggle1} onChange={setToggle1} label="Include Western/diaspora food set" />
          <ToggleSwitch value={toggle2} onChange={setToggle2} label="Low-data mode" />
          <ToggleSwitch value={true} onChange={() => {}} label="Sync now (disabled while syncing)" disabled />
        </Section>

        {/* ---------------- Portion logging ---------------- */}
        <Section title="Portion logging" onLayout={(y) => (sectionOffsets.current['Portion logging'] = y)}>
          <SubLabel>Household-unit portion picker (default)</SubLabel>
          <HouseholdUnitPortionPicker
            units={[
              { key: 'ladle', label: '1 ladle', icon: 'restaurant-outline' },
              { key: 'halfplate', label: 'Half plate', icon: 'ellipse-outline' },
              { key: 'wrap', label: '1 wrap', icon: 'reader-outline' },
              { key: 'cup', label: '1 cup', icon: 'cafe-outline' },
            ]}
            selectedUnitKey={unitKey}
            quantity={unitQty}
            onSelectUnit={setUnitKey}
            onQuantityChange={setUnitQty}
          />
          <SubLabel>Household-unit portion picker (no conversion defined — falls back to grams)</SubLabel>
          <HouseholdUnitPortionPicker
            units={[]}
            selectedUnitKey={null}
            quantity={1}
            onSelectUnit={() => {}}
            onQuantityChange={() => {}}
            disabledNoConversion
          />
          <SubLabel>Portion-photo reference (present / missing-omitted / failed-to-load)</SubLabel>
          <Row>
            <PortionPhotoReference source={{ uri: 'https://picsum.photos/seed/jollof/200' }} caption="1 ladle ≈ 150g jollof rice" />
            <View style={{ width: 96 }}>
              <Text style={{ fontSize: theme.type.caption.fontSize, color: theme.neutrals.placeholder }}>
                (tile omitted — no reference photo yet, per spec)
              </Text>
            </View>
            <PortionPhotoReference source={{ uri: 'https://invalid.example/broken.jpg' }} caption="1 wrap ≈ 220g suya wrap" />
          </Row>
        </Section>

        {/* ---------------- Cards & rows ---------------- */}
        <Section title="Cards & rows" onLayout={(y) => (sectionOffsets.current['Cards & rows'] = y)}>
          <SubLabel>Card — default / tappable / disabled / error</SubLabel>
          <View style={{ gap: 12 }}>
            <Card><Text style={{ color: theme.neutrals.ink }}>Static card content</Text></Card>
            <Card onPress={() => {}}><Text style={{ color: theme.neutrals.ink }}>Tappable card (press for state)</Text></Card>
            <Card disabled><Text style={{ color: theme.neutrals.ink }}>Not yet available</Text></Card>
            <Card error><Text style={{ color: theme.neutrals.ink }}>Sync failed — tap to retry</Text></Card>
          </View>
          <SubLabel>List row — default / with badge / disabled</SubLabel>
          <View style={{ backgroundColor: theme.neutrals.surface, borderRadius: theme.radii.md, overflow: 'hidden' }}>
            <ListRow title="Jollof rice, 1 ladle" subtitle="Breakfast · 320 kcal" leadingIcon="restaurant-outline" showChevron onPress={() => {}} />
            <ListRow title="Sync pending" subtitle="3 entries queued" leadingIcon="cloud-upload-outline" badge={{ color: theme.semantic.error, icon: 'alert', label: 'error' }} onPress={() => {}} />
            <ListRow title="Barcode scan (not in v1)" leadingIcon="barcode-outline" disabled />
          </View>
        </Section>

        {/* ---------------- Navigation ---------------- */}
        <Section title="Navigation" onLayout={(y) => (sectionOffsets.current['Navigation'] = y)}>
          <SubLabel>Tab bar (5 tabs, active state, error badge)</SubLabel>
          <View style={{ borderRadius: theme.radii.md, overflow: 'hidden' }}>
            <TabBar
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: 'home', label: 'Home', icon: 'home-outline' },
                { key: 'nutrition', label: 'Nutrition', icon: 'nutrition-outline' },
                { key: 'workout', label: 'Workout', icon: 'body-outline' },
                { key: 'progress', label: 'Progress', icon: 'trending-up-outline', hasErrorBadge: true },
                { key: 'profile', label: 'Profile', icon: 'person-outline' },
              ]}
            />
          </View>
        </Section>

        {/* ---------------- Sheets ---------------- */}
        <Section title="Sheets" onLayout={(y) => (sectionOffsets.current['Sheets'] = y)}>
          <SubLabel>Bottom sheet (tap to open, includes inline error banner demo)</SubLabel>
          <Button label="Open Add Entry sheet" variant="secondary" onPress={() => setSheetOpen(true)} />
          <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title="Add entry" errorMessage="Couldn't load recent items — showing cached data">
            <SegmentedControl
              options={[
                { value: 'search', label: 'Search' },
                { value: 'recent', label: 'Recent' },
                { value: 'favorites', label: 'Favorites' },
                { value: 'custom', label: 'Custom' },
              ]}
              value={segment}
              onChange={setSegment}
            />
            <View style={{ height: 12 }} />
            <Button label="Done" variant="primary" onPress={() => setSheetOpen(false)} />
          </BottomSheet>
        </Section>

        {/* ---------------- Progress ---------------- */}
        <Section title="Progress" onLayout={(y) => (sectionOffsets.current['Progress'] = y)}>
          <SubLabel>Rings — normal / approaching / exceeded</SubLabel>
          <Row>
            <View style={{ marginRight: 16 }}><ProgressRing progress={0.6} color={macroColors.calories} label="Calories" valueText="1,200" /></View>
            <View style={{ marginRight: 16 }}><ProgressRing progress={0.9} color={macroColors.protein} label="Protein" valueText="90g" status="approaching" /></View>
            <View style={{ marginRight: 16 }}><ProgressRing progress={1.15} color={macroColors.carbs} label="Carbs" valueText="230g" status="exceeded" /></View>
            <ProgressRing progress={0.4} color={macroColors.fat} label="Fat" valueText="40g" />
          </Row>
          <SubLabel>Bars</SubLabel>
          <View style={{ gap: 12 }}>
            <ProgressBar progress={0.3} color={brandColors.terracotta} />
            <ProgressBar progress={0.7} color={brandColors.goldMuted} />
          </View>
          <SubLabel>Status badges (fixed semantic vocabulary)</SubLabel>
          <Row>
            <View style={{ marginRight: 8, marginBottom: 8 }}><StatusBadge tone="success" label="Synced" /></View>
            <View style={{ marginRight: 8, marginBottom: 8 }}><StatusBadge tone="warning" label="Approaching limit" /></View>
            <View style={{ marginRight: 8, marginBottom: 8 }}><StatusBadge tone="error" label="Sync failed" /></View>
            <StatusBadge tone="info" label="Offline — cached data" />
          </Row>
        </Section>

        {/* ---------------- Skill tree ---------------- */}
        <Section title="Skill tree" onLayout={(y) => (sectionOffsets.current['Skill tree'] = y)}>
          <SubLabel>Node states (fixed gamification vocabulary — color + icon + shape, never color alone)</SubLabel>
          <Row>
            {(['locked', 'unlocked', 'inProgress', 'completed', 'mastered'] as NodeState[]).map((s) => (
              <View key={s} style={{ marginRight: 16, marginBottom: 12 }}>
                <SkillNode label={s} state={s} onPress={s === 'locked' ? undefined : () => {}} />
              </View>
            ))}
          </Row>
          <SubLabel>Milestone ("boss") node + sync-warning overlay</SubLabel>
          <Row>
            <View style={{ marginRight: 16 }}><SkillNode label="Full planche" state="mastered" milestone onPress={() => {}} /></View>
            <SkillNode label="L-sit hold" state="inProgress" syncWarning onPress={() => {}} />
          </Row>
          <SubLabel>Node-state badges (inline, e.g. Node Detail)</SubLabel>
          <Row>
            {(['locked', 'unlocked', 'inProgress', 'completed', 'mastered'] as NodeState[]).map((s) => (
              <View key={s} style={{ marginRight: 8, marginBottom: 8 }}>
                <NodeStateBadge state={s} />
              </View>
            ))}
          </Row>
        </Section>

        {/* ---------------- Session player ---------------- */}
        <Section title="Session player" onLayout={(y) => (sectionOffsets.current['Session player'] = y)}>
          <SubLabel>Calisthenics preset — dark, high-contrast, achievement-driven</SubLabel>
          <SegmentedControl
            options={[
              { value: 'active', label: 'Active' },
              { value: 'rest', label: 'Rest' },
              { value: 'complete', label: 'Complete' },
            ]}
            value={calisthenicsPhase}
            onChange={(v) => setCalisthenicsPhase(v as SessionPlayerPhase)}
          />
          <View style={{ height: 420, borderRadius: theme.radii.md, overflow: 'hidden', marginTop: 8 }}>
            <SessionPlayer
              preset="calisthenics"
              phase={calisthenicsPhase}
              timerLabel={calisthenicsPhase === 'rest' ? '00:45' : '8'}
              subLabel="Handstand push-up progression"
              onPrimaryAction={() => {}}
              onSkipRest={() => {}}
              onAddTime={() => {}}
              summary={{
                headline: 'Session complete',
                detail: '3 sets · 24 reps · new hold PR',
                unlockedNode: { label: 'Handstand push-up unlocked', state: 'unlocked' },
              }}
            />
          </View>

          <SubLabel>Pilates preset — light, calm, audio-led</SubLabel>
          <SegmentedControl
            options={[
              { value: 'active', label: 'Active' },
              { value: 'complete', label: 'Complete' },
            ]}
            value={pilatesPhase === 'rest' ? 'active' : pilatesPhase}
            onChange={(v) => setPilatesPhase(v as SessionPlayerPhase)}
          />
          <View style={{ height: 420, borderRadius: theme.radii.md, overflow: 'hidden', marginTop: 8, borderWidth: 1, borderColor: theme.neutrals.border }}>
            <SessionPlayer
              preset="pilates"
              phase={pilatesPhase}
              timerLabel="00:32"
              subLabel="Roll-up"
              progress={0.55}
              autoAdvance
              onPrimaryAction={() => {}}
              onToggleAutoAdvance={() => {}}
              summary={{
                headline: 'Session complete — 12 minutes moved',
                detail: 'Held your plank 15s longer than last time',
                unlockedNode: { label: 'Plank hold: 60s milestone', state: 'completed' },
              }}
            />
          </View>
        </Section>

        {/* ---------------- Calendar & trends ---------------- */}
        <Section title="Calendar & trends" onLayout={(y) => (sectionOffsets.current['Calendar & trends'] = y)}>
          <SubLabel>Calendar / date picker</SubLabel>
          <CalendarDatePicker
            month={calMonth}
            selectedDate={calSelected}
            markedDates={new Set(['2026-07-01', '2026-07-03', '2026-07-08'])}
            onSelectDay={setCalSelected}
            onChangeMonth={setCalMonth}
          />
          <SubLabel>Trend chart (2+ points) / empty state (fewer than 2 points)</SubLabel>
          <TrendChart
            points={[
              { label: 'Mon', value: 82.1 },
              { label: 'Tue', value: 81.8 },
              { label: 'Wed', value: 81.9 },
              { label: 'Thu', value: 81.5 },
              { label: 'Fri', value: 81.2 },
            ]}
            color={theme.brand.deepGreen}
            unit="kg"
          />
          <View style={{ height: 12 }} />
          <TrendChart points={[{ label: 'Mon', value: 10 }]} color={theme.brand.deepGreen} />
        </Section>
      </ScrollView>
    </View>
  );
}
