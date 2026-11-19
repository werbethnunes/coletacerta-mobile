import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Define a navegação em pilha (Stack) e o cabeçalho de todas as telas.
export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1B5E20' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'ColetaCerta' }} />
        <Stack.Screen name="solicitar" options={{ title: 'Solicitar coleta' }} />
        <Stack.Screen name="solicitacoes" options={{ title: 'Minhas solicitações' }} />
      </Stack>
    </>
  );
}
