import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/home/HomeScreen';
import TryoutScreen from './src/screens/tryout/TryoutScreen';
import TryoutDetailScreen from './src/screens/tryout/TryoutDetailScreen';
import TryoutDescScreen from './src/screens/tryout/TryoutDescScreen';
import TryoutRegistrationFreeScreen from './src/screens/tryout/TryoutRegistrationFreeScreen';
import TryoutQuestionScreen from './src/screens/tryout/TryoutQuestion';
import PlaceholderScreen from './src/screens/shared/PlaceholderScreen';

export type RootStackParamList = {
  Home: undefined;
  Tryout: undefined;
  TryoutDesc: {
    tryoutId: string;
    title: string;
    dateLabel: string;
    statusLabel: string;
    statusVariant: 'free' | 'paid';
  };
  TryoutRegistrationFree: {
    tryoutId: string;
    title: string;
    dateLabel: string;
  };
  TryoutDetail: {
    tryoutId: string;
    title: string;
  };
  TryoutQuestion: {
    tryoutId: string;
    tryoutTitle: string;
    subtestId: string;
    subtestTitle: string;
  };
  Analysis: undefined;
  Wallet: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F0F0F0',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Tryout" component={TryoutScreen} />
          <Stack.Screen name="TryoutDesc" component={TryoutDescScreen} />
          <Stack.Screen name="TryoutRegistrationFree" component={TryoutRegistrationFreeScreen} />
          <Stack.Screen name="TryoutDetail" component={TryoutDetailScreen} />
          <Stack.Screen name="TryoutQuestion" component={TryoutQuestionScreen} />
          <Stack.Screen
            name="Analysis"
            children={() => <PlaceholderScreen title="Analysis" message="Analysis screen coming soon." />}
          />
          <Stack.Screen
            name="Wallet"
            children={() => <PlaceholderScreen title="Wallet" message="Wallet screen coming soon." />}
          />
          <Stack.Screen
            name="Profile"
            children={() => <PlaceholderScreen title="Profile" message="Profile screen coming soon." />}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
