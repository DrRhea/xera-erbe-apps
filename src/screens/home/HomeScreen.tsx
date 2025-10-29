import React, { FC, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import BottomNavigation, { BottomNavigationItem } from '../../components/BottomNavigation';
import type { SvgProps } from 'react-native-svg';

import SearchIcon from '../../../assets/icons/search.svg';
import NotificationIcon from '../../../assets/icons/notifdot.svg';
import RedBadgeIcon from '../../../assets/icons/redbordersvg.svg';
import OrangeBadgeIcon from '../../../assets/icons/orangeborder.svg';
import BlueBadgeIcon from '../../../assets/icons/blueborder.svg';
import ArrowIcon from '../../../assets/icons/vector.svg';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import PromoIcon from '../../../assets/icons/promo.svg';
import CarouselDotIcon from '../../../assets/icons/carouseldot.svg';
import CarouselDotActiveIcon from '../../../assets/icons/carouseldotactive.svg';

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

const colors = {
  background: '#F0F0F0',
  primary: '#015876',
  accent: '#FF8725',
  white: '#FFFFFF',
  darkText: '#202020',
  mutedText: '#7C7C7C',
  sectionTitle: '#004559',
  greenLight: '#00BFAC',
};

const fontFamilies = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semiBold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
  extraBold: 'Montserrat-ExtraBold',
  hero: 'PlaypenSans-ExtraBold',
};

const leaderboardGradients: Record<number, [string, string]> = {
  1: ['#CCF3ED', '#7FC9BA'],
  2: ['#B8E5DE', '#62BCAE'],
  3: ['#B8E5DE', '#62BCAE'],
};

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon },
  { key: 'profile', label: 'Profile', Icon: UserIcon },
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

type QuickAction = {
  title: string;
  image: ImageSourcePropType;
};

const quickActions: QuickAction[] = [
  { title: "Let's DIGIDAW", image: DigidawImage },
  { title: "Let's Try Out", image: TryOutImage },
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
    grade: '12 SMA',
    score: 865,
    rank: 2,
    avatar: AvatarFikri,
    Badge: OrangeBadgeIcon,
    scoreColor: colors.accent,
  },
  {
    name: 'Aldo',
    grade: '8 SMP',
    score: 546,
    rank: 3,
    avatar: AvatarAldo,
    Badge: BlueBadgeIcon,
    scoreColor: colors.primary,
  },
];

const leaderboardDisplayOrder: number[] = [2, 1, 3];

const lifeAtErbeCards = [
  { title: 'SNack-BT', image: SnackBtImage, backgroundColor: '#FFEDD2' },
  { title: 'PoKe', image: PokeImage, backgroundColor: '#CDFEE2' },
  { title: 'ImEng', image: ImEngImage, backgroundColor: '#F6C2DB' },
  { title: 'Materi', image: MateriImage, backgroundColor: '#E0F5FF' },
];

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
};

const QuickActionCard: FC<QuickActionCardProps> = ({ title, image, index }) => (
  <Pressable key={`${title}-${index}`} style={styles.quickActionCard}>
    <Image source={image} style={styles.quickActionImage} resizeMode="contain" />
    <Text style={styles.quickActionLabel}>{title}</Text>
  </Pressable>
);

const LeaderboardColumn: FC<LeaderboardEntry> = ({ name, grade, score, rank, avatar, Badge, scoreColor }) => {
  const gradient = leaderboardGradients[rank] ?? leaderboardGradients[2];
  const isChampion = rank === 1;

  return (
    <View
      style={[
        styles.leaderboardColumn,
        isChampion ? styles.leaderboardColumnLeader : styles.leaderboardColumnChallenger,
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.leaderboardGradient, isChampion ? styles.leaderboardGradientLeader : styles.leaderboardGradientChallenger]}
      >
        <View style={styles.leaderboardRankPill}>
          <Text style={styles.leaderboardRankText}>{rank}</Text>
        </View>
        <View style={styles.leaderboardMedal}>
          <Badge width={68} height={75} />
          <Image source={avatar} style={styles.leaderboardAvatar} resizeMode="contain" />
        </View>
      </LinearGradient>
      <View style={styles.leaderboardMeta}>
        <Text style={styles.leaderboardName}>{name}</Text>
        <Text style={styles.leaderboardGrade}>{grade}</Text>
        <Text style={[styles.leaderboardScore, { color: scoreColor }]}>{score}</Text>
      </View>
    </View>
  );
};

