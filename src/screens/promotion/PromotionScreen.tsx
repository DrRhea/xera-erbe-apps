import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableOpacity,
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
import { promotionService, type Promotion } from '../../services/promotionService';
import { tryoutService, type TryoutPackage } from '../../services/tryoutService';
import { formatDiscount } from '../../utils/format';

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'leaderboard', label: 'Leaderboard', Icon: TagIcon, routeName: 'Leaderboard' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PromotionScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const layout = useResponsiveLayout();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [tryouts, setTryouts] = useState<TryoutPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [linkedTryouts, setLinkedTryouts] = useState<TryoutPackage[]>([]);
  const [loadingTryouts, setLoadingTryouts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promosData, tryoutsData] = await Promise.all([
          promotionService.getPromotions(true),
          tryoutService.getPackages(true),
        ]);
        setPromotions(promosData);
        setTryouts(tryoutsData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handlePromoPress = async (promo: Promotion) => {
    setSelectedPromo(promo);
    setModalVisible(true);
    setLoadingTryouts(true);
    setLinkedTryouts([]);

    if (promo.packageLinks && promo.packageLinks.length > 0) {
      try {
        const promises = promo.packageLinks.map((link) => tryoutService.getPackage(link.packageId));
        const results = await Promise.all(promises);
        setLinkedTryouts(results);
      } catch (e) {
        console.error('Failed to fetch linked tryouts', e);
      }
    }
    setLoadingTryouts(false);
  };

  const handleLinkedTryoutPress = (pkg: TryoutPackage) => {
    setModalVisible(false);
    // Map TryoutPackage to params expected by TryoutDesc
    // Assuming simple mapping for now
    const statusVariant = pkg.enrollmentType === 'paid' ? 'paid' : 'free';
    const statusLabel = pkg.enrollmentType === 'paid' ? 'Berbayar' : 'Gratis';
    const dateLabel = new Date(pkg.startsAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    navigation.navigate('TryoutDesc', {
      tryoutId: pkg.id,
      title: pkg.title,
      dateLabel: dateLabel,
      statusLabel: statusLabel,
      statusVariant: statusVariant,
    });
  };

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

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : promotions.length > 0 ? (
            promotions.map((promo) => (
              <Pressable key={promo.id} onPress={() => handlePromoPress(promo)}>
                <PromotionBanner
                  layout={{
                    screenWidth: layout.screenWidth,
                    horizontalPadding: layout.horizontalPadding,
                    recommendationPaddingHorizontal: layout.recommendationPaddingHorizontal,
                    recommendationPaddingVertical: layout.recommendationPaddingVertical,
                  }}
                  badgeText={promo.badgeText || 'PROMO'}
                  discountText={formatDiscount(promo.discountType, promo.discountValue).text}
                  suffixText={formatDiscount(promo.discountType, promo.discountValue).suffix}
                  promoCode={promo.code}
                  codeLabel={`KODE\nPROMO`}
                  containerStyle={{ marginBottom: 8 }}
                />
                <Text style={styles.seeMoreText}>Selengkapnya &gt;</Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ fontFamily: fontFamilies.medium, color: colors.textSecondary, marginTop: 10 }}>
              Belum ada promosi yang tersedia.
            </Text>
          )}

          {/* ==== Tambahan: List Try Out SNBT ==== */}
          {tryouts.length > 0 && (
            <View style={{ marginTop: layout.sectionSpacing }}>
              <Text style={styles.sectionTitle}>Try Out SNBT</Text>
              <View style={{ rowGap: upcomingCardGap }}>
                {tryouts.map((tryout) => {
                  const isPaid = tryout.enrollmentType === 'paid';
                  const statusVariant = isPaid ? 'paid' : 'free';
                  const statusLabel = isPaid ? 'Berbayar' : 'Gratis';
                  const dateLabel = new Date(tryout.startsAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  });

                  return (
                    <Pressable
                      key={tryout.id}
                      onPress={() =>
                        handleUpcomingCardPress({
                          id: tryout.id,
                          title: tryout.title,
                          dateLabel,
                          statusLabel,
                          statusVariant,
                        })
                      }
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
                            statusVariant === 'free' ? styles.statusBadgeFree : styles.statusBadgePaid,
                            {
                              paddingHorizontal: upcomingBadgePaddingHorizontal,
                              paddingVertical: upcomingBadgePaddingVertical,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              statusVariant === 'free' ? styles.statusBadgeTextFree : styles.statusBadgeTextPaid,
                            ]}
                          >
                            {statusLabel}
                          </Text>
                        </View>
                        <Text style={styles.upcomingTitle}>{tryout.title}</Text>
                        <Text style={styles.upcomingDate}>{dateLabel}</Text>
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
                  );
                })}
              </View>
            </View>
          )}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paket Tryout Terkait</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Tutup</Text>
              </TouchableOpacity>
            </View>
            
            {loadingTryouts ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 20 }} />
            ) : linkedTryouts.length > 0 ? (
              <FlatList
                data={linkedTryouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.linkedTryoutItem}
                    onPress={() => handleLinkedTryoutPress(item)}
                  >
                    <Text style={styles.linkedTryoutTitle}>{item.title}</Text>
                    <Text style={styles.linkedTryoutSubtitle}>
                      {item.enrollmentType === 'paid' ? 'Berbayar' : 'Gratis'} • {new Date(item.startsAt).toLocaleDateString('id-ID')}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            ) : (
              <Text style={styles.emptyText}>Tidak ada paket tryout yang terhubung.</Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
  linkedTryoutItem: {
    paddingVertical: 12,
  },
  linkedTryoutTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.textPrimary,
  },
  linkedTryoutSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
    fontFamily: fontFamilies.medium,
  },
  seeMoreText: {
    textAlign: 'right',
    color: colors.primary,
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 12,
    marginRight: 8,
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
