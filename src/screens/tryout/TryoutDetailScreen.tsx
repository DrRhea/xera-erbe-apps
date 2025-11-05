import React, { FC, useCallback, useMemo } from 'react';
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
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import ClockIcon from '../../../assets/icons/clock.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

type Subtest = {
  id: string;
  title: string;
  durationMinutes: number;
};

type TryoutDetail = {
  title: string;
  subtests: Subtest[];
};

const tryoutDetails: Record<string, TryoutDetail> = {
  'to-tka-smp-5': {
    title: 'TO TKA SMP #5',
    subtests: [
      { id: 'math', title: 'TKA Matematika', durationMinutes: 30 },
      { id: 'literasi', title: 'TKA Literasi Indonesia', durationMinutes: 30 },
    ],
  },
  'to-tka-sma-6': {
    title: 'TO TKA SMA #6',
    subtests: [
      { id: 'math', title: 'TKA Matematika', durationMinutes: 35 },
      { id: 'science', title: 'TKA Sains Terapan', durationMinutes: 35 },
    ],
  },
  'to-snbt-2': {
    title: 'TO SNBT #2',
    subtests: [
      { id: 'penalaran', title: 'Penalaran Umum', durationMinutes: 30 },
      { id: 'kognitif', title: 'Kemampuan Kognitif', durationMinutes: 30 },
    ],
  },
  'to-11-sma-2': {
    title: 'TO 11 SMA #2',
    subtests: [
      { id: 'literasi', title: 'Literasi Membaca', durationMinutes: 25 },
      { id: 'numerasi', title: 'Literasi Numerasi', durationMinutes: 25 },
    ],
  },
};

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const minutesLabel = (minutes: number) => `${minutes} menit`;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TryoutDetailScreen: FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TryoutDetail'>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();

  const { tryoutId, title } = route.params;

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);
  const detail = useMemo(() => {
    const fallback: TryoutDetail = {
      title,
      subtests: [],
    };
    return tryoutDetails[tryoutId] ?? fallback;
  }, [tryoutId, title]);

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );
  const sectionSpacing = useMemo(() => clamp(layout.sectionSpacing * 0.7, 20, 32), [layout.sectionSpacing]);
  const activeCardPaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.8, 18, 28),
    [layout.horizontalPadding]
  );
  const activeCardPaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding, 18, 28),
    [layout.horizontalPadding]
  );
  const iconWrapperSize = useMemo(() => clamp(layout.horizontalPadding * 2.2, 52, 62), [layout.horizontalPadding]);
  const iconImageSize = useMemo(() => clamp(iconWrapperSize * 0.85, 40, 52), [iconWrapperSize]);
  const subtestCardPadding = useMemo(
    () => clamp(layout.horizontalPadding * 0.85, 18, 26),
    [layout.horizontalPadding]
  );
  const subtestGap = useMemo(() => clamp(layout.horizontalPadding * 0.45, 12, 20), [layout.horizontalPadding]);
  const subtestIconSize = useMemo(() => clamp(iconWrapperSize * 0.85, 44, 56), [iconWrapperSize]);
  const metaGap = useMemo(() => clamp(layout.horizontalPadding * 0.35, 10, 16), [layout.horizontalPadding]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: clamp(layout.sectionSpacing * 3, 96, 160),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
          <AppHeader title="Tryout" contentHorizontalPadding={contentHorizontalPadding} onNotificationPress={handleNotificationPress} />
        </View>

        <View
          style={[
            styles.contentWrapper,
            {
              width: layout.contentWidth,
              paddingHorizontal: contentHorizontalPadding,
              marginTop: clamp(layout.sectionSpacing * 0.4, 18, 28),
              rowGap: sectionSpacing,
              gap: sectionSpacing,
            },
          ]}
        >
          <View
            style={[
              styles.activeCard,
              {
                paddingVertical: activeCardPaddingVertical,
                paddingHorizontal: activeCardPaddingHorizontal,
                columnGap: clamp(layout.horizontalPadding * 0.5, 14, 20),
              },
            ]}
          >
            <View
              style={[
                styles.activeIconWrapper,
                {
                  width: iconWrapperSize,
                  height: iconWrapperSize,
                  borderRadius: clamp(iconWrapperSize * 0.32, 12, 18),
                },
              ]}
            >
              <Image source={tryoutCardImage} style={{ width: iconImageSize, height: iconImageSize }} resizeMode="contain" />
            </View>
            <Text style={styles.activeTitle}>{detail.title}</Text>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Daftar Subtes</Text>
          </View>

          <View style={[styles.subtestList, { rowGap: subtestGap, gap: subtestGap }]}>
            {detail.subtests.length ? (
              detail.subtests.map((subtest) => (
                <Pressable
                  key={subtest.id}
                  style={[
                    styles.subtestCard,
                    {
                      padding: subtestCardPadding,
                      columnGap: subtestGap,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate('TryoutQuestion', {
                      tryoutId,
                      tryoutTitle: detail.title,
                      subtestId: subtest.id,
                      subtestTitle: subtest.title,
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel={`Mulai ${subtest.title}`}
                >
                  <View
                    style={[
                      styles.subtestIconWrapper,
                      {
                        width: subtestIconSize,
                        height: subtestIconSize,
                        borderRadius: clamp(subtestIconSize * 0.18, 10, 16),
                      },
                    ]}
                  >
                    <Image
                      source={tryoutCardImage}
                      style={{ width: subtestIconSize * 0.75, height: subtestIconSize * 0.75 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.subtestContent}>
                    <Text style={styles.subtestTitle}>{subtest.title}</Text>
                    <View style={[styles.subtestMeta, { columnGap: metaGap, gap: metaGap }]}>
                      <ClockIcon width={16} height={16} />
                      <Text style={styles.subtestMetaText}>{minutesLabel(subtest.durationMinutes)}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={styles.emptyStateCopy}>Belum ada subtes yang tersedia untuk tryout ini.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomNavigation
        items={navItems}
        activeKey="home"
        backgroundColor={colors.white}
        activeColor={colors.primary}
        inactiveColor="#617283"
        style={styles.bottomNav}
      />
    </SafeAreaView>
  );
};

export default TryoutDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
  },
  headerWrapper: {
    alignSelf: 'center',
  },
  contentWrapper: {
    alignSelf: 'center',
  },
  activeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  activeIconWrapper: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 14,
  },
  activeTitle: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.white,
  },
  sectionHeaderRow: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
  },
  subtestList: {
    width: '100%',
  },
  subtestCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subtestIconWrapper: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(1, 88, 118, 0.1)',
  },
  subtestContent: {
    flex: 1,
  },
  subtestTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
  },
  subtestMeta: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtestMetaText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: '#3f3f3f',
  },
  emptyStateCopy: {
    marginTop: 8,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
});
