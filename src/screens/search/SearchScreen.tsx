import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import SearchBar from '../../components/SearchBar';
import { colors, fontFamilies, spacing } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { type SearchCategory, type SearchItem } from '../../data/searchData';
import api from '../../services/api';
import { snackbtService } from '../../services/snackbtService';
import { pokeService } from '../../services/pokeService';
import { imengService } from '../../services/imengService';

// Assets
import TryoutImage from '../../../assets/images/tryoutimage.png';
import MateriImage from '../../../assets/images/materi.png';
import DigidawImage from '../../../assets/images/digidaw.png';
import SnackbtImage from '../../../assets/images/snackbt.png';
import PokeImage from '../../../assets/images/poke.png';
import ImengImage from '../../../assets/images/imeng.png';

const SearchScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();
  const { width } = useWindowDimensions();
  
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('tryout');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.initialCategory) {
      setActiveCategory(route.params.initialCategory);
    }
  }, [route.params]);

  const fetchData = useCallback(async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = { search: searchQuery };
      let data: SearchItem[] = [];

      switch (activeCategory) {
        case 'tryout': {
          const res = await api.get('/tryout/packages', { params });
          data = res.data.map((item: any) => {
            let statusLabel = 'Berbayar';
            let statusVariant = 'paid';
            
            if (item.enrollmentType === 'open') {
                statusLabel = 'Gratis';
                statusVariant = 'free';
            } else if (item.enrollmentType === 'free_with_proof') {
                statusLabel = 'Gratis (Syarat)';
                statusVariant = 'free';
            }

            return {
              id: item.id,
              title: item.title,
              date: new Date(item.startsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
              free: statusVariant === 'free',
              statusLabel,
              routeName: 'TryoutDesc',
              routeParams: {
                tryoutId: item.id,
                title: item.title,
                dateLabel: new Date(item.startsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                statusLabel: statusLabel,
                statusVariant: statusVariant,
              },
            };
          });
          break;
        }
        case 'materi': {
          const res = await api.get('/materi', { params });
          data = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            date: 'Updated: ' + new Date(item.updatedAt).toLocaleDateString('id-ID'),
            free: true,
            routeName: 'MateriViewer',
            routeParams: {
              module: item,
              subjectTitle: item.subject?.name || 'Materi',
              categoryTitle: 'Materi',
            },
          }));
          break;
        }
        case 'digidaw': {
          const res = await api.get('/digidaw', { params });
          data = res.data.map((item: any) => ({
            id: item.id,
            title: item.name,
            date: 'Created: ' + new Date(item.createdAt).toLocaleDateString('id-ID'),
            free: true,
            routeName: 'DigidawQuestion',
            routeParams: {
               categoryId: item.categoryId,
               categoryTitle: 'Digidaw',
               subjectId: item.subjectId,
               subjectTitle: item.subjectName,
               moduleId: item.id,
               moduleTitle: item.name,
            },
          }));
          break;
        }
        case 'snackbt': {
           const res = await api.get('/snackbt', { params });
           data = res.data.map((item: any) => ({
             id: item.id,
             title: item.title,
             date: 'Created: ' + new Date(item.createdAt).toLocaleDateString('id-ID'),
             free: true,
             routeName: 'SnackbtQuestion',
             routeParams: {
               moduleId: item.id,
               moduleTitle: item.title,
               session: null, 
             },
           }));
           break;
        }
        case 'poke': {
           const res = await api.get('/poke', { params });
           data = res.data.map((item: any) => ({
             id: item.id,
             title: item.title,
             date: 'Created: ' + new Date(item.createdAt).toLocaleDateString('id-ID'),
             free: true,
             routeName: 'PokeQuestion',
             routeParams: {
               moduleId: item.id,
               moduleTitle: item.title,
               session: null,
             },
           }));
           break;
        }
        case 'imeng': {
           const res = await api.get('/imeng', { params });
           data = res.data.map((item: any) => ({
             id: item.id,
             title: item.title,
             date: 'Created: ' + new Date(item.createdAt).toLocaleDateString('id-ID'),
             free: true,
             routeName: 'ImEngQuestion',
             routeParams: {
               moduleId: item.id,
               moduleTitle: item.title,
               session: null,
             },
           }));
           break;
        }
        // Add other cases if needed
      }
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const getImageSource = (category: SearchCategory) => {
    switch (category) {
      case 'materi':
        return MateriImage;
      case 'digidaw':
        return DigidawImage;
      case 'snackbt':
        return SnackbtImage;
      case 'poke':
        return PokeImage;
      case 'imeng':
        return ImengImage;
      default:
        return TryoutImage;
    }
  };

  const safeNavigate = useCallback(function <T extends keyof RootStackParamList>(
    routeName: T,
    params?: RootStackParamList[T]
  ) {
    (navigation.navigate as any)(routeName, params);
  }, [navigation]);

  const handlePress = async (item: SearchItem) => {
    if (!item?.routeName) {
      return;
    }

    try {
      if (activeCategory === 'snackbt') {
        setLoading(true);
        const session = await snackbtService.startSession(item.id);
        setLoading(false);
        safeNavigate('SnackbtQuestion', { ...item.routeParams, session });
        return;
      }
      if (activeCategory === 'poke') {
        setLoading(true);
        const session = await pokeService.startSession(item.id);
        setLoading(false);
        safeNavigate('PokeQuestion', { ...item.routeParams, session });
        return;
      }
      if (activeCategory === 'imeng') {
        setLoading(true);
        const session = await imengService.startSession(item.id);
        setLoading(false);
        safeNavigate('ImEngQuestion', { ...item.routeParams, session });
        return;
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      setLoading(false);
      return;
    }

    safeNavigate(item.routeName as keyof RootStackParamList, item.routeParams);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[styles.headerWrapper, { width }]}>
        <AppHeader
          title="Search"
          contentHorizontalPadding={spacing.xl}
          showLogo={false}
          onNotificationPress={handleNotificationPress}
          showBackButton={true}
        />
        <View style={{ paddingHorizontal: spacing.xl, paddingBottom: 20, paddingTop: 20 }}>
          <SearchBar
            placeholder={`Cari ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryTabsContent}>
            {(['tryout', 'materi', 'digidaw', 'snackbt', 'poke', 'imeng'] as SearchCategory[]).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.tab, activeCategory === cat && styles.activeTab]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.tabText, activeCategory === cat && styles.activeTabText]}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : results.length > 0 ? (
            results.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.resultItem}
                onPress={() => handlePress(item)}
              >
                <Image source={getImageSource(activeCategory)} style={styles.resultImage} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  {activeCategory === 'tryout' && (
                    <>
                      <Text style={styles.resultDate}>{item.date}</Text>
                      <View style={[styles.badge, item.free ? styles.freeBadge : styles.paidBadge]}>
                        <Text style={[styles.badgeText, item.free ? styles.freeBadgeText : styles.paidBadgeText]}>
                          {item.statusLabel || (item.free ? 'Gratis' : 'Berbayar')}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            searchQuery.length > 0 && (
              <Text style={styles.noResultsText}>Tidak ada hasil ditemukan</Text>
            )
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerWrapper: {
    zIndex: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchBar: {
    width: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  categoryTabs: {
    marginTop: 10,
    marginBottom: 10,
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.xl,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: fontFamilies.medium,
    color: '#333',
  },
  activeTabText: {
    color: '#FFF',
  },
  resultsContainer: {
    padding: spacing.xl,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  resultTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  resultDate: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeBadge: {
    backgroundColor: '#E8F5E9',
  },
  paidBadge: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
  },
  freeBadgeText: {
    color: '#2E7D32',
  },
  paidBadgeText: {
    color: '#C62828',
  },
  noResultsText: {
    textAlign: 'center',
    fontFamily: fontFamilies.medium,
    color: '#666',
    marginTop: 20,
  },
});

export default SearchScreen;
