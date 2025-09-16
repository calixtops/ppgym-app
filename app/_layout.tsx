import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProgramSelection } from '@/hooks/useProgramSelection';
import { ProgramSelectionScreen } from '../components/ProgramSelectionScreen';
import SplashScreen from '../components/SplashScreen';
import { WorkoutProvider } from '../hooks/WorkoutContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const { selectedProgram, loading, selectProgram } = useProgramSelection();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleProgramSelect = async (program: 'pedro' | 'georgia') => {
    await selectProgram(program);
  };

  // Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Loading program selection
  if (loading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  // Program selection screen
  if (!selectedProgram) {
    return <ProgramSelectionScreen onSelectProgram={handleProgramSelect} />;
  }

  return (
    <WorkoutProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="workout-detail" options={{ headerShown: false }} />
          <Stack.Screen name="test-workout" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </WorkoutProvider>
  );
}
