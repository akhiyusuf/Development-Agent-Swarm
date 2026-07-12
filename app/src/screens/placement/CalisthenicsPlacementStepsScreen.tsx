import React from 'react';
import { PlacementStepsBody } from './PlacementStepsBody';

/** Calisthenics Placement — Steps (generic push/pull/squat-hinge/core-hold checks). */
export function CalisthenicsPlacementStepsScreen() {
  return (
    <PlacementStepsBody
      title="Calisthenics"
      resultRoute="CalisthenicsPlacementResult"
      track="calisthenics"
      steps={[
        { key: 'push', title: 'Push pattern', prompt: 'How do push-up-style movements feel for you right now?' },
        { key: 'pull', title: 'Pull pattern', prompt: 'How do pulling movements (rows / pull-ups) feel?' },
        { key: 'squat', title: 'Squat / hinge pattern', prompt: 'How do squats and hinges feel through a full range?' },
        { key: 'core', title: 'Core hold', prompt: 'How does holding a braced core position feel?' },
      ]}
    />
  );
}
