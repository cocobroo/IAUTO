import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { VehicleProvider } from '../contexts/VehicleContext';

export default function RootLayout() {
  return (
    <VehicleProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </VehicleProvider>
  );
}
