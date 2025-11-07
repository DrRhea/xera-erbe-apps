import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import HomeScreen from './src/screens/home/HomeScreen';
import TryoutScreen from './src/screens/tryout/TryoutScreen';
import TryoutDetailScreen from './src/screens/tryout/TryoutDetailScreen';
import TryoutDescScreen from './src/screens/tryout/TryoutDescScreen';
import TryoutRegistrationFreeScreen from './src/screens/tryout/TryoutRegistrationFreeScreen';
import TryoutRegistrationPaidScreen from './src/screens/tryout/TryoutRegistrationPaidScreen';
import TryoutQuestionScreen from './src/screens/tryout/TryoutQuestion';
import PlaceholderScreen from './src/screens/shared/PlaceholderScreen';
import DigidawScreen from './src/screens/digidaw/DigidawScreen';
import DigidawCategoriesScreen from './src/screens/digidaw/DigidawCategoriesScreen';
import DigidawCategoriesDetailScreen from './src/screens/digidaw/DigidawCategoriesDetailScreen';
import DigidawQuestionScreen from './src/screens/digidaw/DigidawQuestionScreen';
import MateriScreen from './src/screens/materi/MateriScreen';
import ReportScreen from './src/screens/report/ReportScreen';
import NotificationScreen from './src/screens/notification/NotificationScreen';
import LeaderboardScreen from './src/screens/leaderboard/LeaderboardScreen';
import PromotionScreen from './src/screens/promotion/PromotionScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import MateriCategoriesScreen from './src/screens/materi/MateriCategoriesScreen';
import MateriDetailScreen from './src/screens/materi/MateriDetailScreen';
import SnackbtScreen from './src/screens/snackbt/SnackbtScreen';
import SnackbtDetailScreen from './src/screens/snackbt/SnackbtDetailScreen';
import SnackbtQuestionScreen from './src/screens/snackbt/SnackbtQuestionScreen';
import PokeScreen from './src/screens/poke/PokeScreen';
import PokeDetailScreen from './src/screens/poke/PokeDetailScreen';
import PokeQuestionScreen from './src/screens/poke/PokeQuestionScreen';
import ImEngScreen from './src/screens/imeng/ImEngScreen';
import ImEngQuestionScreen from './src/screens/imeng/ImEngQuestionScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import RegisterScreen from './src/screens/login/RegisterScreen';
import LiterasikScreen from './src/screens/literasik/LiterasikScreen';
import type { CategoryIconKey } from './src/data/digidawData';
import type { MateriIconKey } from './src/data/materiContent';
import type { ExamId } from './src/data/examContent';

type ExamRouteParams = {
  examId: ExamId;
  examTitle: string;
  subjectId: string;
  subjectTitle: string;
};

type ExamQuestionRouteParams = ExamRouteParams & {
  moduleId: string;
  moduleTitle: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Literasik: undefined;
  Materi: undefined;
  MateriCategory: {
    categoryId: string;
    categoryTitle: string;
  };
  MateriDetail: {
    categoryId: string;
    categoryTitle: string;
    subjectId: string;
    subjectTitle: string;
    iconKey: MateriIconKey;
  };
  Tryout: undefined;
  Digidaw: undefined;
  DigidawCategories: {
    categoryId: string;
    categoryTitle: string;
  };
  DigidawCategoryDetail: {
    categoryId: string;
    categoryTitle: string;
    subjectId: string;
    subjectTitle: string;
    iconKey: CategoryIconKey;
  };
  DigidawQuestion: {
    categoryId: string;
    categoryTitle: string;
    subjectId: string;
    subjectTitle: string;
    moduleId: string;
    moduleTitle: string;
  };
  Snackbt: undefined;
  SnackbtDetail: ExamRouteParams;
  SnackbtQuestion: ExamQuestionRouteParams;
  Poke: undefined;
  PokeDetail: ExamRouteParams;
  PokeQuestion: ExamQuestionRouteParams;
  ImEng: undefined;
  ImEngQuestion: ExamQuestionRouteParams;
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
  TryoutRegistrationPaid: {
    tryoutId: string;
    title: string;
    dateLabel: string;
    priceLabel: string;
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
  Report: undefined;
  Leaderboard: undefined;
  Promotion: undefined;
  Notification: undefined;
  Search: undefined;
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
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => null);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Literasik" component={LiterasikScreen} />
          <Stack.Screen name="Materi" component={MateriScreen} />
          <Stack.Screen name="MateriCategory" component={MateriCategoriesScreen} />
          <Stack.Screen name="MateriDetail" component={MateriDetailScreen} />
          <Stack.Screen name="Tryout" component={TryoutScreen} />
          <Stack.Screen name="Digidaw" component={DigidawScreen} />
          <Stack.Screen name="DigidawCategories" component={DigidawCategoriesScreen} />
          <Stack.Screen name="DigidawCategoryDetail" component={DigidawCategoriesDetailScreen} />
          <Stack.Screen name="DigidawQuestion" component={DigidawQuestionScreen} />
          <Stack.Screen name="Snackbt" component={SnackbtScreen} />
          <Stack.Screen name="SnackbtDetail" component={SnackbtDetailScreen} />
          <Stack.Screen name="SnackbtQuestion" component={SnackbtQuestionScreen} />
          <Stack.Screen name="Poke" component={PokeScreen} />
          <Stack.Screen name="PokeDetail" component={PokeDetailScreen} />
          <Stack.Screen name="PokeQuestion" component={PokeQuestionScreen} />
          <Stack.Screen name="ImEng" component={ImEngScreen} />
          <Stack.Screen name="ImEngQuestion" component={ImEngQuestionScreen} />
          <Stack.Screen name="TryoutDesc" component={TryoutDescScreen} />
          <Stack.Screen name="TryoutRegistrationFree" component={TryoutRegistrationFreeScreen} />
          <Stack.Screen name="TryoutRegistrationPaid" component={TryoutRegistrationPaidScreen} />
          <Stack.Screen name="TryoutDetail" component={TryoutDetailScreen} />
          <Stack.Screen name="TryoutQuestion" component={TryoutQuestionScreen} />
          <Stack.Screen
            name="Analysis"
            children={() => <PlaceholderScreen title="Analysis" message="Analysis screen coming soon." />}
          />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Promotion" component={PromotionScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
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
