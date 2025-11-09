import React, { FC, useCallback, useMemo, useState } from 'react';
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';

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
import {
  DEFAULT_SUBTEST_DURATION_MINUTES,
  resolveTryoutDefinition,
  type TryoutSubtest,
} from '../../data/tryoutContent';
import { getCompletedSubtests } from '../../data/tryoutProgress';

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const minutesLabel = (minutes: number) => `${minutes} menit`;

type TryoutDetailRouteProp = RouteProp<RootStackParamList, 'TryoutDetail'>;

type TryoutDetailNavigationProp = NavigationProp<RootStackParamList>;

const TryoutDetailScreen: FC = () => {
  const route = useRoute<TryoutDetailRouteProp>();
  const navigation = useNavigation<TryoutDetailNavigationProp>();
  const layout = useResponsiveLayout();

  const { tryoutId, title } = route.params;

  const detail = useMemo(() => resolveTryoutDefinition(tryoutId, title), [tryoutId, title]);

  const [completedSubtests, setCompletedSubtests] = useState<string[]>(() =>
    getCompletedSubtests(tryoutId)
  );

  useFocusEffect(
    useCallback(() => {
      setCompletedSubtests(getCompletedSubtests(tryoutId));
    }, [tryoutId])
  );

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleStartSubtest = useCallback(
    (subtest: TryoutSubtest) => {
      if (completedSubtests.includes(subtest.id)) {
        return;
      }

      navigation.navigate('TryoutQuestion', {
        tryoutId: detail.id,
        tryoutTitle: detail.title,
        subtestId: subtest.id,
        subtestTitle: subtest.title,
      });
    },
    [completedSubtests, detail.id, detail.title, navigation]
  );

  const completedCount = completedSubtests.length;
  const totalSubtests = detail.subtests.length;
  const totalDurationMinutes = useMemo(
    () =>
      detail.subtests.reduce(
        (accumulator, subtest) =>
          accumulator + (subtest.durationMinutes ?? DEFAULT_SUBTEST_DURATION_MINUTES),
        0
      ),
    [detail.subtests]
  );

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );

  const sectionSpacing = useMemo(
    () => clamp(layout.sectionSpacing * 0.7, 20, 32),
    [layout.sectionSpacing]
  );

  const heroGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.5, 14, 22),
    [layout.horizontalPadding]
  );

  const heroPaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.8, 18, 28),
    [layout.horizontalPadding]
  );

  const heroPaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding, 18, 28),
    [layout.horizontalPadding]
  );

  const iconWrapperSize = useMemo(
    () => clamp(layout.horizontalPadding * 2.2, 52, 62),
    [layout.horizontalPadding]
  );

  const iconImageSize = useMemo(
    () => clamp(iconWrapperSize * 0.85, 40, 52),
    [iconWrapperSize]
  );

  const subtestCardPadding = useMemo(
    () => clamp(layout.horizontalPadding * 0.85, 18, 26),
    [layout.horizontalPadding]
  );

  const subtestGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 12, 20),
    [layout.horizontalPadding]
  );

  const subtestIconSize = useMemo(
    () => clamp(iconWrapperSize * 0.85, 44, 56),
    [iconWrapperSize]
  );

  const metaGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.35, 10, 16),
    [layout.horizontalPadding]
  );

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
          <AppHeader
            title="Tryout"
            contentHorizontalPadding={contentHorizontalPadding}
            onNotificationPress={handleNotificationPress}
          />
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
              styles.heroCard,
              {
                paddingVertical: heroPaddingVertical,
                paddingHorizontal: heroPaddingHorizontal,
                columnGap: heroGap,
                gap: heroGap,
              },
            ]}
          >
            <View
              style={[
                styles.heroIconWrapper,
                {
                  width: iconWrapperSize,
                  height: iconWrapperSize,
                  borderRadius: clamp(iconWrapperSize * 0.32, 12, 18),
                },
              ]}
            >
              <Image
                source={tryoutCardImage}
                style={{ width: iconImageSize, height: iconImageSize }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{detail.title}</Text>
              <View style={[styles.heroMetaRow, { columnGap: metaGap, gap: metaGap }]}>
                <Text style={styles.heroMetaText}>{`${completedCount}/${totalSubtests} selesai`}</Text>
                <View style={styles.metaDivider} />
                <Text style={styles.heroMetaText}>{`${totalSubtests} subtes`}</Text>
              </View>
              <View style={[styles.heroMetaRow, { columnGap: metaGap, gap: metaGap }]}>
                <ClockIcon width={16} height={16} />
                <Text style={styles.heroMetaText}>{minutesLabel(totalDurationMinutes)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Daftar Subtes</Text>
          </View>

          <View style={[styles.subtestList, { rowGap: subtestGap, gap: subtestGap }]}>
            {detail.subtests.length ? (
              detail.subtests.map((subtest) => {
                const isCompleted = completedSubtests.includes(subtest.id);
                const durationMinutes = subtest.durationMinutes ?? DEFAULT_SUBTEST_DURATION_MINUTES;

                return (
                  <Pressable
                    key={subtest.id}
                    style={[
                      styles.subtestCard,
                      {
                        padding: subtestCardPadding,
                        columnGap: subtestGap,
                        gap: subtestGap,
                      },
                      isCompleted && styles.subtestCardCompleted,
                    ]}
                    onPress={() => handleStartSubtest(subtest)}
                    disabled={isCompleted}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isCompleted }}
                    accessibilityLabel={
                      isCompleted
                        ? `${subtest.title} sudah selesai`
                        : `Mulai ${subtest.title}`
                    }
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
                      <View style={styles.subtestHeaderRow}>
                        <Text style={styles.subtestTitle}>{subtest.title}</Text>
                        {isCompleted ? (
                          <View style={styles.subtestStatusBadge}>
                            <Text style={styles.subtestStatusText}>Selesai</Text>
                          </View>
                        ) : null}
                      </View>
                      <View style={[styles.subtestMeta, { columnGap: metaGap, gap: metaGap }]}>
                        <ClockIcon width={16} height={16} />
                        <Text style={styles.subtestMetaText}>{minutesLabel(durationMinutes)}</Text>
                        {typeof subtest.questionCount === 'number' ? (
                          <Text style={styles.subtestMetaText}>{`${subtest.questionCount} soal`}</Text>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <Text style={styles.emptyStateCopy}>
                Belum ada subtes yang tersedia untuk tryout ini.
              </Text>
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
  heroCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  heroIconWrapper: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 14,
  },
  heroContent: {
    flex: 1,
    rowGap: 10,
    gap: 10,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.white,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroMetaText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.white,
  },
  metaDivider: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
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
  subtestCardCompleted: {
    opacity: 0.6,
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
    rowGap: 8,
    gap: 8,
  },
  subtestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtestTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
    flex: 1,
  },
  subtestStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.success,
    marginLeft: 12,
  },
  subtestStatusText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.white,
  },
  subtestMeta: {
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
