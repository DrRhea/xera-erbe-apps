import React, { FC, useCallback } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies, gradients, radii, spacing } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';

import { getLeaderboardData, type LeaderboardEntry } from '../../data/leaderboardData';

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const leaderboardData: LeaderboardEntry[] = getLeaderboardData();

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Reuse responsive helper (keperluan sizing)
const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, 440);
  const horizontalPadding = Math.max((width - contentWidth) / 2 + spacing.xxl, spacing.xxl);
  const sectionSpacing = Math.max(spacing.xxl * 1.5, 24);

  // Header dimensions
  const headerHeight = 200;
  const headerPaddingVertical = Math.max(spacing.xxl, 20);
  const headerPaddingHorizontal = horizontalPadding;

  // Top 3 podium dimensions
  const podiumHeight = Math.max(headerHeight * 0.6, 120);
  const podiumWidth = Math.max(contentWidth * 0.25, 80);
  const podiumSpacing = Math.max(contentWidth * 0.05, 10);

  // Avatar dimensions
  const avatarSize = Math.max(podiumWidth * 0.6, 50);
  const avatarBorderWidth = Math.max(avatarSize * 0.08, 3);

  // Badge dimensions
  const badgeSize = Math.max(podiumWidth * 0.25, 20);

  // List item dimensions
  const listItemHeight = Math.max(spacing.xxl * 1.8, 60);
  const listItemPaddingHorizontal = Math.max(horizontalPadding * 0.8, 16);
  const listItemPaddingVertical = Math.max(spacing.lg, 12);
  const listAvatarSize = Math.max(listItemHeight * 0.6, 40);
  const listAvatarBorderWidth = Math.max(listAvatarSize * 0.06, 2);

  // Rank badge dimensions
  const rankBadgeSize = Math.max(listItemHeight * 0.4, 24);
  const rankBadgeBorderRadius = rankBadgeSize * 0.5;

  return {
    screenWidth: width,
    contentWidth,
    horizontalPadding,
    sectionSpacing,
    headerHeight,
    headerPaddingVertical,
    headerPaddingHorizontal,
    podiumHeight,
    podiumWidth,
    podiumSpacing,
    avatarSize,
    avatarBorderWidth,
    badgeSize,
    listItemHeight,
    listItemPaddingHorizontal,
    listItemPaddingVertical,
    listAvatarSize,
    listAvatarBorderWidth,
    rankBadgeSize,
    rankBadgeBorderRadius,
  };
};

const leaderboardGradients = gradients.leaderboard;

// ===== Podium components copied from HomeScreen (First / Second / Third) =====
const FirstPlaceColumn: FC<LeaderboardEntry & { layout: ReturnType<typeof useResponsiveLayout> }> = ({
  name,
  grade,
  score,
  avatar,
  Badge,
  scoreColor,
  layout,
}) => (
  <View style={styles.podiumColumn}>
    <LinearGradient
      colors={[...leaderboardGradients[1]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientFirst]}
    >
      <View style={styles.leaderboardMedal}>
        {Badge && <Badge width={68} height={75} />}
        <Image source={avatar} style={styles.leaderboardAvatar} resizeMode="contain" />
        <View style={styles.leaderboardRankBadgeFirst}>
          <Text style={styles.leaderboardRankText}>1</Text>
        </View>
      </View>
      <View style={styles.leaderboardMeta}>
        <Text style={styles.leaderboardName}>{name}</Text>
        <Text style={styles.leaderboardGrade}>{grade}</Text>
        <Text style={[styles.leaderboardScore, { color: scoreColor }]}>{score}</Text>
      </View>
    </LinearGradient>
  </View>
);

const SecondPlaceColumn: FC<LeaderboardEntry & { layout: ReturnType<typeof useResponsiveLayout> }> = ({
  name,
  grade,
  score,
  avatar,
  Badge,
  scoreColor,
  layout,
}) => (
  <View style={styles.podiumColumn}>
    <LinearGradient
      colors={[...leaderboardGradients[2]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientSecond]}
    >
      <View style={styles.leaderboardMedal}>
        {Badge && <Badge width={68} height={75} />}
        <Image source={avatar} style={styles.leaderboardAvatar} resizeMode="contain" />
        <View style={styles.leaderboardRankBadgeSecond}>
          <Text style={styles.leaderboardRankText}>2</Text>
        </View>
      </View>
      <View style={styles.leaderboardMeta}>
        <Text style={styles.leaderboardName}>{name}</Text>
        <Text style={styles.leaderboardGrade}>{grade}</Text>
        <Text style={[styles.leaderboardScore, { color: scoreColor }]}>{score}</Text>
      </View>
    </LinearGradient>
  </View>
);

const ThirdPlaceColumn: FC<LeaderboardEntry & { layout: ReturnType<typeof useResponsiveLayout> }> = ({
  name,
  grade,
  score,
  avatar,
  Badge,
  scoreColor,
  layout,
}) => (
  <View style={styles.podiumColumn}>
    <LinearGradient
      colors={[...leaderboardGradients[3]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientThird]}
    >
      <View style={styles.leaderboardMedal}>
        {Badge && <Badge width={68} height={75} />}
        <Image source={avatar} style={styles.leaderboardAvatar} resizeMode="contain" />
        <View style={styles.leaderboardRankBadgeThird}>
          <Text style={styles.leaderboardRankText}>3</Text>
        </View>
      </View>
      <View style={styles.leaderboardMeta}>
        <Text style={styles.leaderboardName}>{name}</Text>
        <Text style={styles.leaderboardGrade}>{grade}</Text>
        <Text style={[styles.leaderboardScore, { color: scoreColor }]}>{score}</Text>
      </View>
    </LinearGradient>
  </View>
);
// =========================================================================

