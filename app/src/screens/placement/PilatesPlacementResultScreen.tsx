import React from 'react';
import { PlacementResultBody } from './PlacementResultBody';

/** Pilates Placement — Results → Starting Tier Placement. */
export function PilatesPlacementResultScreen() {
  return <PlacementResultBody trackName="Pilates" startingTier={1} stepsRoute="PilatesPlacementSteps" />;
}
