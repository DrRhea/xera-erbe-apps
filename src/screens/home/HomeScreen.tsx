import React, { FC } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const colors = {
  background: '#F0F0F0',
  primary: '#015876',
  accent: '#FF8725',
  white: '#FFFFFF',
  darkText: '#202020',
  mutedText: '#7C7C7C',
  sectionTitle: '#004559',
};

const images = {
  search: 'http://10.0.2.2:3845/assets/f7f0dc22c9b9602acb60bfe30b7e41f27cd0d12b.svg',
  notification: 'http://10.0.2.2:3845/assets/49c36e52ab0a5681320f5698a3a206404d2e026c.svg',
  avatar: 'http://10.0.2.2:3845/assets/51ad82a6f14baa088dad217f874e47606c5c00a6.png',
  poweredLogo: 'http://10.0.2.2:3845/assets/12313bf145d987dc0516e6d9c533797bc743e7c2.png',
  weekly: 'http://10.0.2.2:3845/assets/6b59a3c8d22878946d5ddb8f2d8ba256efb171d4.png',
  tryOut: 'http://10.0.2.2:3845/assets/1c22dbacc2c0394f329214f0c02ceddc369359a5.png',
  recommendations: 'http://10.0.2.2:3845/assets/16a2c4e5b5d54dc0aba781452be9c22b5d527668.svg',
  leaderboardSlot1: 'http://10.0.2.2:3845/assets/3780f0853b87cf6bcfc573344afee361875cbf6b.svg',
  leaderboardSlot2: 'http://10.0.2.2:3845/assets/cd1d69bab0fba009f02e67c19da50b34dea86ed3.svg',
  leaderboardSlot3: 'http://10.0.2.2:3845/assets/98d976360b447f05f0bc7fb55505d91528c4ed62.svg',
  avatar1: 'http://10.0.2.2:3845/assets/6b21d479f4905b231785e65fb75b12ae6f2d353a.png',
  avatar2: 'http://10.0.2.2:3845/assets/1a0543c993968f63085e4c1f1bde11b9e9afd99c.png',
  avatar3: 'http://10.0.2.2:3845/assets/5aca32bd9bcd92427c37c620d1ca71cb62c71a49.png',
  snackBt: 'http://10.0.2.2:3845/assets/0f63affea49a950f5e9a19c100a775ecf9505aa6.png',
  poke: 'http://10.0.2.2:3845/assets/31de013732322eeb6f0146157ed1c22b2a93472a.png',
  imEng: 'http://10.0.2.2:3845/assets/e18fcbc90269beb3e596d30f9d44ef5376933e6d.png',
  materi: 'http://10.0.2.2:3845/assets/2299b8e7f2bd00ef68f6652ec24c62ff1036314d.png',
  literasik: 'http://10.0.2.2:3845/assets/2eef3da1172f2a3617dfabba39336092b19ca210.png',
  admin: 'http://10.0.2.2:3845/assets/c620c8792e7c15c01b319237bf9b204b85ac0503.png',
  arrowRight: 'http://10.0.2.2:3845/assets/303884bbebac8a4731e3cb61cc65a0d5b7384acc.svg',
  heroMask: 'http://10.0.2.2:3845/assets/33d93cd60300f92de488b143f8dbdc2e9b089754.svg',
};

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
  align: 'left' | 'right';
};

const quickActions: QuickAction[] = [
  { title: "Let's DIGIDAW", image: images.weekly, align: 'left' },
  { title: "Let's Try Out", image: images.tryOut, align: 'right' },
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
    avatar: images.avatar1,
    badge: images.leaderboardSlot1,
    scoreColor: '#EF0F0F',
  },
  {
    name: 'Fikri',
    grade: '12 SMA',
    score: 865,
    rank: 2,
    avatar: images.avatar2,
    badge: images.leaderboardSlot2,
    scoreColor: colors.accent,
  },
  {
    name: 'Aldo',
    grade: '8 SMP',
    score: 546,
    rank: 3,
    avatar: images.avatar3,
    badge: images.leaderboardSlot3,
    scoreColor: colors.primary,
  },
];