const LeaderboardListItem: FC<LeaderboardEntry & { layout: ReturnType<typeof useResponsiveLayout> }> = ({
  rank,
  name,
  grade,
  score,
  avatar,
  scoreColor,
  isCurrentUser,
  layout,
}) => {
  return (
    <View
      style={[
        styles.listItem,
        {
          height: layout.listItemHeight,
          paddingHorizontal: layout.listItemPaddingHorizontal,
          paddingVertical: layout.listItemPaddingVertical,
          backgroundColor: isCurrentUser ? '#FFAE6C' : colors.white, 
        },
      ]}
    >
      <View
        style={[
          styles.rankBadge,
          {
            width: layout.rankBadgeSize,
            height: layout.rankBadgeSize,
            borderRadius: layout.rankBadgeBorderRadius,
            backgroundColor: rank <= 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][rank - 1] : '#E0E0E0',
          },
        ]}
      >
        <Text
          style={[
            styles.rankBadgeText,
            {
              fontSize: clamp(layout.rankBadgeSize * 0.6, 10, 14),
              color: rank <= 3 ? colors.white : colors.primaryDark,
            },
          ]}
        >
          {rank}
        </Text>
      </View>

      <View
        style={[
          styles.listAvatarContainer,
          {
            width: layout.listAvatarSize,
            height: layout.listAvatarSize,
            borderWidth: layout.listAvatarBorderWidth,
            borderColor: isCurrentUser ? colors.primary : '#E0E0E0',
            borderRadius: layout.listAvatarSize * 0.5,
          },
        ]}
      >
        <Image
          source={avatar}
          style={[
            styles.listAvatar,
            {
              width: layout.listAvatarSize - layout.listAvatarBorderWidth * 2,
              height: layout.listAvatarSize - layout.listAvatarBorderWidth * 2,
              borderRadius: (layout.listAvatarSize - layout.listAvatarBorderWidth * 2) * 0.5,
            },
          ]}
          resizeMode="cover"
        />
      </View>

      <View style={styles.listContent}>
        <Text
          style={[
            styles.listName,
            {
              fontSize: clamp(layout.listItemHeight * 0.25, 14, 16),
              color: isCurrentUser ? colors.primary : colors.primaryDark,
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={[
            styles.listGrade,
            {
              fontSize: clamp(layout.listItemHeight * 0.2, 12, 14),
            },
          ]}
        >
          {grade}
        </Text>
      </View>

      <Text
        style={[
          styles.listScore,
          {
            color: scoreColor,
            fontSize: clamp(layout.listItemHeight * 0.3, 16, 18),
          },
        ]}
      >
        {score}
      </Text>
    </View>
  );
};

const LeaderboardScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  // top 3 and rest
  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader
          title="Leaderboard"
          onNotificationPress={handleNotificationPress}
          showBackButton={true}
          compactRightGroup={true}
          contentHorizontalPadding={layout.horizontalPadding - 10}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: layout.sectionSpacing * 2,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View
            style={[
              styles.podiumContainer,
              {
                marginTop: layout.sectionSpacing,
                paddingHorizontal: layout.podiumSpacing,
              },
            ]}
          >
            {/* NOTE: posisi 2 - 1 - 3 untuk tampilan yang sama seperti HomeScreen */}
            <SecondPlaceColumn {...topThree[1]} layout={layout} />
            <FirstPlaceColumn {...topThree[0]} layout={layout} />
            <ThirdPlaceColumn {...topThree[2]} layout={layout} />
          </View>
        </View>

        <View
          style={[
            styles.listSection,
            {
              width: layout.contentWidth,
              marginTop: layout.sectionSpacing,
            },
          ]}
        >
          {restOfList.map((entry) => (
            <LeaderboardListItem key={entry.rank} {...entry} layout={layout} />
          ))}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  headerWrapper: {
    alignSelf: 'center',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  podiumColumn: {
    alignItems: 'center',
    position: 'relative',
  },
  leaderboardGradient: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: 12,
  },
  leaderboardGradientFirst: {
    minHeight: 210,
    paddingTop: 28,
  },
  leaderboardGradientSecond: {
    minHeight: 160,
  },
  leaderboardGradientThird: {
    minHeight: 160,
  },
  leaderboardMedal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 75,
    position: 'relative',
    marginBottom: 4,
  },
  leaderboardRankBadgeFirst: {
    position: 'absolute',
    bottom: -4.25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leaderboardRankBadgeSecond: {
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leaderboardRankBadgeThird: {
    position: 'absolute',
    bottom: -2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leaderboardRankText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 11,
  },
  leaderboardAvatar: {
    position: 'absolute',
    width: 58,
    height: 58,
    top: 8,
    borderRadius: 29,
  },
  leaderboardMeta: {
    alignItems: 'center',
    marginTop: 4,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  leaderboardName: {
    fontSize: 14,
    color: colors.darkText,
    fontFamily: fontFamilies.semiBold,
    textAlign: 'center',
  },
  leaderboardGrade: {
    fontSize: 10,
    color: '#617283',
    marginTop: 2,
    fontFamily: fontFamilies.semiBold,
    textAlign: 'center',
  },
  leaderboardScore: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },

  listSection: {
    paddingHorizontal: spacing.xxl,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  rankBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rankBadgeText: {
    fontFamily: fontFamilies.bold,
  },
  listAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listAvatar: {},
  listContent: {
    flex: 1,
  },
  listName: {
    fontFamily: fontFamilies.bold,
  },
  listGrade: {
    fontFamily: fontFamilies.medium,
    color: colors.mutedText,
    marginTop: 2,
  },
  listScore: {
    fontFamily: fontFamilies.bold,
    marginLeft: spacing.md,
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

export default LeaderboardScreen;
