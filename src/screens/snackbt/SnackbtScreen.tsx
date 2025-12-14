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

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const SnackbtScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();
  const [modules, setModules] = useState<SnackbtModule[]>([]);

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

  const handleModulePress = useCallback((module: SnackbtModule) => {
    navigation.navigate('SnackbtDetail', {
      moduleId: module.id,
      moduleTitle: module.title,
    });
  }, [navigation]);

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
          />
        </View>

        <View style={[sharedStyles.contentContainer, { width: layout.contentWidth, gap: sectionSpacing }]}>
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
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                  {module.summary && (
                    <Text style={styles.cardSummary} numberOfLines={2}>
                      {module.summary}
                    </Text>
                  )}
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                      {module.metadata.totalQuestions || 0} Soal
                    </Text>
                  </View>
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
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
