import React from 'react';
import { PlacementResultBody } from './PlacementResultBody';

/** Calisthenics Placement — Results → Starting Tier Placement. */
export function CalisthenicsPlacementResultScreen() {
  return <PlacementResultBody trackName="Calisthenics" startingTier={2} stepsRoute="CalisthenicsPlacementSteps" />;
}
