import React from 'react';
import { PlacementStepsBody } from './PlacementStepsBody';

/** Pilates Placement — Steps (generic, parallel to but distinct from calisthenics). */
export function PilatesPlacementStepsScreen() {
  return (
    <PlacementStepsBody
      title="Pilates"
      resultRoute="PilatesPlacementResult"
      steps={[
        { key: 'breath', title: 'Core / breath control', prompt: 'How controlled is your breath-with-movement coordination?' },
        { key: 'mobility', title: 'Mobility', prompt: 'How does controlled spinal and hip mobility feel?' },
        { key: 'mat', title: 'Mat-position tolerance', prompt: 'How comfortable are sustained mat positions?' },
      ]}
    />
  );
}
