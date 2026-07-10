import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { AppStateProvider } from './src/state/AppStateContext';
import { RootNavigator } from './src/navigation/RootNavigator';

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
