import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, SingleSelectChips, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen, Section } from '../../ui/layout';

/**
 * Region & Language Settings (S5) — market + household-unit display prefs (Req 1).
 *
 * DATA CONTRACT: `{ market, showGrams, language }`. Save applies immediately to
 * food-database defaults + household-unit display app-wide. Display-preference
 * changes are FORWARD-ONLY for already-logged entries (E5 / §G #12).
 */
export function RegionLanguageSettingsScreen() {
  const theme = useTheme();
  const [market, setMarket] = useState<string | null>('Nigeria');
  const [showGrams, setShowGrams] = useState(true);
  const [language, setLanguage] = useState<string | null>('en');

  return (
    <Screen>
      <Section title="Market">
        <Card>
          <SingleSelectChips
            value={market}
            onChange={setMarket}
            options={[
              { value: 'Nigeria', label: 'Nigeria' },
              { value: 'Ghana', label: 'Ghana' },
              { value: 'Kenya', label: 'Kenya' },
            ]}
          />
        </Card>
      </Section>

      <Section title="Household units">
        <Card>
          <ToggleSwitch label="Show gram equivalents next to units" value={showGrams} onChange={setShowGrams} />
          <AppText variant="caption" color={theme.neutrals.charcoal}>
            Applies to new logging going forward; past entries keep their original display.
          </AppText>
        </Card>
      </Section>

      <Section title="Language">
        <Card>
          <SingleSelectChips
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Kiswahili' },
              { value: 'fr', label: 'Français' },
            ]}
          />
        </Card>
      </Section>

      <Button label="Save" onPress={() => { /* app-builder applies */ }} />
    </Screen>
  );
}
