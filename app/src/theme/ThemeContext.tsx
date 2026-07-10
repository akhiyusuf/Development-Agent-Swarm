import React, { createContext, useContext, useMemo, useState } from 'react';
import { ColorTheme, surfaces } from './tokens';

interface ThemeContextValue {
  mode: ColorTheme;
  setMode: (m: ColorTheme) => void;
  surfaces: ReturnType<typeof surfaces>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * App-wide light/dark preference (design-system §1.5: light is default everywhere
 * except the calisthenics session player, which is always dark regardless of this
 * setting — see components/SkillNode and the node-map screens, which force dark
 * mode locally per carry-forward #7, independent of this app-wide preference).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorTheme>('light');
  const value = useMemo(() => ({ mode, setMode, surfaces: surfaces(mode) }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}
