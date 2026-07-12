import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, SingleSelectChips, ToggleSwitch, useTheme } from '@fit-and-fed/design-system';
import { AppText, Screen } from '../../ui/layout';
import { OnboardingProgress } from '../../components/OnboardingProgress';
import { PreAuthLoginLink } from '../../components/PreAuthLoginLink';

/**
 * Region & Cuisine Preference — v1 market + optional Western/diaspora food set.
 *
 * DATA CONTRACT: commits `{ market: 'Nigeria'|'Ghana'|'Kenya'; diaspora: boolean }`
 * to the draft; drives the food-database defaults and household-unit display
 * app-wide (E5). [CP-VALIDATION]: a market must be selected before Continue.
 */
export function RegionPreferenceScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [market, setMarket] = useState<string | null>('Nigeria');
  const [diaspora, setDiaspora] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <Screen>
      <OnboardingProgress step={3} total={5} />
      <AppText variant="h1">Your food region</AppText>
      <AppText variant="caption" color={theme.neutrals.charcoal}>
        This sets which regional food database and household-unit portions you see by default.
      </AppText>

      <Card>
        <SingleSelectChips
          accessibilityLabel="Market"
          value={market}
          onChange={setMarket}
          options={[
            { value: 'Nigeria', label: 'Nigeria' },
            { value: 'Ghana', label: 'Ghana' },
            { value: 'Kenya', label: 'Kenya' },
          ]}
          error={touched && !market}
          errorMessage="Select a market"
        />
      </Card>

      <Card>
        <ToggleSwitch
          label="Also include Western / diaspora foods"
          value={diaspora}
          onChange={setDiaspora}
        />
        <AppText variant="caption" color={theme.neutrals.charcoal}>
          Adds staples like rice, eggs, oats and peanut butter for dual-cuisine tracking.
        </AppText>
      </Card>

      <Button
        label="Continue"
        onPress={() => {
          setTouched(true);
          if (market) navigation.navigate('ModuleInterest');
        }}
      />
      <PreAuthLoginLink />
    </Screen>
  );
}