const lifeAtErbeCards = [
  { title: 'SNack-BT', image: images.snackBt, backgroundColor: '#FFEDD2' },
  { title: 'PoKe', image: images.poke, backgroundColor: '#CDFEE2' },
  { title: 'ImEng', image: images.imEng, backgroundColor: '#F6C2DB' },
  { title: 'Materi', image: images.materi, backgroundColor: '#E0F5FF' },
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
  const cappedProgress = Math.min(progress, 1);
  const overflow = Math.max(progress - 1, 0);

  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>{title}</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${cappedProgress * 100}%` }]} />
          {overflow > 0 && (
            <View style={[styles.progressOverflow, { width: `${overflow * 100}%` }]} />
          )}
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

const QuickActionCard: FC<QuickActionCardProps> = ({ title, image, align, index }) => (
  <Pressable key={`${title}-${index}`} style={styles.quickActionCard}>
    <Image
      source={{ uri: image }}
      style={[styles.quickActionImage, align === 'left' ? styles.quickImageLeft : styles.quickImageRight]}
      resizeMode="contain"
    />
    <Text style={[styles.quickActionLabel, align === 'left' ? styles.actionLabelLeft : styles.actionLabelRight]}>
      {title}
    </Text>
  </Pressable>
);

const LeaderboardColumn: FC<LeaderboardEntry> = ({ name, grade, score, rank, avatar, badge, scoreColor }) => (
  <View style={styles.leaderboardColumn}>
    <Image source={{ uri: badge }} style={styles.leaderboardBadge} resizeMode="contain" />
    <Image source={{ uri: avatar }} style={styles.leaderboardAvatar} resizeMode="contain" />
    <View style={styles.leaderboardRankBadge}>
      <Text style={styles.leaderboardRankText}>{rank}</Text>
    </View>
    <View style={styles.leaderboardMeta}>
      <Text style={styles.leaderboardName}>{name}</Text>
      <Text style={styles.leaderboardGrade}>{grade}</Text>
      <Text style={[styles.leaderboardScore, { color: scoreColor }]}>{score}</Text>
    </View>
  </View>
);

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
    <Image source={{ uri: images.literasik }} style={styles.literasikImage} resizeMode="contain" />
    <Text style={styles.literasikTitle}>{title}</Text>
    <Text style={styles.literasikDescription}>{description}</Text>
    <View style={styles.literasikFooter}>
      <Image source={{ uri: images.arrowRight }} style={styles.literasikArrow} resizeMode="contain" />
      <Text style={styles.literasikLink}>Lanjutkan Baca</Text>
    </View>
  </View>
);

const AdminCard: FC = () => (
  <View style={styles.adminCard}>
    <Image source={{ uri: images.admin }} style={styles.adminImage} resizeMode="contain" />
    <View style={styles.adminCopy}>
      <Text style={styles.adminTitle}>{'Tanya & Kepo Erbe!'}</Text>
      <Text style={styles.adminDescription}>
        Mau tau program belajar di erbe atau promo menarik paket belajar di erbe? Gas kepoin lewat chat admin erbe yaakkk
      </Text>
      <Pressable style={styles.adminButton}>
        <Text style={styles.adminButtonText}>Chat Admin</Text>
      </Pressable>
    </View>
  </View>
);

const BottomNavigation: FC = () => (
  <View style={styles.bottomNav}>
    <View style={[styles.bottomNavItem, styles.bottomNavActive]}>
      <View style={styles.bottomNavIndicator} />
      <Text style={styles.bottomNavLabel}>Home</Text>
    </View>
    <Text style={styles.bottomNavLabelMuted}>Analysis</Text>
    <Text style={styles.bottomNavLabelMuted}>Wallet</Text>
    <Text style={styles.bottomNavLabelMuted}>Profile</Text>
  </View>
);

const HomescreenHeader: FC = () => (
  <ImageBackground source={{ uri: images.heroMask }} style={styles.heroContainer} imageStyle={styles.heroImage}>
    <View style={styles.searchRow}>
      <View style={styles.searchBar}>
        <Text style={styles.searchPlaceholder}>Mau belajar apa nih?</Text>
        <Image source={{ uri: images.search }} style={styles.searchIcon} resizeMode="contain" />
      </View>
      <Pressable style={styles.notificationButton}>
        <Image source={{ uri: images.notification }} style={styles.notificationIcon} resizeMode="contain" />
      </Pressable>
    </View>
    <View style={styles.profileRow}>
      <Image source={{ uri: images.avatar }} style={styles.profileAvatar} resizeMode="contain" />
      <View style={styles.profileMeta}>
        <Text style={styles.profileGreeting}>Hi, Nataa!</Text>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>RBD0925015 - Idaman UI</Text>
        </View>
      </View>
    </View>
    <Text style={styles.heroHeadline}>Let’s Start Your Academic Era!</Text>
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
      <Image source={{ uri: images.poweredLogo }} style={styles.poweredLogo} resizeMode="contain" />
    </View>
  </ImageBackground>
);

const RecommendationsCard: FC = () => (
  <View style={styles.recommendationCard}>
    <ImageBackground source={{ uri: images.recommendations }} style={styles.recommendationImage}>
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
    </ImageBackground>
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
  return (
    <SafeAreaView style={styles.safeArea}>
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
  heroContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  heroImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
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
  },
  searchIcon: {
    width: 18,
    height: 18,
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
    fontWeight: '700',
    color: colors.white,
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
    fontWeight: '700',
    color: colors.white,
  },
  heroHeadline: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
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
    fontWeight: '700',
    color: colors.darkText,
    textAlign: 'center',
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
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: colors.accent,
  },
  progressOverflow: {
    position: 'absolute',
    right: -4,
    top: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: colors.accent,
  },
  progressValue: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  progressFooter: {
    fontSize: 9,
    color: colors.mutedText,
    textAlign: 'center',
  },
  progressFooterAccent: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
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
    overflow: 'hidden',
    gap: 12,
  },
  quickActionImage: {
    width: 46,
    height: 46,
  },
  quickImageLeft: {
    marginRight: 12,
  },
  quickImageRight: {
    marginRight: 12,
  },
  quickActionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  actionLabelLeft: {
    textAlign: 'left',
  },
  actionLabelRight: {
    textAlign: 'right',
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
    fontWeight: '600',
    color: colors.white,
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
    fontWeight: '700',
    color: colors.sectionTitle,
  },
  sectionCta: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  recommendationCard: {
    marginTop: 20,
  },
  recommendationImage: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    height: 157,
    justifyContent: 'flex-start',
  },
  recommendationSuper: {
    fontSize: 25,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: colors.primary,
    textShadowRadius: 0,
    textShadowOffset: { width: 3, height: 3 },
  },
  recommendationDiscount: {
    position: 'absolute',
    right: 60,
    top: 30,
    fontSize: 50,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: colors.accent,
    textShadowOffset: { width: 3, height: 3 },
  },
  recommendationSuffix: {
    position: 'absolute',
    right: 40,
    bottom: 32,
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 1, height: 1 },
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
    fontWeight: '700',
    textAlign: 'center',
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
    fontWeight: '700',
    color: colors.white,
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
  },
  leaderboardColumn: {
    alignItems: 'center',
    width: 110,
    paddingTop: 10,
  },
  leaderboardBadge: {
    width: 70,
    height: 75,
    marginBottom: -20,
  },
  leaderboardAvatar: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  leaderboardRankBadge: {
    position: 'absolute',
    top: 20,
    right: 38,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardRankText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  leaderboardMeta: {
    alignItems: 'center',
    marginTop: 8,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
  },
  leaderboardGrade: {
    fontSize: 10,
    color: '#617283',
    marginTop: 4,
  },
  leaderboardScore: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
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
    fontWeight: '700',
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
    fontWeight: '700',
    color: colors.sectionTitle,
  },
  literasikRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 16,
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
    fontWeight: '700',
    color: colors.white,
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
    fontWeight: '700',
    color: colors.sectionTitle,
  },
  literasikDescription: {
    marginTop: 8,
    fontSize: 9,
    color: colors.sectionTitle,
    lineHeight: 14,
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
  },
  literasikLink: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.sectionTitle,
  },
  adminCard: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: '#00BFAC',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 32,
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
    fontWeight: '700',
    color: colors.white,
  },
  adminDescription: {
    marginTop: 8,
    fontSize: 10,
    color: colors.white,
    lineHeight: 16,
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
    fontWeight: '700',
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
  },
  bottomNavActive: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    paddingTop: 6,
  },
  bottomNavIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginBottom: 4,
  },
  bottomNavLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomNavLabelMuted: {
    color: '#617283',
    fontSize: 12,
    fontWeight: '600',
  },
});

// NOVA'S DEV NOTES:
// 1. Homescreen is broken into composable pieces (header, cards, sections, bottom nav) to simplify later state integration.
// 2. Figma assets are consumed via Image URLs for quick visual parity checks; swap to local assets as they become available.
// 3. Gradients are simulated through the exported mask; replace with expo-linear-gradient when that package is introduced.
// 4. Components remain UI-only so we can wire real data sources and navigation actions in follow-up iterations.
