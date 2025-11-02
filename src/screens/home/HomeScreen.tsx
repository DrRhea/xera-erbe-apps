import React, { FC, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path, type SvgProps } from 'react-native-svg';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';

import HeroAvatar from '../../../assets/images/Ava2.png';
import AvatarGita from '../../../assets/images/Ava4.png';
import AvatarFikri from '../../../assets/images/Ava1.png';
import AvatarAldo from '../../../assets/images/Ava3.png';
import DigidawImage from '../../../assets/images/digidaw.png';
import TryOutImage from '../../../assets/images/tryout.png';
import SnackBtImage from '../../../assets/images/snackbt.png';
import PokeImage from '../../../assets/images/poke.png';
import ImEngImage from '../../../assets/images/imeng.png';
import MateriImage from '../../../assets/images/materi.png';
import PoweredByLogo from '../../../assets/images/logoutuhputih.png';
import LiterasikImage from '../../../assets/images/other2.png';
import AdminImage from '../../../assets/images/other1.png';

import BottomNavigation, { BottomNavigationItem } from '../../components/BottomNavigation';
import SearchBar from '../../components/SearchBar';
import HomeIcon from '../../../assets/icons/home-2.svg';
import PromoIcon from '../../../assets/icons/promo.svg';
import ArrowIcon from '../../../assets/icons/vector.svg';
import NotificationIcon from '../../../assets/icons/notifdot.svg';
import RedBadgeIcon from '../../../assets/icons/redbordersvg.svg';
import OrangeBadgeIcon from '../../../assets/icons/orangeborder.svg';
import BlueBadgeIcon from '../../../assets/icons/blueborder.svg';
import { colors, fontFamilies, gradients } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';

const leaderboardGradients = gradients.leaderboard;

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

type PercentString = `${number}%`;

SplashScreen.preventAutoHideAsync().catch(() => null);

type ProgressCardProps = {
  title: string;
  progress: number;
  accentLabel: string;
  footerLabel: string;
};

const progressData: ProgressCardProps[] = [
  {
    title: 'Progress Mingguan',
    progress: 0.75,
    accentLabel: '90',
    footerLabel: '/100 soal',
  },
  {
    title: 'Progress Harian',
    progress: 1.1,
    accentLabel: '23',
    footerLabel: '/20 soal',
  },
];

type RoutesWithoutParams = {
  [K in keyof RootStackParamList]: undefined extends RootStackParamList[K] ? K : never;
}[keyof RootStackParamList];

type QuickAction = {
  title: string;
  image: ImageSourcePropType;
  routeName?: RoutesWithoutParams;
};

const quickActions: QuickAction[] = [
  { title: "Let's DIGIDAW", image: DigidawImage, routeName: 'Digidaw' },
  { title: "Let's Try Out", image: TryOutImage, routeName: 'Tryout' },
];

type LeaderboardEntry = {
  name: string;
  grade: string;
  score: number;
  rank: number;
  avatar: ImageSourcePropType;
  Badge: FC<SvgProps>;
  scoreColor: string;
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    name: 'Gitaak',
    grade: '9 SMP',
    score: 981,
    rank: 1,
    avatar: AvatarGita,
    Badge: RedBadgeIcon,
    scoreColor: '#EF0F0F',
  },
  {
    name: 'Fikri',
    grade: '9 SMP',
    score: 865,
    rank: 2,
    avatar: AvatarFikri,
    Badge: OrangeBadgeIcon,
    scoreColor: '#FD7600',
  },
  {
    name: 'Aldo',
    grade: '9 SMP',
    score: 812,
    rank: 3,
    avatar: AvatarAldo,
    Badge: BlueBadgeIcon,
    scoreColor: colors.primary,
  },
];

const lifeAtErbeCards = [
  { title: 'SNack-BT', image: SnackBtImage, backgroundColor: '#FFEDD2' },
  { title: 'PoKe', image: PokeImage, backgroundColor: '#CDFEE2' },
  { title: 'ImEng', image: ImEngImage, backgroundColor: '#F6C2DB' },
  { title: 'Materi', image: MateriImage, backgroundColor: '#E0F5FF' },
];

const LIFE_CONTAINER_HORIZONTAL_PADDING = 13;
const LIFE_CARD_HEIGHT_RATIO = 107 / 82;
const LIFE_CARD_IMAGE_RATIO = 64 / 82;
const LIFE_CARD_TITLE_MARGIN_RATIO = 10 / 82;
const RECOMMENDATION_TOTAL_SLIDES = 4;
const ACTIVE_RECOMMENDATION_INDEX = 1;

