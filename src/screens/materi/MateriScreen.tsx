import React, { FC, useMemo } from 'react';
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
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { getCategoryIcon, getLearningCategories, type LearningCategory } from '../../data/learningCategories';

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MateriScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();
  const categories = useMemo<LearningCategory[]>(() => getLearningCategories(), []);
  const categoryIcon = useMemo(() => getCategoryIcon(), []);

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding],
  );
  const sectionSpacing = useMemo(
    () => clamp(layout.sectionSpacing * 0.6, 18, 26),
    [layout.sectionSpacing],
  );
  const cardGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 10, 16),
    [layout.horizontalPadding],
  );
  const cardPaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding * 0.9, 18, 26),
    [layout.horizontalPadding],
  );
  const cardPaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 12, 18),
    [layout.horizontalPadding],
  );
  const cardIconSize = useMemo(
    () => clamp(layout.horizontalPadding * 1.9, 36, 46),
    [layout.horizontalPadding],
  );
  const cardRadius = useMemo(() => clamp(cardIconSize * 0.45, 16, 20), [cardIconSize]);
  const contentWidth = layout.contentWidth;
  const innerWidth = layout.innerContentWidth;
  const cardWidth = useMemo(() => {
    const totalGap = cardGap;
    const columns = 2;
    return clamp((innerWidth - totalGap) / columns, 130, innerWidth);
  }, [innerWidth, cardGap]);

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
        <View style={[styles.headerWrapper, { width: contentWidth }]}>
          <AppHeader title="Materi" contentHorizontalPadding={contentHorizontalPadding} />
        </View>
        <View
          style={[
            styles.contentWrapper,
            {
              width: contentWidth,
              paddingHorizontal: contentHorizontalPadding,
              marginTop: sectionSpacing,
              rowGap: sectionSpacing,
              gap: sectionSpacing,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Rangkuman Materi</Text>
          <View style={[styles.cardGrid, { columnGap: cardGap, rowGap: cardGap, gap: cardGap }]}>
            {categories.map((category, index) => (
              <Pressable
                key={category.id}
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    paddingHorizontal: cardPaddingHorizontal,
                    paddingVertical: cardPaddingVertical,
                    borderRadius: cardRadius,
                    maxWidth: cardWidth,
                    flexBasis: cardWidth,
                    width: cardWidth,
                  },
                  index === categories.length - 1 ? styles.singleColumnCard : null,
                  pressed ? styles.categoryCardPressed : null,
                ]}
                onPress={() =>
                  navigation.navigate('MateriCategory', {
                    categoryId: category.id,
                    categoryTitle: category.title,
                  })
                }
                accessibilityRole="button"
                accessibilityLabel={`Buka materi ${category.title}`}
              >
                <View
                  style={[
                    styles.iconWrapper,
                    {
                      width: cardIconSize,
                      height: cardIconSize,
                      borderRadius: cardRadius * 0.8,
                    },
                  ]}
                >
                  <Image
                    source={categoryIcon}
                    style={{ width: cardIconSize * 0.68, height: cardIconSize * 0.68, tintColor: colors.white }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.cardLabel}>{category.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNavigation
        items={navItems}
        activeKey="home"
        backgroundColor={colors.white}
        activeColor={colors.primary}
        inactiveColor={colors.navInactive}
        style={styles.bottomNav}
      />
    </SafeAreaView>
  );
};

export default MateriScreen;

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
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  categoryCardPressed: {
    opacity: 0.92,
  },
  singleColumnCard: {
    alignSelf: 'flex-start',
  },
  iconWrapper: {
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLabel: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    color: colors.white,
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
