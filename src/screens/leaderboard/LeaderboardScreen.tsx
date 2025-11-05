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
  useWindowDimensions,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies, gradients, radii, spacing } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';

// Import leaderboard assets
import Avatar1 from '../../../assets/images/Ava1.png';
import Avatar2 from '../../../assets/images/Ava2.png';
import Avatar3 from '../../../assets/images/Ava3.png';
import Avatar4 from '../../../assets/images/Ava4.png';
import Avatar5 from '../../../assets/images/Ava5.png';
import Avatar6 from '../../../assets/images/Ava6.png';
import RedBadgeIcon from '../../../assets/icons/redbordersvg.svg';
import OrangeBadgeIcon from '../../../assets/icons/orangeborder.svg';
import BlueBadgeIcon from '../../../assets/icons/blueborder.svg';

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

type LeaderboardEntry = {
  rank: number;
  name: string;
  grade: string;
  score: number;
  avatar: any;
  Badge: any;
  scoreColor: string;
  isCurrentUser?: boolean;
};

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Gitaak',
    grade: '9 SMP',
    score: 981,
    avatar: Avatar4,
    Badge: RedBadgeIcon,
    scoreColor: '#EF0F0F',
  },
  {
    rank: 2,
    name: 'Fikri',
    grade: '9 SMP',
    score: 865,
    avatar: Avatar1,
    Badge: OrangeBadgeIcon,
    scoreColor: '#FD7600',
  },
  {
    rank: 3,
    name: 'Aldo',
    grade: '9 SMP',
    score: 812,
    avatar: Avatar3,
    Badge: BlueBadgeIcon,
    scoreColor: colors.primary,
  },
  {
    rank: 4,
    name: 'Nataa',
    grade: '9 SMP',
    score: 756,
    avatar: Avatar2,
    Badge: null,
    scoreColor: colors.primaryDark,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: 'Sari',
    grade: '9 SMP',
    score: 698,
    avatar: Avatar5,
    Badge: null,
    scoreColor: colors.primaryDark,
  },
  {
    rank: 6,
    name: 'Budi',
    grade: '9 SMP',
    score: 645,
    avatar: Avatar6,
    Badge: null,
    scoreColor: colors.primaryDark,
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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

type PodiumColumnProps = LeaderboardEntry & {
  layout: ReturnType<typeof useResponsiveLayout>;
  position: 'first' | 'second' | 'third';
};

const PodiumColumn: FC<PodiumColumnProps> = ({
  rank,
  name,
  grade,
  score,
  avatar,
  Badge,
  scoreColor,
  layout,
  position,
}) => {
  const getPodiumColor = () => {
    switch (position) {
      case 'first':
        return ['#FFD700', '#FFA500']; // Gold
      case 'second':
        return ['#C0C0C0', '#A8A8A8']; // Silver
      case 'third':
        return ['#CD7F32', '#A0522D']; // Bronze
      default:
        return ['#E0E0E0', '#B0B0B0'];
    }
  };

  const podiumColors = getPodiumColor();
  const podiumHeight = position === 'first' ? layout.podiumHeight : layout.podiumHeight * 0.8;

  return (
    <View style={styles.podiumColumn}>
      <View
        style={[
          styles.podiumBase,
          {
            width: layout.podiumWidth,
            height: podiumHeight,
            backgroundColor: podiumColors[0],
          },
        ]}
      >
        <View
          style={[
            styles.podiumTop,
            {
              backgroundColor: podiumColors[1],
              height: podiumHeight * 0.7,
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                width: layout.avatarSize,
                height: layout.avatarSize,
                borderWidth: layout.avatarBorderWidth,
                borderColor: podiumColors[1],
                borderRadius: layout.avatarSize * 0.5,
              },
            ]}
          >
            <Image
              source={avatar}
              style={[
                styles.avatar,
                {
                  width: layout.avatarSize - layout.avatarBorderWidth * 2,
                  height: layout.avatarSize - layout.avatarBorderWidth * 2,
                  borderRadius: (layout.avatarSize - layout.avatarBorderWidth * 2) * 0.5,
                },
              ]}
              resizeMode="cover"
            />
            {Badge && (
              <View
                style={[
                  styles.badge,
                  {
                    width: layout.badgeSize,
                    height: layout.badgeSize,
                    bottom: -layout.badgeSize * 0.3,
                    right: -layout.badgeSize * 0.3,
                  },
                ]}
              >
                <Badge width={layout.badgeSize} height={layout.badgeSize} />
              </View>
            )}
          </View>
          <Text
            style={[
              styles.podiumName,
              {
                fontSize: clamp(layout.podiumWidth * 0.15, 10, 14),
              },
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.podiumScore,
              {
                color: scoreColor,
                fontSize: clamp(layout.podiumWidth * 0.18, 12, 16),
              },
            ]}
          >
            {score}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.rankNumber,
          {
            fontSize: clamp(layout.podiumWidth * 0.2, 14, 18),
            top: position === 'first' ? -layout.podiumHeight * 0.1 : -layout.podiumHeight * 0.05,
          },
        ]}
      >
        {rank}
      </Text>
    </View>
  );
};

type LeaderboardListItemProps = LeaderboardEntry & {
  layout: ReturnType<typeof useResponsiveLayout>;
};

const LeaderboardListItem: FC<LeaderboardListItemProps> = ({
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
          backgroundColor: isCurrentUser ? '#F0F8FF' : colors.white,
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

  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader
          title="Leaderboard"
          contentHorizontalPadding={layout.horizontalPadding}
          onNotificationPress={handleNotificationPress}
          showBackButton={true}
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
        <View
          // style={[
          //   styles.headerSection,
          //   {
          //     width: layout.contentWidth,
          //     height: layout.headerHeight,
          //     paddingVertical: layout.headerPaddingVertical,
          //     paddingHorizontal: layout.headerPaddingHorizontal,
          //   },
          // ]}
        >

          {/* <View style={styles.trophyContainer}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>November 2024</Text>
          </View> */}

          <View
            style={[
              styles.podiumContainer,
              {
                marginTop: layout.sectionSpacing,
                paddingHorizontal: layout.podiumSpacing,
              },
            ]}
          >
            <PodiumColumn {...topThree[1]} layout={layout} position="second" />
            <PodiumColumn {...topThree[0]} layout={layout} position="first" />
            <PodiumColumn {...topThree[2]} layout={layout} position="third" />
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
  headerSection: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    marginTop: spacing.md,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: fontFamilies.medium,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
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
  podiumBase: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  podiumTop: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {},
  badge: {
    position: 'absolute',
  },
  podiumName: {
    fontFamily: fontFamilies.bold,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  podiumGrade: {
    fontFamily: fontFamilies.medium,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
  podiumScore: {
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  rankNumber: {
    position: 'absolute',
    fontFamily: fontFamilies.bold,
    color: colors.white,
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