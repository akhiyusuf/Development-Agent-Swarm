import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, darkTheme, lightTheme } from './tokens';

type ThemeContextValue = {
  theme: Theme;
  /** Explicit override for previewing both modes regardless of OS setting (gallery use). */
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');

  const resolvedMode = mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  const value = useMemo(() => ({ theme, mode, setMode }), [theme, mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx.theme;
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return ctx;
}