const literasikCards = [
  {
    title: '5 Cara Upgrade Skill\nTanpa Stuck Lama-Lama',
    description:
      'Pernah ga sih kamu coba konsisten belajar tapi ngerasa kemampuan kamu stuck di situ-situ aja? Kadang penyebabnya...',
    tag: 'Tips Belajar',
    image: LiterasikImage,
  },
  {
    title: '5 Cara Upgrade Skill\nTanpa Stuck Lama-Lama',
    description:
      'Pernah ga sih kamu coba konsisten belajar tapi ngerasa kemampuan kamu stuck di situ-situ aja? Kadang penyebabnya...',
    tag: 'Tips Belajar',
    image: LiterasikImage,
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const guidelineBaseWidth = 375;

const scale = (size: number, width: number) => (width / guidelineBaseWidth) * size;

const moderateScale = (size: number, width: number, factor = 0.5) => size + (scale(size, width) - size) * factor;

export const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();
  const safeWidth = Math.max(width, 320);
  const contentWidth = Math.min(safeWidth, 440);

  const horizontalPadding = clamp(moderateScale(22, safeWidth, 0.45), 14, 26);
  const sectionSpacing = clamp(moderateScale(32, safeWidth, 0.4), 24, 40);
  const innerContentWidth = Math.max(0, contentWidth - horizontalPadding * 2);

  const heroPaddingTop = clamp(moderateScale(24, safeWidth, 0.4), 18, 32);
  const heroPaddingBottom = clamp(moderateScale(32, safeWidth, 0.4), 24, 40);
  const heroAvatarSize = clamp(moderateScale(92, safeWidth, 0.6), 72, 102);
  const profileSpacing = clamp(moderateScale(24, safeWidth, 0.5), 16, 30);
  const heroGreetingSize = clamp(moderateScale(22, safeWidth, 0.45), 18, 24);
  const heroBadgeFontSize = clamp(moderateScale(14, safeWidth, 0.45), 12, 16);
  const heroBadgePaddingVertical = clamp(moderateScale(6, safeWidth, 0.5), 4, 8);
  const heroBadgePaddingHorizontal = clamp(moderateScale(16, safeWidth, 0.5), 12, 20);
  const heroHeadlineFontSize = clamp(moderateScale(18, safeWidth, 0.45), 16, 20);

  const progressGap = clamp(moderateScale(12, safeWidth, 0.5), 8, 16);
  const quickActionGap = clamp(moderateScale(12, safeWidth, 0.5), 8, 18);
  const quickActionPaddingVertical = clamp(moderateScale(10, safeWidth, 0.5), 8, 14);
  const quickActionPaddingHorizontal = clamp(moderateScale(14, safeWidth, 0.5), 12, 18);
  const quickActionImageSize = clamp(moderateScale(46, safeWidth, 0.5), 36, 54);
  const quickActionLabelFontSize = clamp(moderateScale(14, safeWidth, 0.4), 12, 16);

  const recommendationPaddingHorizontal = clamp(moderateScale(24, safeWidth, 0.5), 18, 30);
  const recommendationPaddingVertical = clamp(moderateScale(24, safeWidth, 0.5), 18, 30);

  const literasikGap = clamp(moderateScale(15, safeWidth, 0.5), 12, 18);
  const literasikPadding = clamp(moderateScale(16, safeWidth, 0.5), 12, 20);
  const literasikImageSize = clamp(moderateScale(84, safeWidth, 0.4), 68, 96);
  const literasikFooterGap = clamp(moderateScale(8, safeWidth, 0.5), 6, 10);

  const adminPadding = clamp(moderateScale(20, safeWidth, 0.5), 16, 26);
  const adminImageSize = clamp(moderateScale(112, safeWidth, 0.5), 90, 126);
  const adminButtonPaddingHorizontal = clamp(moderateScale(24, safeWidth, 0.5), 18, 30);
  const adminButtonPaddingVertical = clamp(moderateScale(8, safeWidth, 0.5), 6, 12);

  const lifeContainerPaddingHorizontal = clamp(moderateScale(14, safeWidth, 0.4), 9, 18);
  const lifeContainerPaddingVertical = clamp(moderateScale(14, safeWidth, 0.45), 10, 18);
  const lifeCardSpacing = clamp(moderateScale(12, safeWidth, 0.45), 8, 14);
  const lifeCardColumns = Math.max(lifeAtErbeCards.length, 1);
  const lifeSpacingTotal = lifeCardSpacing * Math.max(lifeCardColumns - 1, 0);
  const lifeAvailableWidth = Math.max(innerContentWidth - lifeContainerPaddingHorizontal * 2 - lifeSpacingTotal, lifeCardColumns);
  const rawLifeCardWidth = lifeAvailableWidth / lifeCardColumns;
  const lifeCardMaxWidth = clamp(moderateScale(128, safeWidth, 0.35), 110, 144);
  const lifeCardWidth = Math.min(rawLifeCardWidth, lifeCardMaxWidth);
  const lifeCardVerticalPadding = clamp(rawLifeCardWidth * 0.18, 10, 18);
  const lifeCardTitleFontSize = clamp(rawLifeCardWidth * 0.16, 9.5, 12.5);
  const recommendationDotsGap = clamp(moderateScale(12, safeWidth, 0.4), 8, 14);

  return {
    screenWidth: safeWidth,
    contentWidth,
    innerContentWidth,
    horizontalPadding,
    sectionSpacing,
    heroPaddingTop,
    heroPaddingBottom,
    heroAvatarSize,
    profileSpacing,
    heroGreetingSize,
    heroBadgeFontSize,
    heroBadgePaddingVertical,
    heroBadgePaddingHorizontal,
    heroHeadlineFontSize,
    progressGap,
    quickActionGap,
    quickActionPaddingVertical,
    quickActionPaddingHorizontal,
    quickActionImageSize,
    quickActionLabelFontSize,
    recommendationPaddingHorizontal,
    recommendationPaddingVertical,
    literasikGap,
    literasikPadding,
    literasikImageSize,
    literasikFooterGap,
    adminPadding,
    adminImageSize,
    adminButtonPaddingHorizontal,
    adminButtonPaddingVertical,
    lifeContainerPaddingHorizontal,
    lifeContainerPaddingVertical,
    lifeCardSpacing,
    lifeCardWidth,
    lifeCardVerticalPadding,
    lifeCardTitleFontSize,
    recommendationDotsGap,
  };
};

type ResponsiveLayout = ReturnType<typeof useResponsiveLayout>;

const ProgressCard: FC<ProgressCardProps> = ({ title, progress, accentLabel, footerLabel }) => {
  const widthPercent: PercentString = `${Math.min(progress, 1) * 100}%`;

  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>{title}</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: widthPercent }]} />
          <Text style={styles.progressValue}>{`${Math.round(progress * 100)}%`}</Text>
        </View>
        <Text style={styles.progressFooter}>
          <Text style={styles.progressFooterAccent}>{accentLabel}</Text>
          {footerLabel}
        </Text>
      </View>
    </View>
  );
};

