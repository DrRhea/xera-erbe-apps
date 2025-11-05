import React, { FC, useCallback } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
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

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const PromotionScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

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
});

export default PromotionScreen;