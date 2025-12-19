import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { snackbtService, type SnackbtModule } from '../../services/snackbtService';

const snackbtIcon = require('../../../assets/images/snackbt.png');

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'leaderboard', label: 'Leaderboard', Icon: TagIcon, routeName: 'Leaderboard' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const SnackbtScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();
  const [modules, setModules] = useState<SnackbtModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await snackbtService.getAllModules();
        setModules(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchModules();
  }, []);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleModulePress = useCallback(async (module: SnackbtModule) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const session = await snackbtService.startSession(module.id);
      navigation.navigate('SnackbtQuestion', {
        moduleId: module.id,
        moduleTitle: module.title,
        session,
      });
    } catch (e) {
      console.error('Failed to start session', e);
      // Ideally show an alert here
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );
  const sectionSpacing = useMemo(
    () => clamp(layout.sectionSpacing * 0.6, 18, 26),
    [layout.sectionSpacing]
  );
  const cardGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 10, 16),
    [layout.horizontalPadding]
  );

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={sharedStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
          <AppHeader
            title="SnackBT"
            onNotificationPress={handleNotificationPress}
            contentHorizontalPadding={contentHorizontalPadding}
          />
        </View>

        <View style={[
          sharedStyles.contentContainer, 
          { 
            width: layout.contentWidth, 
            gap: sectionSpacing,
            paddingHorizontal: contentHorizontalPadding,
            marginTop: sectionSpacing,
          }
        ]}>
          <View style={{ gap: cardGap }}>
            {modules.map((module) => (
              <Pressable
                key={module.id}
                style={({ pressed }) => [
                  styles.card,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
                onPress={() => handleModulePress(module)}
              >
                <Image source={snackbtIcon} style={styles.cardIcon} resizeMode="contain" />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNavigation activeKey="home" items={navItems} />
    </SafeAreaView>
  );
};

const sharedStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    alignSelf: 'center',
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 60,
    height: 60,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: '#004D40', // Dark teal color from screenshot
    lineHeight: 20,
  },
  cardSummary: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.primary,
  },
});

export default SnackbtScreen;
