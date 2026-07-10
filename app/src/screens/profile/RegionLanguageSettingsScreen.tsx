import React, { useState } from 'react';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Text } from '../../components/Typography';
import { Button } from '../../components/Button';
import { SingleSelect } from '../../components/SingleSelect';
import { ToggleSwitch } from '../../components/ToggleSwitch';
import { useAppState } from '../../state/AppStateContext';

/** S5. Region & Language Settings — market, household-unit display preferences. */
export function RegionLanguageSettingsScreen() {
  const { state, dispatch } = useAppState();
  const [market, setMarket] = useState(state.region.market);
  const [includeWestern, setIncludeWestern] = useState(state.region.includeWestern);
  const [units, setUnits] = useState(state.region.units);

  const save = () => dispatch({ type: 'SET_REGION', payload: { market, includeWestern, units } });

  return (
    <ScreenContainer density="compact">
      <Text variant="h1">Region & Language</Text>
      <SingleSelect
        label="Market"
        value={market}
        onChange={(v) => setMarket(v as any)}
        options={[
          { value: 'Nigeria', label: 'Nigeria' },
          { value: 'Ghana', label: 'Ghana' },
          { value: 'Kenya', label: 'Kenya' },
        ]}
      />
      <ToggleSwitch label="Include Western / diaspora foods" value={includeWestern} onChange={setIncludeWestern} />
      <SingleSelect
        label="Units"
        value={units}
        onChange={(v) => setUnits(v as any)}
        options={[
          { value: 'metric', label: 'Metric (kg/cm)' },
          { value: 'imperial', label: 'Imperial (lb/ft)' },
        ]}
      />
      <Button label="Save" onPress={save} />
    </ScreenContainer>
  );
}