type QuickActionCardProps = QuickAction & {
  index: number;
  paddingHorizontal: number;
  paddingVertical: number;
  imageSize: number;
  labelFontSize: number;
  minWidth: number;
  onPress?: () => void;
};

const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  image,
  index,
  paddingHorizontal,
  paddingVertical,
  imageSize,
  labelFontSize,
  minWidth,
  onPress,
}) => (
  <Pressable
    key={`${title}-${index}`}
    style={[styles.quickActionCard, { paddingHorizontal, paddingVertical, minWidth }]}
    onPress={onPress}
    disabled={!onPress}
    accessibilityRole={onPress ? 'button' : undefined}
  >
    <Image source={image} style={[styles.quickActionImage, { width: imageSize, height: imageSize }]} resizeMode="contain" />
    <Text style={[styles.quickActionLabel, { fontSize: labelFontSize }]}>{title}</Text>
  </Pressable>
);

const FirstPlaceColumn: FC<LeaderboardEntry> = ({ name, grade, score, avatar, Badge, scoreColor }) => (
  <View style={styles.leaderboardColumn}>
    <LinearGradient
    colors={[...leaderboardGradients[1]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientFirst]}
    >
      <View style={styles.leaderboardMedal}>
        <Badge width={68} height={75} />
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

const SecondPlaceColumn: FC<LeaderboardEntry> = ({ name, grade, score, avatar, Badge, scoreColor }) => (
  <View style={styles.leaderboardColumn}>
    <LinearGradient
    colors={[...leaderboardGradients[2]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientSecond]}
    >
      <View style={styles.leaderboardMedal}>
        <Badge width={68} height={75} />
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

const ThirdPlaceColumn: FC<LeaderboardEntry> = ({ name, grade, score, avatar, Badge, scoreColor }) => (
  <View style={styles.leaderboardColumn}>
    <LinearGradient
    colors={[...leaderboardGradients[3]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leaderboardGradient, styles.leaderboardGradientThird]}
    >
      <View style={styles.leaderboardMedal}>
        <Badge width={68} height={75} />
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

type LifeCardProps = (typeof lifeAtErbeCards)[number] & {
  width: number;
  paddingVertical: number;
  titleFontSize: number;
};

const LifeCard: FC<LifeCardProps> = ({ title, image, backgroundColor, width, paddingVertical, titleFontSize }) => {
  const cardHeight = width * LIFE_CARD_HEIGHT_RATIO;
  const availableImageWidth = Math.max(width - 16, 48);
  const imageSize = Math.min(availableImageWidth, width * LIFE_CARD_IMAGE_RATIO);
  const titleMarginTop = Math.max(6, width * LIFE_CARD_TITLE_MARGIN_RATIO);

  return (
    <Pressable
      style={[
        styles.lifeCard,
        {
          backgroundColor,
          width,
          minWidth: width,
          maxWidth: width,
          height: cardHeight,
          paddingVertical,
        },
      ]}
    >
      <Image
        source={image}
        style={[styles.lifeCardImage, { width: imageSize, height: imageSize }]}
        resizeMode="contain"
      />
      <Text
        style={[styles.lifeCardTitle, { marginTop: titleMarginTop, fontSize: titleFontSize, maxWidth: width - 12 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {title}
      </Text>
    </Pressable>
  );
};

type LiterasikCardProps = (typeof literasikCards)[number] & {
  layout: ResponsiveLayout;
};

const LiterasikCard: FC<LiterasikCardProps> = ({ title, description, tag, image, layout }) => {
  const badgePaddingHorizontal = clamp(moderateScale(12, layout.screenWidth, 0.4), 10, 16);
  const badgePaddingVertical = clamp(moderateScale(4, layout.screenWidth, 0.4), 3, 6);
  const badgeFontSize = clamp(moderateScale(9, layout.screenWidth, 0.45), 8, 10.5);
  const titleFontSize = clamp(moderateScale(12, layout.screenWidth, 0.45), 11, 14);
  const descriptionFontSize = clamp(moderateScale(9, layout.screenWidth, 0.45), 8, 11);
  const linkFontSize = clamp(moderateScale(10, layout.screenWidth, 0.45), 9, 12);

  return (
    <View style={[styles.literasikCard, { padding: layout.literasikPadding }]}>
      <View
        style={[
          styles.literasikBadge,
          { paddingHorizontal: badgePaddingHorizontal, paddingVertical: badgePaddingVertical },
        ]}
      >
        <Text style={[styles.literasikBadgeText, { fontSize: badgeFontSize }]}>{tag}</Text>
      </View>
      <Image
        source={image}
        style={[styles.literasikImage, { width: layout.literasikImageSize, height: layout.literasikImageSize }]}
        resizeMode="contain"
      />
      <Text style={[styles.literasikTitle, { fontSize: titleFontSize }]}>{title}</Text>
      <Text style={[styles.literasikDescription, { fontSize: descriptionFontSize }]}>{description}</Text>
      <View style={[styles.literasikFooter, { gap: layout.literasikFooterGap }]}>
        <ArrowIcon width={13} height={13} />
        <Text style={[styles.literasikLink, { fontSize: linkFontSize }]}>Lanjutkan Baca</Text>
      </View>
    </View>
  );
};

const AdminCard: FC<{ layout: ResponsiveLayout }> = ({ layout }) => (
  <View style={styles.adminCard}>
    <LinearGradient
      colors={['#004559', colors.greenLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.adminGradient, { padding: layout.adminPadding, columnGap: layout.quickActionGap, gap: layout.quickActionGap }]}
    >
      <Image
        source={AdminImage}
        style={[styles.adminImage, { width: layout.adminImageSize, height: layout.adminImageSize }]}
        resizeMode="contain"
      />
      <View style={styles.adminCopy}>
        <Text style={[styles.adminTitle, { fontSize: clamp(moderateScale(15, layout.screenWidth, 0.45), 14, 17) }]}>{'Tanya & Kepo Erbe!'}</Text>
        <Text style={[styles.adminDescription, { fontSize: clamp(moderateScale(10, layout.screenWidth, 0.45), 9, 12) }]}>
          Mau tau program belajar di erbe atau promo menarik paket belajar di erbe? Gas kepoin lewat chat admin erbe yaakkk
        </Text>
        <Pressable
          style={[
            styles.adminButton,
            {
              paddingHorizontal: layout.adminButtonPaddingHorizontal,
              paddingVertical: layout.adminButtonPaddingVertical,
            },
          ]}
        >
          <Text style={styles.adminButtonText}>Chat Admin</Text>
        </Pressable>
      </View>
    </LinearGradient>
  </View>
);

const HomescreenHeader: FC<{ layout: ResponsiveLayout }> = ({ layout }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const quickActionMinWidth = quickActions.length
    ? Math.max(
        (layout.innerContentWidth - layout.quickActionGap * Math.max(quickActions.length - 1, 0)) /
          quickActions.length,
        0
      )
    : layout.innerContentWidth;

  const profileMarginTop = Math.max(layout.heroPaddingTop * 1.1, 20);

  const handleQuickActionPress = useCallback(
    (action: QuickAction) => {
      if (action.routeName) {
        navigation.navigate(action.routeName);
      }
    },
    [navigation]
  );

  return (
    <View style={[styles.heroWrapper, { width: layout.contentWidth, alignSelf: 'center' }]}>
      <LinearGradient
        colors={['#1C637B', '#9EE0BF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.heroContainer,
          {
            paddingHorizontal: layout.horizontalPadding,
            paddingTop: layout.heroPaddingTop,
            paddingBottom: layout.heroPaddingBottom,
          },
        ]}
      >
        <View style={styles.searchRow}>
          <SearchBar placeholder="Mau belajar apa nih?" style={styles.searchBarWrapper} />
          <Pressable style={styles.notificationButton}>
            <NotificationIcon style={styles.notificationIcon} />
          </Pressable>
        </View>
        <View style={[styles.profileRow, { marginTop: profileMarginTop }]}>
          <Image
            source={HeroAvatar}
            style={[styles.profileAvatar, { width: layout.heroAvatarSize, height: layout.heroAvatarSize }]}
            resizeMode="contain"
          />
          <View style={[styles.profileMeta, { marginLeft: layout.profileSpacing }]}>
            <Text style={[styles.profileGreeting, { fontSize: layout.heroGreetingSize }]}>Hi, Nataa!</Text>
            <View
              style={[
                styles.profileBadge,
                { paddingVertical: layout.heroBadgePaddingVertical, paddingHorizontal: layout.heroBadgePaddingHorizontal },
              ]}
            >
              <Text style={[styles.profileBadgeText, { fontSize: layout.heroBadgeFontSize }]}>RBD0925015 - Idaman UI</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.heroHeadline, { fontSize: layout.heroHeadlineFontSize }]}>{"Let's Start Your Academic Era!"}</Text>
        <View style={[styles.progressGrid, { columnGap: layout.progressGap, rowGap: layout.progressGap, gap: layout.progressGap }]}>
          {progressData.map((item) => (
            <ProgressCard key={item.title} {...item} />
          ))}
        </View>
        <View
          style={[
            styles.quickActionsRow,
            { columnGap: layout.quickActionGap, rowGap: layout.quickActionGap, gap: layout.quickActionGap },
          ]}
        >
          {quickActions.map((item, index) => (
            <QuickActionCard
              key={item.title}
              {...item}
              index={index}
              paddingHorizontal={layout.quickActionPaddingHorizontal}
              paddingVertical={layout.quickActionPaddingVertical}
              imageSize={layout.quickActionImageSize}
              labelFontSize={layout.quickActionLabelFontSize}
              minWidth={quickActionMinWidth}
              onPress={item.routeName ? () => handleQuickActionPress(item) : undefined}
            />
          ))}
        </View>
        <View
          style={[
            styles.poweredRow,
            { columnGap: Math.max(6, layout.quickActionGap * 0.5), gap: Math.max(6, layout.quickActionGap * 0.5) },
          ]}
        >
          <Text style={styles.poweredText}>Powered by</Text>
          <Image source={PoweredByLogo} style={styles.poweredLogo} resizeMode="contain" />
        </View>
      </LinearGradient>
    </View>
  );
};

const RecommendationWave: FC = () => (
  <Svg viewBox="0 0 387 84" style={styles.recommendationWave}>
    <Path d="M0 42C52 68 130 86 200 70C270 54 320 64 387 84V84H0V42Z" fill={colors.white} />
  </Svg>
);

const RecommendationsCard: FC<{ layout: ResponsiveLayout }> = ({ layout }) => {
  const badgeHorizontal = Math.max(layout.horizontalPadding * 0.75, 14);
  const badgeVertical = Math.max(layout.horizontalPadding * 0.45, 10);
  const codeLabelHorizontal = Math.max(layout.horizontalPadding * 0.6, 12);
  const codeLabelVertical = Math.max(layout.horizontalPadding * 0.35, 6);
  const codeBadgeHorizontal = Math.max(layout.horizontalPadding, 20);
  const codeBadgeVertical = Math.max(layout.horizontalPadding * 0.35, 8);

  return (
    <View style={styles.recommendationCard}>
      <LinearGradient
        colors={['#CFE8E6', '#86C8C6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.recommendationGradient,
          {
            paddingHorizontal: layout.recommendationPaddingHorizontal,
            paddingVertical: layout.recommendationPaddingVertical,
            minHeight: clamp(layout.screenWidth * 0.36, 150, 196),
          },
        ]}
      >
        <RecommendationWave />
        <View style={styles.recommendationTopRow}>
          <View
            style={[
              styles.recommendationBadge,
              { paddingHorizontal: badgeHorizontal, paddingVertical: badgeVertical },
            ]}
          >
            <Text style={styles.recommendationBadgeText}>{`SUPER\nPTN!`}</Text>
          </View>
          <View style={styles.recommendationIconWrapper}>
            <PromoIcon width={62} height={62} />
          </View>
          <View style={styles.recommendationDiscountGroup}>
            <Text style={styles.recommendationDiscount}>30%</Text>
            <Text style={styles.recommendationSuffix}>off</Text>
          </View>
        </View>
        <View style={styles.recommendationCodeWrapper}>
          <View
            style={[
              styles.recommendationCodeLabel,
              { paddingHorizontal: codeLabelHorizontal, paddingVertical: codeLabelVertical },
            ]}
          >
            <PromoIcon width={26} height={26} />
            <Text style={styles.recommendationCodeLabelText}>{`KODE\nPROMO`}</Text>
          </View>
          <View
            style={[
              styles.recommendationCodeBadge,
              { paddingHorizontal: codeBadgeHorizontal, paddingVertical: codeBadgeVertical },
            ]}
          >
            <Text style={styles.recommendationCodeText}>SUPERPTN</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const RecommendationCarouselIndicators: FC<{ layout: ResponsiveLayout }> = ({ layout }) => (
  <View style={[styles.recommendationDots, { columnGap: layout.recommendationDotsGap, gap: layout.recommendationDotsGap }]}>
    {Array.from({ length: RECOMMENDATION_TOTAL_SLIDES }).map((_, index) => (
      <View
        key={`recommendation-dot-${index}`}
        style={[styles.recommendationDot, index === ACTIVE_RECOMMENDATION_INDEX && styles.recommendationDotActive]}
      />
    ))}
  </View>
);

const SectionHeader: FC<{ title: string; cta?: string; centered?: boolean }> = ({ title, cta, centered }) => (
  <View style={[styles.sectionHeader, centered && styles.sectionHeaderCentered]}>
    <Text style={[styles.sectionTitle, centered && styles.sectionTitleCentered]}>{title}</Text>
    {cta ? <Text style={styles.sectionCta}>{cta}</Text> : null}
  </View>
);

const LeaderboardSection: FC<{ layout: ResponsiveLayout }> = ({ layout }) => {
  const firstPlace = leaderboardEntries.find((entry) => entry.rank === 1)!;
  const secondPlace = leaderboardEntries.find((entry) => entry.rank === 2)!;
  const thirdPlace = leaderboardEntries.find((entry) => entry.rank === 3)!;

  return (
    <View
      style={[
        styles.leaderboardCard,
        {
          paddingHorizontal: clamp(layout.horizontalPadding * 0.75, 14, 24),
          paddingVertical: clamp(layout.horizontalPadding, 18, 28),
        },
      ]}
    >
      <View style={[styles.leaderboardColumns, { columnGap: layout.progressGap, gap: layout.progressGap }]}>
        <SecondPlaceColumn {...secondPlace} />
        <FirstPlaceColumn {...firstPlace} />
        <ThirdPlaceColumn {...thirdPlace} />
      </View>
      <Pressable
        style={[
          styles.leaderboardButton,
          {
            marginTop: clamp(layout.sectionSpacing * 0.5, 20, 32),
            paddingHorizontal: clamp(layout.horizontalPadding * 1.2, 28, 40),
            paddingVertical: clamp(layout.horizontalPadding * 0.45, 10, 16),
          },
        ]}
      >
        <Text style={styles.leaderboardButtonText}>Cek Erbe Leaderboard</Text>
      </Pressable>
    </View>
  );
};

const LifeAtErbeSection: FC<{ layout: ResponsiveLayout }> = ({ layout }) => (
  <View
    style={[
      styles.lifeContainer,
      {
        width: layout.innerContentWidth,
        alignSelf: 'center',
        paddingHorizontal: layout.lifeContainerPaddingHorizontal,
        paddingVertical: layout.lifeContainerPaddingVertical,
      },
    ]}
  >
    <View
      style={[
        styles.lifeRow,
        {
          columnGap: layout.lifeCardSpacing,
          gap: layout.lifeCardSpacing,
        },
      ]}
    >
      {lifeAtErbeCards.map((card) => (
        <LifeCard
          key={card.title}
          {...card}
          width={layout.lifeCardWidth}
          paddingVertical={layout.lifeCardVerticalPadding}
          titleFontSize={layout.lifeCardTitleFontSize}
        />
      ))}
    </View>
  </View>
);

const LiterasikSection: FC<{ layout: ResponsiveLayout }> = ({ layout }) => (
  <View
    style={[
      styles.literasikRow,
      {
        marginTop: clamp(layout.sectionSpacing * 0.65, 16, 24),
        columnGap: layout.literasikGap,
        rowGap: layout.literasikGap,
        gap: layout.literasikGap,
      },
    ]}
  >
    {literasikCards.map((card, index) => (
      <LiterasikCard key={`${card.title}-${index}`} {...card} layout={layout} />
    ))}
  </View>
);

const HomeScreen: FC = () => {
  const [fontsLoaded, fontError] = useFonts({
    [fontFamilies.regular]: require('../../../assets/fonts/montserrat/Montserrat-Regular.ttf'),
    [fontFamilies.medium]: require('../../../assets/fonts/montserrat/Montserrat-Medium.ttf'),
    [fontFamilies.semiBold]: require('../../../assets/fonts/montserrat/Montserrat-SemiBold.ttf'),
    [fontFamilies.bold]: require('../../../assets/fonts/montserrat/Montserrat-Bold.ttf'),
    [fontFamilies.extraBold]: require('../../../assets/fonts/montserrat/Montserrat-ExtraBold.ttf'),
    [fontFamilies.hero]: require('../../../assets/fonts/playpensans/PlaypenSans-ExtraBold.ttf'),
  });

  const layout = useResponsiveLayout();

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: clamp(layout.sectionSpacing * 2, 64, 120),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomescreenHeader layout={layout} />
        <View
          style={[
            styles.sectionSpacing,
            {
              marginTop: layout.sectionSpacing,
              paddingHorizontal: layout.horizontalPadding,
              width: layout.contentWidth,
            },
          ]}
        >
          <SectionHeader title="See Our Recommendations" cta="Selengkapnya" />
          <RecommendationsCard layout={layout} />
          <RecommendationCarouselIndicators layout={layout} />
        </View>
        <View
          style={[
            styles.sectionSpacing,
            {
              marginTop: layout.sectionSpacing,
              paddingHorizontal: layout.horizontalPadding,
              width: layout.contentWidth,
            },
          ]}
        >
          <SectionHeader title="Leaderboard" centered />
          <LeaderboardSection layout={layout} />
        </View>
        <View
          style={[
            styles.sectionSpacing,
            {
              marginTop: layout.sectionSpacing,
              paddingHorizontal: layout.horizontalPadding,
              width: layout.contentWidth,
            },
          ]}
        >
          <SectionHeader title="Life at Erbe" centered />
          <LifeAtErbeSection layout={layout} />
        </View>
        <View
          style={[
            styles.sectionSpacing,
            {
              marginTop: layout.sectionSpacing,
              paddingHorizontal: layout.horizontalPadding,
              width: layout.contentWidth,
            },
          ]}
        >
          <SectionHeader title="Literasik" cta="Cek Lainnya" />
          <LiterasikSection layout={layout} />
        </View>
        <View
          style={[
            styles.sectionSpacing,
            {
              marginTop: layout.sectionSpacing,
              paddingHorizontal: layout.horizontalPadding,
              width: layout.contentWidth,
              marginBottom: clamp(layout.sectionSpacing * 0.8, 24, 40),
            },
          ]}
        >
          <AdminCard layout={layout} />
        </View>
      </ScrollView>
      <BottomNavigation
        items={navItems}
        activeKey="home"
        backgroundColor={colors.white}
        activeColor={colors.primary}
        inactiveColor="#617283"
        style={styles.bottomNavContainer}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  heroWrapper: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: 16,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 28,
    height: 28,
    transform: [{ translateY: 5 }],
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  profileAvatar: {
    width: 92,
    height: 92,
  },
  profileMeta: {
    marginLeft: 24,
  },
  profileGreeting: {
    fontSize: 22,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  profileBadge: {
    marginTop: 8,
    backgroundColor: '#95C688',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  profileBadgeText: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  heroHeadline: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 18,
    color: colors.white,
    fontFamily: fontFamilies.hero,
  },
  progressGrid: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  progressTitle: {
    fontSize: 13,
    color: colors.darkText,
    textAlign: 'center',
    fontFamily: fontFamilies.bold,
  },
  progressRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 17,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: colors.accent,
  },
  progressValue: {
    fontSize: 9,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  progressFooter: {
    fontSize: 9,
    color: colors.mutedText,
    textAlign: 'center',
    fontFamily: fontFamilies.medium,
  },
  progressFooterAccent: {
    fontSize: 12,
    color: colors.accent,
    fontFamily: fontFamilies.bold,
  },
  quickActionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  quickActionImage: {
    width: 46,
    height: 46,
  },
  quickActionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#F18C1E',
    textAlign: 'right',
    fontFamily: fontFamilies.bold,
  },
  poweredRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  poweredText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fontFamilies.semiBold,
  },
  poweredLogo: {
    width: 60,
    height: 16,
  },
  sectionSpacing: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderCentered: {
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    color: colors.sectionTitle,
    fontFamily: fontFamilies.bold,
  },
  sectionTitleCentered: {
    textAlign: 'center',
  },
  sectionCta: {
    fontSize: 12,
    color: colors.accent,
    fontFamily: fontFamilies.bold,
  },
  sectionCtaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recommendationCard: {
    marginTop: 20,
  },
  recommendationGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 157,
    paddingHorizontal: 24,
    paddingVertical: 24,
    position: 'relative',
  },
  recommendationWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 84,
  },
  recommendationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  recommendationBadge: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    zIndex: 1,
  },
  recommendationBadgeText: {
    color: colors.white,
    fontFamily: fontFamilies.extraBold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  recommendationIconWrapper: {
    paddingHorizontal: 12,
    zIndex: 1,
  },
  recommendationDiscountGroup: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
  recommendationDiscount: {
    fontSize: 50,
    color: colors.accent,
    fontFamily: fontFamilies.extraBold,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  recommendationSuffix: {
    marginTop: -6,
    fontSize: 15,
    color: colors.white,
    fontFamily: fontFamilies.bold,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  recommendationCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    zIndex: 1,
  },
  recommendationCodeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 12,
  },
  recommendationCodeLabelText: {
    marginLeft: 8,
    fontSize: 9,
    lineHeight: 11,
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
  recommendationCodeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  recommendationCodeText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fontFamilies.bold,
    letterSpacing: 0.4,
  },
  recommendationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  recommendationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8E6E4',
    marginHorizontal: 6,
  },
  recommendationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.sectionTitle,
  },
  leaderboardCard: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  leaderboardColumns: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 16,
    gap: 0,
  },
  leaderboardColumn: {
    alignItems: 'center',
    flex: 1,
  },
  leaderboardGradient: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
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
  leaderboardButton: {
    marginTop: 24,
    backgroundColor: '#FF9F51',
    borderRadius: 30,
    paddingVertical: 12,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  leaderboardButtonText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
  lifeContainer: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: LIFE_CONTAINER_HORIZONTAL_PADDING,
    paddingVertical: 12,
    shadowColor: '#0F1E34',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    alignSelf: 'stretch',
  },
  lifeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: '100%',
  },
  lifeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 8,
  },
  lifeCardImage: {
    width: 64,
    height: 64,
  },
  lifeCardTitle: {
    fontSize: 12,
    color: colors.sectionTitle,
    textAlign: 'center',
    fontFamily: fontFamilies.bold,
  },
  literasikRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 15,
  },
  literasikCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
  },
  literasikBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9D4C',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  literasikBadgeText: {
    fontSize: 9,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  literasikImage: {
    width: 84,
    height: 84,
    alignSelf: 'center',
    marginTop: 12,
  },
  literasikTitle: {
    marginTop: 16,
    fontSize: 12,
    color: colors.sectionTitle,
    fontFamily: fontFamilies.bold,
  },
  literasikDescription: {
    marginTop: 8,
    fontSize: 9,
    color: colors.sectionTitle,
    lineHeight: 14,
    fontFamily: fontFamilies.medium,
  },
  literasikFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  literasikLink: {
    fontSize: 10,
    color: colors.sectionTitle,
    fontFamily: fontFamilies.bold,
  },
  adminCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  adminGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  adminImage: {
    width: 112,
    height: 112,
  },
  adminCopy: {
    flex: 1,
  },
  adminTitle: {
    fontSize: 15,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  adminDescription: {
    marginTop: 8,
    fontSize: 10,
    color: colors.white,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
  },
  adminButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: '#FF9D4C',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  adminButtonText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fontFamilies.bold,
  },
  bottomNavContainer: {
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