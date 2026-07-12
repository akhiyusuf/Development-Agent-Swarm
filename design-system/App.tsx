import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { ComponentGallery } from './src/ComponentGallery';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ComponentGallery />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
