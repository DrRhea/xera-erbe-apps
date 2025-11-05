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
  useWindowDimensions,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies, spacing, radii } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';

// Import assets
import TryoutImage from '../../../assets/images/tryout.png';
import MateriImage from '../../../assets/images/materi.png';
import SearchBar from '../../components/SearchBar';

// ============================================================================
// TYPES
// ============================================================================

type SearchCategory = 'tryout' | 'materi' | 'digidaw';

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  image: any;
  category: SearchCategory;
  routeName?: keyof RootStackParamList;
  routeParams?: any;
};

// ============================================================================
// SAMPLE DATA
// ============================================================================

const tryoutResults: SearchResult[] = [
  {
    id: 'to-snbt-1',
    title: 'TO SNBT #1',
    subtitle: 'Subtes TO SNBT #1',
    image: TryoutImage,
    category: 'tryout',
    routeName: 'TryoutDesc',
    routeParams: {
      tryoutId: 'to-snbt-1',
      title: 'TO SNBT #1',
      dateLabel: '15 November 2024',
      statusLabel: 'Gratis',
      statusVariant: 'free' as const,
    },
  },
  {
    id: 'to-snbt-2',
    title: 'TO SNBT #2',
    subtitle: 'Subtes TO SNBT #2',
    image: TryoutImage,
    category: 'tryout',
    routeName: 'TryoutDesc',
    routeParams: {
      tryoutId: 'to-snbt-2',
      title: 'TO SNBT #2',
      dateLabel: '22 November 2024',
      statusLabel: 'Rp 25.000',
      statusVariant: 'paid' as const,
    },
  },
  {
    id: 'to-snbt-3',
    title: 'TO SNBT #3',
    subtitle: 'Subtes TO SNBT #3',
    image: TryoutImage,
    category: 'tryout',
    routeName: 'TryoutDesc',
    routeParams: {
      tryoutId: 'to-snbt-3',
      title: 'TO SNBT #3',
      dateLabel: '29 November 2024',
      statusLabel: 'Rp 35.000',
      statusVariant: 'paid' as const,
    },
  },
];

const digidawResults: SearchResult[] = [
  {
    id: 'digidaw-basic',
    title: 'DIGIDAW Basic',
    subtitle: 'Pelajari konsep dasar matematika',
    image: TryoutImage,
    category: 'digidaw',
    routeName: 'Digidaw',
    routeParams: {},
  },
  {
    id: 'digidaw-advanced',
    title: 'DIGIDAW Advanced',
    subtitle: 'Pelajari konsep lanjutan matematika',
    image: TryoutImage,
    category: 'digidaw',
    routeName: 'Digidaw',
    routeParams: {},
  },
];

const materiResults: SearchResult[] = [
  {
    id: 'matematika',
    title: 'Matematika',
    subtitle: 'Pelajari konsep dasar matematika',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'matematika',
      categoryTitle: 'Matematika',
    },
  },
  {
    id: 'bahasa-indonesia',
    title: 'Bahasa Indonesia',
    subtitle: 'Pelajari tata bahasa dan sastra',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'bahasa-indonesia',
      categoryTitle: 'Bahasa Indonesia',
    },
  },
  {
    id: 'bahasa-inggris',
    title: 'Bahasa Inggris',
    subtitle: 'Pelajari grammar dan vocabulary',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'bahasa-inggris',
      categoryTitle: 'Bahasa Inggris',
    },
  },
  {
    id: 'fisika',
    title: 'Fisika',
    subtitle: 'Pelajari hukum-hukum fisika',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'fisika',
      categoryTitle: 'Fisika',
    },
  },
  {
    id: 'kimia',
    title: 'Kimia',
    subtitle: 'Pelajari reaksi dan unsur kimia',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'kimia',
      categoryTitle: 'Kimia',
    },
  },
  {
    id: 'biologi',
    title: 'Biologi',
    subtitle: 'Pelajari ekosistem dan organisme',
    image: MateriImage,
    category: 'materi',
    routeName: 'MateriCategory',
    routeParams: {
      categoryId: 'biologi',
      categoryTitle: 'Biologi',
    },
  },
];

// ============================================================================
// RESPONSIVE LAYOUT HOOK
// ============================================================================

const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  const contentWidth = Math.min(width, 440);
  const horizontalPadding = Math.max((width - contentWidth) / 2 + spacing.xxl, spacing.xxl);
  const sectionSpacing = Math.max(spacing.xxl * 1.5, 24);

  // Search bar dimensions
  const searchBarHeight = 48;
  const searchBarPaddingHorizontal = Math.max(horizontalPadding * 0.8, 16);
  const searchIconSize = 20;

  // Toggle dimensions
  const toggleButtonWidth = Math.max((contentWidth - horizontalPadding * 2 - spacing.md * 2) / 3, 80);
  const toggleHeight = 36;

  // Result card dimensions
  const cardGap = Math.max(spacing.lg, 12);
  const cardPadding = Math.max(spacing.lg, 16);
  const cardImageSize = Math.max(cardPadding * 2, 48);
  const cardBorderRadius = Math.max(radii.lg, 12);

  return {
    screenWidth: width,
    contentWidth,
    horizontalPadding,
    sectionSpacing,
    searchBarHeight,
    searchBarPaddingHorizontal,
    searchIconSize,
    toggleButtonWidth,
    toggleHeight,
    cardGap,
    cardPadding,
    cardImageSize,
    cardBorderRadius,
  };
};

// ============================================================================
// COMPONENTS
// ============================================================================

