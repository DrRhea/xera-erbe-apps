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
import { LinearGradient } from 'expo-linear-gradient';

import AppHeader from '../../components/AppHeader';
import SearchBar from '../../components/SearchBar';
import { colors, fontFamilies, spacing } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { searchData, type SearchCategory } from '../../data/searchData';

// Assets
import TryoutImage from '../../../assets/images/tryout.png';
import MateriImage from '../../../assets/images/materi.png';
import DigidawImage from '../../../assets/images/digidaw.png';

const SearchScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('tryout');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const results = useMemo(() => {
    const list = searchData?.[activeCategory] ?? [];
    return list.filter((item) =>
      (item?.title ?? '').toLowerCase().includes((searchQuery ?? '').toLowerCase())
    );
  }, [searchQuery, activeCategory]);


  const getImageSource = (category: 'tryout' | 'materi' | 'digidaw') => {
    switch (category) {
      case 'materi':
        return MateriImage;
      case 'digidaw':
        return DigidawImage;
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




  const handlePress = (item: any) => {
    if (!item?.routeName) {
      console.log("routeName missing for:", item);
      return;
    }
safeNavigate(item.routeName as keyof RootStackParamList, item.routeParams);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header gradient
      <LinearGradient
        colors={['#227C9D', '#8EF6E4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      > */}
        <View style={[styles.headerWrapper, { width }]}>
          <AppHeader
            title=""
            contentHorizontalPadding={spacing.xl}
            showLogo={false}
            onNotificationPress={handleNotificationPress}
            showBackButton={true}
            customContent={
              // <View style={{ maxWidth: 180}}>
              <SearchBar
                placeholder={
                  activeCategory === 'tryout'
                    ? 'Cari Tryout'
                    : activeCategory === 'materi'
                    ? 'Cari Materi'
                    : 'Cari Digidaw'
                }
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, maxWidth: 240 }}
              />
              // </View>
            }
          />
        </View>
      {/* </LinearGradient> */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category toggle */}
        <View style={styles.toggleContainer}>
          {['Tryout', 'Materi', 'Digidaw'].map((label) => {
            const key = label.toLowerCase() as 'tryout' | 'materi' | 'digidaw';
            const isActive = activeCategory === key;
            return (
              <Pressable
                key={label}
                style={[styles.toggleButton, isActive && styles.toggleActive]}
                onPress={() => setActiveCategory(key)}
              >
                <Text style={[styles.toggleText, isActive && styles.toggleTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Results */}
        <View style={styles.resultList}>
          {results.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => handlePress(item)}
            >
              <View style={styles.cardLeft}>
                <Image
                  source={getImageSource(activeCategory)}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.freeBadge,
                    { backgroundColor: item.free ? '#C9FFD9' : '#FFE1C1' },
                  ]}
                >
                  <Text
                    style={[
                      styles.freeText,
                      { color: item.free ? '#097969' : '#C15A00' },
                    ]}
                  >
                    {item.free ? 'Free' : 'Premium'}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <Pressable
                style={[styles.buttonOrange, !item.free && { backgroundColor: '#FFCF99' }]}
                onPress={() => handlePress(item)}
              >
                <Text style={styles.buttonOrangeText}>Lihat Detail</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  headerGradient: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 12,
  },
  headerWrapper: { alignSelf: 'center' },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  toggleButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  toggleActive: { backgroundColor: '#FFAE6C' },
  toggleText: {
    fontFamily: fontFamilies.semiBold,
    color: '#555',
    fontSize: 14,
  },
  toggleTextActive: { color: '#fff' },
  resultList: { gap: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: { width: 48, height: 48, marginRight: 12 },
  cardImage: { width: '100%', height: '100%' },
  cardRight: { flex: 1, justifyContent: 'center' },
  freeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  freeText: { fontSize: 12, fontFamily: fontFamilies.semiBold },
  cardTitle: { fontSize: 16, fontFamily: fontFamilies.bold, color: '#003049' },
  cardDate: {
    fontSize: 13,
    fontFamily: fontFamilies.medium,
    color: '#555',
    marginTop: 2,
  },
  buttonOrange: {
    backgroundColor: '#FFAE6C',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonOrangeText: {
    color: '#fff',
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
});

export default SearchScreen;