const LifeCard: FC<(typeof lifeAtErbeCards)[number]> = ({ title, image, backgroundColor }) => (
  <View style={[styles.lifeCard, { backgroundColor }]}>
    <Image source={image} style={styles.lifeCardImage} resizeMode="contain" />
    <Text style={styles.lifeCardTitle}>{title}</Text>
  </View>
);

const LiterasikCard: FC<(typeof literasikCards)[number]> = ({ title, description, tag, image }) => (
  <View style={styles.literasikCard}>
    <View style={styles.literasikBadge}>
      <Text style={styles.literasikBadgeText}>{tag}</Text>
    </View>
    <Image source={image} style={styles.literasikImage} resizeMode="contain" />
    <Text style={styles.literasikTitle}>{title}</Text>
    <Text style={styles.literasikDescription}>{description}</Text>
    <View style={styles.literasikFooter}>
      <ArrowIcon width={13} height={13} />
      <Text style={styles.literasikLink}>Lanjutkan Baca</Text>
    </View>
  </View>
);

const AdminCard: FC = () => (
  <View style={styles.adminCard}>
    <LinearGradient colors={['#004559', colors.greenLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.adminGradient}>
      <Image source={AdminImage} style={styles.adminImage} resizeMode="contain" />
      <View style={styles.adminCopy}>
        <Text style={styles.adminTitle}>{'Tanya & Kepo Erbe!'}</Text>
        <Text style={styles.adminDescription}>
          Mau tau program belajar di erbe atau promo menarik paket belajar di erbe? Gas kepoin lewat chat admin erbe yaakkk
        </Text>
        <Pressable style={styles.adminButton}>
          <Text style={styles.adminButtonText}>Chat Admin</Text>
        </Pressable>
      </View>
    </LinearGradient>
  </View>
);

const HomescreenHeader: FC = () => (
  <View style={styles.heroWrapper}>
    <LinearGradient colors={['#1C637B', '#9EE0BF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.heroContainer}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Mau belajar apa nih?</Text>
          <SearchIcon width={18} height={18} />
        </View>
        <Pressable style={styles.notificationButton}>
          <NotificationIcon width={80} height={80} />
        </Pressable>
      </View>
      <View style={styles.profileRow}>
        <Image source={HeroAvatar} style={styles.profileAvatar} resizeMode="contain" />
        <View style={styles.profileMeta}>
          <Text style={styles.profileGreeting}>Hi, Nataa!</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>RBD0925015 - Idaman UI</Text>
          </View>
        </View>
      </View>
      <Text style={styles.heroHeadline}>{"Let's Start Your Academic Era!"}</Text>
      <View style={styles.progressGrid}>
        {progressData.map((item) => (
          <ProgressCard key={item.title} {...item} />
        ))}
      </View>
      <View style={styles.quickActionsRow}>
        {quickActions.map((item, index) => (
          <QuickActionCard key={item.title} {...item} index={index} />
        ))}
      </View>
      <View style={styles.poweredRow}>
        <Text style={styles.poweredText}>Powered by</Text>
        <Image source={PoweredByLogo} style={styles.poweredLogo} resizeMode="contain" />
      </View>
    </LinearGradient>
  </View>
);

const RecommendationsCard: FC = () => (
  <View style={styles.recommendationCard}>
    <LinearGradient colors={['#CFF0EA', '#7ECAC0']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.recommendationGradient}>
      <View style={styles.recommendationContent}>
        <View style={styles.recommendationLeft}>
          <Text style={styles.recommendationSuper}>{`SUPER\nPTN!`}</Text>
          <View style={styles.recommendationCodeWrapper}>
            <View style={styles.recommendationCodeLabel}>
              <PromoIcon width={36} height={36} />
              <Text style={styles.recommendationCodeLabelText}>{`KODE\nPROMO`}</Text>
            </View>
            <View style={styles.recommendationCodeBadge}>
              <Text style={styles.recommendationCodeText}>SUPERPTN</Text>
            </View>
          </View>
        </View>
        <View style={styles.recommendationRight}>
          <Text style={styles.recommendationDiscount}>30%</Text>
          <Text style={styles.recommendationSuffix}>off</Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

const RecommendationCarouselIndicators: FC = () => (
  <View style={styles.recommendationDots}>
    <CarouselDotActiveIcon width={10} height={10} />
    <CarouselDotIcon width={10} height={10} />
    <CarouselDotIcon width={10} height={10} />
  </View>
);

const SectionHeader: FC<{ title: string; cta?: string; centered?: boolean }> = ({ title, cta, centered }) => (
  <View style={[styles.sectionHeader, centered && styles.sectionHeaderCentered]}>
    <Text style={[styles.sectionTitle, centered && styles.sectionTitleCentered]}>{title}</Text>
    {cta ? <Text style={styles.sectionCta}>{cta}</Text> : null}
  </View>
);

const LeaderboardSection: FC = () => {
  const orderedEntries = leaderboardDisplayOrder
    .map((rank) => leaderboardEntries.find((entry) => entry.rank === rank))
    .filter((entry): entry is LeaderboardEntry => Boolean(entry));

  return (
    <View style={styles.leaderboardCard}>
      <View style={styles.leaderboardColumns}>
        {orderedEntries.map((entry) => (
          <LeaderboardColumn key={entry.rank} {...entry} />
        ))}
      </View>
      <Pressable style={styles.leaderboardButton}>
        <Text style={styles.leaderboardButtonText}>Cek Erbe Leaderboard</Text>
      </Pressable>
    </View>
  );
};

const LifeAtErbeSection: FC = () => (
  <View style={styles.lifeRow}>
    {lifeAtErbeCards.map((card) => (
      <LifeCard key={card.title} {...card} />
    ))}
  </View>
);

const LiterasikSection: FC = () => (
  <View style={styles.literasikRow}>
    {literasikCards.map((card, index) => (
      <LiterasikCard key={`${card.title}-${index}`} {...card} />
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
      <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
        <HomescreenHeader />
        <View style={styles.sectionSpacing}>
          <SectionHeader title="See Our Recommendations" cta="Selengkapnya" />
          <RecommendationsCard />
          <RecommendationCarouselIndicators />
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Leaderboard" centered />
          <LeaderboardSection />
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Life at Erbe" centered />
          <LifeAtErbeSection />
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Literasik" cta="Cek Lainnya" />
          <LiterasikSection />
        </View>
        <AdminCard />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flex: 1,
    marginRight: 16,
    shadowColor: '#004559',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(0,0,0,0.8)',
    fontFamily: fontFamilies.medium,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 24,
    justifyContent: 'center',
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendationLeft: {
    flex: 1,
  },
  recommendationSuper: {
    fontSize: 25,
    color: colors.white,
    textShadowColor: colors.primary,
    textShadowRadius: 0,
    textShadowOffset: { width: 3, height: 3 },
    fontFamily: fontFamilies.extraBold,
  },
  recommendationDiscount: {
    fontSize: 54,
    color: colors.white,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 3, height: 3 },
    fontFamily: fontFamilies.extraBold,
  },
  recommendationSuffix: {
    fontSize: 15,
    color: colors.white,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    fontFamily: fontFamilies.bold,
    alignSelf: 'flex-end',
  },
  recommendationRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  recommendationCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
  },
  recommendationCodeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  recommendationCodeLabelText: {
    fontSize: 9,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fontFamilies.bold,
  },
  recommendationCodeBadge: {
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  recommendationCodeText: {
    fontSize: 13,
    color: colors.white,
    fontFamily: fontFamilies.bold,
  },
  recommendationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
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
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-end',
  },
  leaderboardColumn: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 112,
    marginHorizontal: 4,
    justifyContent: 'flex-end',
  },
  leaderboardColumnLeader: {
    marginBottom: 0,
    transform: [{ translateY: -10 }],
    zIndex: 2,
  },
  leaderboardColumnChallenger: {
    marginTop: 16,
  },
  leaderboardGradient: {
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    position: 'relative',
  },
  leaderboardGradientLeader: {
    height: 180,
  },
  leaderboardGradientChallenger: {
    height: 150,
  },
  leaderboardRankPill: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leaderboardMedal: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 75,
    position: 'relative',
  },
  leaderboardRankText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  leaderboardAvatar: {
    position: 'absolute',
    width: 58,
    height: 58,
    top: 8,
    borderRadius: 29,
    borderWidth: 4,
    borderColor: colors.white,
  },
  leaderboardMeta: {
    alignItems: 'center',
    marginTop: 12,
  },
  leaderboardName: {
    fontSize: 14,
    color: colors.darkText,
    fontFamily: fontFamilies.semiBold,
  },
  leaderboardGrade: {
    fontSize: 10,
    color: '#617283',
    marginTop: 4,
    fontFamily: fontFamilies.semiBold,
  },
  leaderboardScore: {
    fontSize: 16,
    marginTop: 12,
    fontFamily: fontFamilies.bold,
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
  lifeRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lifeCard: {
    alignItems: 'center',
    width: 82,
    borderRadius: 15,
    paddingVertical: 12,
  },
  lifeCardImage: {
    width: 64,
    height: 64,
  },
  lifeCardTitle: {
    marginTop: 10,
    fontSize: 12,
    color: colors.sectionTitle,
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
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
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