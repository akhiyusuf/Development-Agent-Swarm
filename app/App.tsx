import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Theme provider comes from the design-system package BY NAME — never
// re-implemented in the app. app-builder wires the real data/state layer on top.
import { ThemeProvider } from '@fit-and-fed/design-system';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppStateProvider } from './src/state/AppStateContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppStateProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </AppStateProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
