import React, { FC, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import PromotionBanner from '../../components/PromotionBanner';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { getUpcomingTryouts, type TryoutItem } from '../../data/promotionData';

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

const upcomingTryouts: TryoutItem[] = getUpcomingTryouts();

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PromotionScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleUpcomingCardPress = useCallback(
    (tryout: any) => {
      navigation.navigate('TryoutDesc', {
        tryoutId: tryout.id,
        title: tryout.title,
        dateLabel: tryout.dateLabel,
        statusLabel: tryout.statusLabel,
        statusVariant: tryout.statusVariant,
      });
    },
    [navigation]
  );

  const iconWrapperSize = useMemo(() => clamp(layout.horizontalPadding * 2.4, 46, 58), [layout.horizontalPadding]);
  const iconImageSize = useMemo(() => clamp(iconWrapperSize * 0.85, 36, 50), [iconWrapperSize]);
  const actionBadgePaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding * 0.55, 14, 18),
    [layout.horizontalPadding]
  );
  const actionBadgePaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.35, 6, 8),
    [layout.horizontalPadding]
  );
  const upcomingCardPadding = useMemo(
    () => clamp(layout.horizontalPadding * 0.95, 18, 26),
    [layout.horizontalPadding]
  );
  const upcomingCardGap = useMemo(() => clamp(layout.horizontalPadding * 0.5, 12, 18), [layout.horizontalPadding]);
  const upcomingBadgePaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 12, 18),
    [layout.horizontalPadding]
  );
  const upcomingBadgePaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.25, 4, 8),
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
            paddingBottom: Math.max(layout.sectionSpacing * 2, 100),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
          <AppHeader
            title="Promosi"
            contentHorizontalPadding={layout.horizontalPadding}
            onNotificationPress={handleNotificationPress}
          />
        </View>

        <View
          style={[
            styles.contentWrapper,
            {
              width: layout.contentWidth,
              paddingHorizontal: layout.horizontalPadding,
              marginTop: layout.sectionSpacing,
              gap: layout.sectionSpacing,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Promosi Terbaru</Text>

          <PromotionBanner
            layout={{
              screenWidth: layout.screenWidth,
              horizontalPadding: layout.horizontalPadding,
              recommendationPaddingHorizontal: layout.recommendationPaddingHorizontal,
              recommendationPaddingVertical: layout.recommendationPaddingVertical,
            }}
            badgeText={`SUPER\nPTN!`}
            discountText="30%"
            suffixText="off"
            promoCode="SUPERPTN"
            codeLabel={`KODE\nPROMO`}
          />

          <PromotionBanner
            layout={{
              screenWidth: layout.screenWidth,
              horizontalPadding: layout.horizontalPadding,
              recommendationPaddingHorizontal: layout.recommendationPaddingHorizontal,
              recommendationPaddingVertical: layout.recommendationPaddingVertical,
            }}
            badgeText={`DISKON\n50%!`}
            discountText="50%"
            suffixText="off"
            promoCode="DISKON50"
            codeLabel={`KODE\nPROMO`}
          />

          {/* ==== Tambahan: List Try Out SNBT ==== */}
          <View style={{ marginTop: layout.sectionSpacing }}>
            <Text style={styles.sectionTitle}>Try Out SNBT</Text>
            <View style={{ rowGap: upcomingCardGap }}>
              {upcomingTryouts.map((tryout) => (
                <Pressable
                  key={tryout.id}
                  onPress={() => handleUpcomingCardPress(tryout)}
                  style={[styles.upcomingCard, { padding: upcomingCardPadding }]}
                >
                  <View
                    style={[
                      styles.upcomingIconWrapper,
                      { width: iconWrapperSize + 6, height: iconWrapperSize + 6 },
                    ]}
                  >
                    <Image
                      source={tryoutCardImage}
                      style={{ width: iconImageSize + 8, height: iconImageSize + 8 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.upcomingMeta}>
                    <View
                      style={[
                        styles.statusBadge,
                        tryout.statusVariant === 'free' ? styles.statusBadgeFree : styles.statusBadgePaid,
                        {
                          paddingHorizontal: upcomingBadgePaddingHorizontal,
                          paddingVertical: upcomingBadgePaddingVertical,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          tryout.statusVariant === 'free' ? styles.statusBadgeTextFree : styles.statusBadgeTextPaid,
                        ]}
                      >
                        {tryout.statusLabel}
                      </Text>
                    </View>
                    <Text style={styles.upcomingTitle}>{tryout.title}</Text>
                    <Text style={styles.upcomingDate}>{tryout.dateLabel}</Text>
                  </View>
                  <View
                    style={[
                      styles.upcomingCta,
                      {
                        paddingHorizontal: actionBadgePaddingHorizontal,
                        paddingVertical: actionBadgePaddingVertical,
                      },
                    ]}
                  >
                    <Text style={styles.upcomingCtaLabel}>Daftar Sekarang</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
          {/* ===================================== */}
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
  sectionTitle: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.sectionTitle,
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
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  upcomingIconWrapper: {
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upcomingMeta: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    marginBottom: 6,
  },
  statusBadgeFree: {
    backgroundColor: '#C2FFCF',
  },
  statusBadgePaid: {
    backgroundColor: '#C2DFFF',
  },
  statusBadgeText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 10,
  },
  statusBadgeTextFree: {
    color: '#065900',
  },
  statusBadgeTextPaid: {
    color: colors.sectionTitle,
  },
  upcomingTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
  },
  upcomingDate: {
    marginTop: 2,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  upcomingCta: {
    marginLeft: 18,
    backgroundColor: colors.accent,
    borderRadius: 14,
  },
  upcomingCtaLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    color: colors.white,
    textAlign: 'center',
  },
});

export default PromotionScreen;
