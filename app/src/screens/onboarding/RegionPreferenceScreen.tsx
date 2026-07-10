import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { SingleSelect } from '../../components/SingleSelect';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { ProgressBar } from '../../components/ProgressBar';
import { color } from '../../theme/tokens';
import { useAppState } from '../../state/AppStateContext';

/** A5. Region & Cuisine Preference — Nigeria/Ghana/Kenya + optional Western/diaspora set. */
export function RegionPreferenceScreen() {
  const nav = useNavigation<any>();
  const { state, dispatch } = useAppState();
  const [market, setMarket] = useState(state.region.market);
  const [includeWestern, setIncludeWestern] = useState(state.region.includeWestern);

  const onContinue = () => {
    dispatch({ type: 'SET_REGION', payload: { market, includeWestern } });
    nav.navigate('ModuleInterest');
  };

  return (
    <ScreenContainer density="relaxed">
      <ProgressBar progress={4 / 8} label="Step 4 of 8" />
      <Text variant="h1">Where do you eat from?</Text>
      <Text variant="caption" colorToken={color.neutral.warmgray700}>
        This drives the food database and household-unit defaults you'll see when logging meals.
      </Text>
      <SingleSelect
        label="Primary market"
        value={market}
        onChange={(v) => setMarket(v as any)}
        options={[
          { value: 'Nigeria', label: 'Nigeria' },
          { value: 'Ghana', label: 'Ghana' },
          { value: 'Kenya', label: 'Kenya' },
        ]}
      />
      <ToggleSwitch
        label="Also include Western / diaspora foods"
        value={includeWestern}
        onChange={setIncludeWestern}
      />
      <Button label="Continue" onPress={onContinue} />
      <Button label="Back" variant="tertiary" onPress={() => nav.goBack()} />
    </ScreenContainer>
  );
}
