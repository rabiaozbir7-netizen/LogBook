import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import AppNavigation from './src/AppNavigation';

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigation />
    </>
  );
}
