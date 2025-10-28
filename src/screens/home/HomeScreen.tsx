import React, { FC, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

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

const svgAssets = {
  search: 'http://10.0.2.2:3845/assets/f7f0dc22c9b9602acb60bfe30b7e41f27cd0d12b.svg',
  notification: 'http://10.0.2.2:3845/assets/49c36e52ab0a5681320f5698a3a206404d2e026c.svg',
  recommendations: 'http://10.0.2.2:3845/assets/16a2c4e5b5d54dc0aba781452be9c22b5d527668.svg',
  leaderboardSlot1: 'http://10.0.2.2:3845/assets/3780f0853b87cf6bcfc573344afee361875cbf6b.svg',
  leaderboardSlot2: 'http://10.0.2.2:3845/assets/cd1d69bab0fba009f02e67c19da50b34dea86ed3.svg',
  leaderboardSlot3: 'http://10.0.2.2:3845/assets/98d976360b447f05f0bc7fb55505d91528c4ed62.svg',
  arrowRight: 'http://10.0.2.2:3845/assets/303884bbebac8a4731e3cb61cc65a0d5b7384acc.svg',
  navHome: 'http://10.0.2.2:3845/assets/c726690482855c6d88c6e283539e029272a67038.svg',
  navAnalysis: 'http://10.0.2.2:3845/assets/da4c47e1d588f767e532f0998599df7e85a6e067.svg',
  navWallet: 'http://10.0.2.2:3845/assets/cd1d69bab0fba009f02e67c19da50b34dea86ed3.svg',
  navProfile: 'http://10.0.2.2:3845/assets/d4a265aad65890f79ceb182b69b8252a04d7bdbd.svg',
};

const rasterImages = {
  avatar: 'http://10.0.2.2:3845/assets/51ad82a6f14baa088dad217f874e47606c5c00a6.png',
  poweredLogo: 'http://10.0.2.2:3845/assets/12313bf145d987dc0516e6d9c533797bc743e7c2.png',
  weekly: 'http://10.0.2.2:3845/assets/6b59a3c8d22878946d5ddb8f2d8ba256efb171d4.png',
  tryOut: 'http://10.0.2.2:3845/assets/1c22dbacc2c0394f329214f0c02ceddc369359a5.png',
  avatar1: 'http://10.0.2.2:3845/assets/6b21d479f4905b231785e65fb75b12ae6f2d353a.png',
  avatar2: 'http://10.0.2.2:3845/assets/1a0543c993968f63085e4c1f1bde11b9e9afd99c.png',
  avatar3: 'http://10.0.2.2:3845/assets/5aca32bd9bcd92427c37c620d1ca71cb62c71a49.png',
  snackBt: 'http://10.0.2.2:3845/assets/0f63affea49a950f5e9a19c100a775ecf9505aa6.png',
  poke: 'http://10.0.2.2:3845/assets/31de013732322eeb6f0146157ed1c22b2a93472a.png',
  imEng: 'http://10.0.2.2:3845/assets/e18fcbc90269beb3e596d30f9d44ef5376933e6d.png',
  materi: 'http://10.0.2.2:3845/assets/2299b8e7f2bd00ef68f6652ec24c62ff1036314d.png',
  literasik: 'http://10.0.2.2:3845/assets/2eef3da1172f2a3617dfabba39336092b19ca210.png',
  admin: 'http://10.0.2.2:3845/assets/c620c8792e7c15c01b319237bf9b204b85ac0503.png',
};

const leaderboardGradients: Record<number, [string, string]> = {
  1: ['#CCF3ED', '#7FC9BA'],
  2: ['#B8E5DE', '#62BCAE'],
  3: ['#B8E5DE', '#62BCAE'],
};

const navItems = [
  { key: 'home', label: 'Home', icon: svgAssets.navHome, active: true },
  { key: 'analysis', label: 'Analysis', icon: svgAssets.navAnalysis, active: false },
  { key: 'wallet', label: 'Wallet', icon: svgAssets.navWallet, active: false },
  { key: 'profile', label: 'Profile', icon: svgAssets.navProfile, active: false },
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
  image: string;
};

const quickActions: QuickAction[] = [
  { title: "Let's DIGIDAW", image: rasterImages.weekly },
  { title: "Let's Try Out", image: rasterImages.tryOut },
];

type LeaderboardEntry = {
  name: string;
  grade: string;
  score: number;
  rank: number;
  avatar: string;
  badge: string;
  scoreColor: string;
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    name: 'Gitaak',
    grade: '9 SMP',
    score: 981,
    rank: 1,
    avatar: rasterImages.avatar1,
    badge: svgAssets.leaderboardSlot1,
    scoreColor: '#EF0F0F',
  },
  {
    name: 'Fikri',
    grade: '12 SMA',
    score: 865,
    rank: 2,
    avatar: rasterImages.avatar2,
    badge: svgAssets.leaderboardSlot2,
    scoreColor: colors.accent,
  },
  {
    name: 'Aldo',
    grade: '8 SMP',
    score: 546,
    rank: 3,
    avatar: rasterImages.avatar3,
    badge: svgAssets.leaderboardSlot3,
    scoreColor: colors.primary,
  },
];