type SearchResultCardProps = {
  result: SearchResult;
  layout: ReturnType<typeof useResponsiveLayout>;
  onPress: (result: SearchResult) => void;
};

const SearchResultCard: FC<SearchResultCardProps> = ({ result, layout, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(result);
  }, [result, onPress]);

  return (
    <Pressable
      style={[
        styles.resultCard,
        {
          padding: layout.cardPadding,
          borderRadius: layout.cardBorderRadius,
          marginBottom: layout.cardGap,
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Buka ${result.title}`}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {result.title}
        </Text>
        {result.subtitle && (
          <Text style={styles.resultSubtitle} numberOfLines={2}>
            {result.subtitle}
          </Text>
        )}
      </View>
      <Image
        source={result.image}
        style={[
          styles.resultImage,
          {
            width: layout.cardImageSize,
            height: layout.cardImageSize,
            borderRadius: layout.cardImageSize * 0.2,
          },
        ]}
        resizeMode="cover"
      />
    </Pressable>
  );
};

type CategoryToggleProps = {
  activeCategory: SearchCategory;
  onCategoryChange: (category: SearchCategory) => void;
  layout: ReturnType<typeof useResponsiveLayout>;
};

const CategoryToggle: FC<CategoryToggleProps> = ({ activeCategory, onCategoryChange, layout }) => {
  const handleTryoutPress = useCallback(() => {
    onCategoryChange('tryout');
  }, [onCategoryChange]);

  const handleMateriPress = useCallback(() => {
    onCategoryChange('materi');
  }, [onCategoryChange]);

  const handleDigidawPress = useCallback(() => {
    onCategoryChange('digidaw');
  }, [onCategoryChange]);

  return (
    <View
      style={[
        styles.toggleContainer,
        {
          width: layout.contentWidth - layout.horizontalPadding * 2,
          marginBottom: layout.sectionSpacing,
        },
      ]}
    >
      <Pressable
        style={[
          styles.toggleButton,
          {
            width: layout.toggleButtonWidth,
            height: layout.toggleHeight,
          },
          activeCategory === 'tryout' && styles.toggleButtonActive,
        ]}
        onPress={handleTryoutPress}
        accessibilityRole="button"
        accessibilityLabel="Cari Tryout"
        accessibilityState={{ selected: activeCategory === 'tryout' }}
      >
        <Text
          style={[
            styles.toggleText,
            activeCategory === 'tryout' && styles.toggleTextActive,
          ]}
        >
          Tryout
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.toggleButton,
          {
            width: layout.toggleButtonWidth,
            height: layout.toggleHeight,
          },
          activeCategory === 'materi' && styles.toggleButtonActive,
        ]}
        onPress={handleMateriPress}
        accessibilityRole="button"
        accessibilityLabel="Cari Materi"
        accessibilityState={{ selected: activeCategory === 'materi' }}
      >
        <Text
          style={[
            styles.toggleText,
            activeCategory === 'materi' && styles.toggleTextActive,
          ]}
        >
          Materi
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.toggleButton,
          {
            width: layout.toggleButtonWidth,
            height: layout.toggleHeight,
          },
          activeCategory === 'digidaw' && styles.toggleButtonActive,
        ]}
        onPress={handleDigidawPress}
        accessibilityRole="button"
        accessibilityLabel="Cari Digidaw"
        accessibilityState={{ selected: activeCategory === 'digidaw' }}
      >
        <Text
          style={[
            styles.toggleText,
            activeCategory === 'digidaw' && styles.toggleTextActive,
          ]}
        >
          Digidaw
        </Text>
      </Pressable>
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SearchScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();

  const [activeCategory, setActiveCategory] = useState<SearchCategory>('tryout');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleResultPress = useCallback(
    (result: SearchResult) => {
      if (result.routeName && result.routeParams) {
        navigation.navigate(result.routeName, result.routeParams);
      }
    },
    [navigation]
  );

  const filteredResults = useMemo(() => {
    let allResults: SearchResult[];
    if (activeCategory === 'tryout') {
      allResults = tryoutResults;
    } else if (activeCategory === 'materi') {
      allResults = materiResults;
    } else {
      allResults = digidawResults;
    }

    if (!searchQuery.trim()) {
      return allResults;
    }

    const query = searchQuery.toLowerCase();
    return allResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(query))
    );
  }, [activeCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader
          title=""
          contentHorizontalPadding={layout.horizontalPadding}
          onNotificationPress={handleNotificationPress}
          showBackButton={true}
          customContent={
            <View style={styles.searchBarWrapper}>
              <SearchBar
                placeholder="Cari tryout atau materi..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          }
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: layout.horizontalPadding,
            paddingBottom: layout.sectionSpacing * 2,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >


        <CategoryToggle
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          layout={layout}
        />

        <View style={styles.resultsContainer}>
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <SearchResultCard
                key={result.id}
                result={result}
                layout={layout}
                onPress={handleResultPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery.trim()
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : `Belum ada ${activeCategory === 'tryout' ? 'tryout' : activeCategory === 'materi' ? 'materi' : 'digidaw'} tersedia`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
  searchBarWrapper: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: colors.primaryDark,
  },
  toggleTextActive: {
    color: colors.white,
  },
  resultsContainer: {
    width: '100%',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultImage: {
    marginLeft: spacing.lg,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: colors.mutedText,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: fontFamilies.medium,
    color: colors.mutedText,
    textAlign: 'center',
  },
});

export default SearchScreen;