const lifeAtErbeCards = [
  { title: 'SNack-BT', image: rasterImages.snackBt, backgroundColor: '#FFEDD2' },
  { title: 'PoKe', image: rasterImages.poke, backgroundColor: '#CDFEE2' },
  { title: 'ImEng', image: rasterImages.imEng, backgroundColor: '#F6C2DB' },
  { title: 'Materi', image: rasterImages.materi, backgroundColor: '#E0F5FF' },
];

const literasikCards = [
  {
    title: '5 Cara Upgrade Skill\nTanpa Stuck Lama-Lama',
    description:
      'Pernah ga sih kamu coba konsisten belajar tapi ngerasa kemampuan kamu stuck di situ-situ aja? Kadang penyebabnya...',
    tag: 'Tips Belajar',
  },
  {
    title: '5 Cara Upgrade Skill\nTanpa Stuck Lama-Lama',
    description:
      'Pernah ga sih kamu coba konsisten belajar tapi ngerasa kemampuan kamu stuck di situ-situ aja? Kadang penyebabnya...',
    tag: 'Tips Belajar',
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
    <Image source={{ uri: image }} style={styles.quickActionImage} resizeMode="contain" />
    <Text style={styles.quickActionLabel}>{title}</Text>
  </Pressable>
);

const LeaderboardColumn: FC<LeaderboardEntry> = ({ name, grade, score, rank, avatar, badge, scoreColor }) => {
  const gradient = leaderboardGradients[rank] ?? leaderboardGradients[2];

  return (
    <View style={styles.leaderboardColumn}>
      <LinearGradient colors={gradient} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.leaderboardGradient}>
        <View style={styles.leaderboardBadgeWrapper}>
          <View style={styles.leaderboardBadge}>
            <SvgUri uri={badge} width="100%" height="100%" />
          </View>
          <View style={styles.leaderboardRankBadge}>
            <Text style={styles.leaderboardRankText}>{rank}</Text>
          </View>
        </View>
        <Image source={{ uri: avatar }} style={styles.leaderboardAvatar} resizeMode="contain" />
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
    <Image source={{ uri: image }} style={styles.lifeCardImage} resizeMode="contain" />
    <Text style={styles.lifeCardTitle}>{title}</Text>
  </View>
);

const LiterasikCard: FC<(typeof literasikCards)[number]> = ({ title, description, tag }) => (
  <View style={styles.literasikCard}>
    <View style={styles.literasikBadge}>
      <Text style={styles.literasikBadgeText}>{tag}</Text>
    </View>
    <Image source={{ uri: rasterImages.literasik }} style={styles.literasikImage} resizeMode="contain" />
    <Text style={styles.literasikTitle}>{title}</Text>
    <Text style={styles.literasikDescription}>{description}</Text>
    <View style={styles.literasikFooter}>
      <View style={styles.literasikArrow}>
        <SvgUri uri={svgAssets.arrowRight} width="100%" height="100%" />
      </View>
      <Text style={styles.literasikLink}>Lanjutkan Baca</Text>
    </View>
  </View>
);

const AdminCard: FC = () => (
  <View style={styles.adminCard}>
    <LinearGradient colors={['#004559', colors.greenLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.adminGradient}>
      <Image source={{ uri: rasterImages.admin }} style={styles.adminImage} resizeMode="contain" />
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

const BottomNavigation: FC = () => (
  <View style={styles.bottomNav}>
    {navItems.map(({ key, label, icon, active }) => (
      <Pressable key={key} style={[styles.bottomNavItem, active && styles.bottomNavActive]}>
        <View style={styles.bottomNavIcon}>
          <SvgUri uri={icon} width="100%" height="100%" />
        </View>
        <Text style={active ? styles.bottomNavLabel : styles.bottomNavLabelMuted}>{label}</Text>
      </Pressable>
    ))}
  </View>
);

const HomescreenHeader: FC = () => (
  <View style={styles.heroWrapper}>
    <LinearGradient colors={['#1C637B', '#9EE0BF']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.heroContainer}>
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>Mau belajar apa nih?</Text>
          <View style={styles.searchIcon}>
            <SvgUri uri={svgAssets.search} width="100%" height="100%" />
          </View>
        </View>
        <Pressable style={styles.notificationButton}>
          <View style={styles.notificationIcon}>
            <SvgUri uri={svgAssets.notification} width="100%" height="100%" />
          </View>
        </Pressable>
      </View>
      <View style={styles.profileRow}>
        <Image source={{ uri: rasterImages.avatar }} style={styles.profileAvatar} resizeMode="contain" />
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
        <Image source={{ uri: rasterImages.poweredLogo }} style={styles.poweredLogo} resizeMode="contain" />
      </View>
    </LinearGradient>
  </View>
);

const RecommendationsCard: FC = () => (
  <View style={styles.recommendationCard}>
    <View style={styles.recommendationImage}>
      <SvgUri uri={svgAssets.recommendations} width="100%" height="100%" />
      <View style={styles.recommendationOverlay}>
        <Text style={styles.recommendationSuper}>{`SUPER\nPTN!`}</Text>
        <Text style={styles.recommendationDiscount}>30%</Text>
        <Text style={styles.recommendationSuffix}>off</Text>
        <View style={styles.recommendationCodeWrapper}>
          <View style={styles.recommendationCodeLabel}>
            <Text style={styles.recommendationCodeLabelText}>{`KODE\nPROMO`}</Text>
          </View>
          <View style={styles.recommendationCodeBadge}>
            <Text style={styles.recommendationCodeText}>SUPERPTN</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const SectionHeader: FC<{ title: string; cta?: string }> = ({ title, cta }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {cta ? <Text style={styles.sectionCta}>{cta}</Text> : null}
  </View>
);

const LeaderboardSection: FC = () => (
  <View style={styles.leaderboardCard}>
    <View style={styles.leaderboardColumns}>
      {leaderboardEntries.map((entry) => (
        <LeaderboardColumn key={entry.rank} {...entry} />
      ))}
    </View>
    <Pressable style={styles.leaderboardButton}>
      <Text style={styles.leaderboardButtonText}>Cek Erbe Leaderboard</Text>
    </Pressable>
  </View>
);

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
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Leaderboard" />
          <LeaderboardSection />
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Life at Erbe" />
          <LifeAtErbeSection />
        </View>
        <View style={styles.sectionSpacing}>
          <SectionHeader title="Literasik" cta="Cek Lainnya" />
          <LiterasikSection />
        </View>
        <AdminCard />
      </ScrollView>
      <BottomNavigation />
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
  searchIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 24,
    height: 24,
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
  sectionTitle: {
    fontSize: 15,
    color: colors.sectionTitle,
    fontFamily: fontFamilies.bold,
  },
  sectionCta: {
    fontSize: 12,
    color: colors.accent,
    fontFamily: fontFamilies.bold,
  },
  recommendationCard: {
    marginTop: 20,
  },
  recommendationImage: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 157,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  recommendationOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 20,
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
    position: 'absolute',
    right: 60,
    top: 30,
    fontSize: 50,
    color: colors.white,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 3, height: 3 },
    fontFamily: fontFamilies.extraBold,
  },
  recommendationSuffix: {
    position: 'absolute',
    right: 40,
    bottom: 32,
    fontSize: 15,
    color: colors.white,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
    fontFamily: fontFamilies.bold,
  },
  recommendationCodeWrapper: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendationCodeLabel: {
    width: 60,
    height: 31,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  recommendationCodeLabelText: {
    fontSize: 9,
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fontFamilies.bold,
  },
  recommendationCodeBadge: {
    height: 31,
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
  },
  leaderboardColumn: {
    alignItems: 'center',
    width: 112,
  },
  leaderboardGradient: {
    width: '100%',
    height: 160,
    borderRadius: 40,
    alignItems: 'center',
    paddingTop: 34,
    paddingBottom: 16,
  },
  leaderboardBadgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardBadge: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardRankBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardRankText: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  leaderboardAvatar: {
    width: 68,
    height: 68,
    marginTop: 8,
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
  literasikArrow: {
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 63,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingHorizontal: 30,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingTop: 8,
  },
  bottomNavActive: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  bottomNavIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavLabel: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamilies.bold,
  },
  bottomNavLabelMuted: {
    color: '#617283',
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
  },
});

// NOVA'S DEV NOTES:
// 1. Integrated Montserrat + Playpen Sans through expo-font and gated initial paint behind SplashScreen to avoid fallback flicker.
// 2. Recreated hero, leaderboard, and admin modules with expo-linear-gradient so the mobile UI mirrors the Figma depth and soft edges.
// 3. Applied consistent typography + spacing tokens while keeping sections modular for upcoming data, navigation, and analytics hooks.
