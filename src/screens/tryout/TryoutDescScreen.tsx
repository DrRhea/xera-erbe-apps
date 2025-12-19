import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import {
	Alert,
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import {
  tryoutDescriptions,
  createGenericDescription,
} from '../../data/tryoutDescData';
import { tryoutService, type TryoutSubtest } from '../../services/tryoutService';
import { promotionService, type Promotion } from '../../services/promotionService';


const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

import { NAV_ITEMS } from '../../constants/navigation';

type TryoutDescRouteProp = RouteProp<RootStackParamList, 'TryoutDesc'>;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TryoutDescScreen: FC = () => {
	const {
		params: { tryoutId, title, dateLabel, statusLabel, statusVariant },
	} = useRoute<TryoutDescRouteProp>();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const layout = useResponsiveLayout();

	const handleNotificationPress = useCallback(() => {
		navigation.navigate('Notification');
	}, [navigation]);

	const [subtests, setSubtests] = useState<TryoutSubtest[]>([]);
	const [bestPromotion, setBestPromotion] = useState<Promotion | null>(null);
	const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
	const [pkg, setPkg] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [subtestsData, pkgData, promotions] = await Promise.all([
					tryoutService.getSubtests(tryoutId),
					tryoutService.getPackage(tryoutId),
					promotionService.getPromotions(true),
				]);
				setSubtests(subtestsData);
				setPkg(pkgData);

				if (pkgData.price) {
					// Find best promotion
					const applicablePromotions = promotions.filter((p) =>
						p.packageLinks?.some((link) => link.packageId === tryoutId),
					);

					let bestPromo: Promotion | null = null;
					let bestPrice = pkgData.price;

					for (const promo of applicablePromotions) {
						const discount = promotionService.calculateDiscount(pkgData.price, promo);
						const finalPrice = pkgData.price - discount;
						if (finalPrice < bestPrice) {
							bestPrice = finalPrice;
							bestPromo = promo;
						}
					}

					if (bestPromo) {
						setBestPromotion(bestPromo);
						setDiscountedPrice(bestPrice);
					}
				}
			} catch (error) {
				console.error('Failed to fetch data', error);
			}
		};
		fetchData();
	}, [tryoutId]);

	const description = useMemo(
		() => tryoutDescriptions[tryoutId] ?? createGenericDescription(title),
		[tryoutId, title]
	);

	const contentHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding]
	);
	const sectionSpacing = useMemo(
		() => clamp(layout.sectionSpacing * 0.7, 20, 32),
		[layout.sectionSpacing]
	);
	const headerCardPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.65, 16, 24),
		[layout.horizontalPadding]
	);
	const headerCardPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding, 18, 30),
		[layout.horizontalPadding]
	);
	const headerCardGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 12, 18),
		[layout.horizontalPadding]
	);
	const iconWrapperSize = useMemo(
		() => clamp(layout.horizontalPadding * 2.3, 42, 58),
		[layout.horizontalPadding]
	);
	const iconImageSize = useMemo(
		() => clamp(iconWrapperSize * 0.88, 34, 50),
		[iconWrapperSize]
	);
	const descriptionCardPadding = useMemo(
		() => clamp(layout.horizontalPadding * 0.95, 18, 28),
		[layout.horizontalPadding]
	);
	const descriptionSectionGap = useMemo(
		() => clamp(layout.sectionSpacing * 0.35, 12, 18),
		[layout.sectionSpacing]
	);
	const subsectionGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.4, 10, 14),
		[layout.horizontalPadding]
	);
	const bulletGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.3, 8, 12),
		[layout.horizontalPadding]
	);
	const bulletIndent = useMemo(
		() => clamp(layout.horizontalPadding * 0.5, 16, 24),
		[layout.horizontalPadding]
	);
	const statusBadgePaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.55, 12, 18),
		[layout.horizontalPadding]
	);
	const statusBadgePaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.3, 4, 8),
		[layout.horizontalPadding]
	);
	const ctaPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.55, 14, 18),
		[layout.horizontalPadding]
	);

	const handleRegisterPress = useCallback(() => {
		if (statusVariant === 'free') {
			navigation.navigate('TryoutRegistrationFree', {
				tryoutId,
				title,
				dateLabel,
			});
			return;
		}

		navigation.navigate('TryoutRegistrationPaid', {
			tryoutId,
			title,
			dateLabel,
			priceLabel: statusLabel,
			price: pkg.price, // Pass the numeric price
			promotion: bestPromotion ?? undefined,
			discountedPrice: discountedPrice ?? undefined,
		});
	}, [dateLabel, navigation, statusLabel, statusVariant, title, tryoutId, bestPromotion, discountedPrice, pkg]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[
					styles.scrollContent,
					{
						alignItems: 'center',
						paddingBottom: clamp(layout.sectionSpacing * 3.2, 108, 180),
					},
				]}
				showsVerticalScrollIndicator={false}
			>
				<View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
					<AppHeader title="Kembali" contentHorizontalPadding={contentHorizontalPadding} onNotificationPress={handleNotificationPress} />
				</View>

				<View
					style={[
						styles.contentWrapper,
						{
							width: layout.contentWidth,
							paddingHorizontal: contentHorizontalPadding,
							marginTop: clamp(layout.sectionSpacing * 0.4, 18, 28),
							rowGap: sectionSpacing,
							gap: sectionSpacing,
						},
					]}
				>
					<View
						style={[
							styles.heroCard,
							{
								paddingVertical: headerCardPaddingVertical,
								paddingHorizontal: headerCardPaddingHorizontal,
								columnGap: headerCardGap,
								gap: headerCardGap,
							},
						]}
					>
						<View
							style={[
								styles.iconWrapper,
								{
									width: iconWrapperSize,
									height: iconWrapperSize,
									borderRadius: clamp(iconWrapperSize * 0.32, 12, 18),
								},
							]}
						>
							<Image
								source={tryoutCardImage}
								style={{ width: iconImageSize, height: iconImageSize }}
								resizeMode="contain"
							/>
						</View>
						<View style={styles.heroContent}>
							<Text style={styles.heroTitle}>{description.headerTitle}</Text>
							<Text style={styles.heroMeta}>{dateLabel}</Text>
							<View
								style={[
									styles.statusBadge,
									statusVariant === 'free' ? styles.statusBadgeFree : styles.statusBadgePaid,
									{
										paddingHorizontal: statusBadgePaddingHorizontal,
										paddingVertical: statusBadgePaddingVertical,
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
						</View>
					</View>

					<View style={[styles.descriptionCard, { padding: descriptionCardPadding }]}>
						<Text style={styles.subTitle}>{description.subTitle}</Text>
						<View style={{ marginTop: descriptionSectionGap, rowGap: descriptionSectionGap, gap: descriptionSectionGap }}>
							{subtests.length > 0 && (
								<View style={{ rowGap: subsectionGap, gap: subsectionGap }}>
									<Text style={styles.sectionTitle}>Materi yang Diujikan</Text>
									{subtests.map((subtest) => (
										<View key={subtest.id} style={[styles.bulletRow, { columnGap: bulletGap, gap: bulletGap }]}>
											<View style={styles.bulletDot} />
											<Text style={styles.sectionBody}>
												{subtest.title} {subtest.questionCount ? `${subtest.questionCount} Soal` : ''} ({subtest.durationMinutes} Menit)
											</Text>
										</View>
									))}
								</View>
							)}
							{description.sections.map((section) => {
								if (subtests.length > 0 && (section.title.includes('Struktur') || section.title.includes('Materi'))) {
									return null;
								}
								return (
								<View key={section.title} style={{ rowGap: subsectionGap, gap: subsectionGap }}>
									<Text style={styles.sectionTitle}>{section.title}</Text>
									{section.description ? <Text style={styles.sectionBody}>{section.description}</Text> : null}
									{section.items?.map((item) => (
										<View key={item} style={[styles.bulletRow, { columnGap: bulletGap, gap: bulletGap }]}>
											<View style={styles.bulletDot} />
											<Text style={styles.sectionBody}>{item}</Text>
										</View>
									))}
									{section.subSections?.map((subSection) => (
										<View key={subSection.title} style={{ marginLeft: bulletIndent, rowGap: bulletGap, gap: bulletGap }}>
											<Text style={styles.subSectionTitle}>{subSection.title}</Text>
											{subSection.description ? <Text style={styles.sectionBody}>{subSection.description}</Text> : null}
											{subSection.items?.map((item) => (
												<View key={item} style={[styles.bulletRow, { columnGap: bulletGap, gap: bulletGap }]}>
													<View style={styles.bulletDot} />
													<Text style={styles.sectionBody}>{item}</Text>
												</View>
											))}
										</View>
									))}
								</View>
							)})}
						</View>
					</View>

					<Pressable
						onPress={handleRegisterPress}
						style={[styles.ctaButton, { paddingVertical: ctaPaddingVertical }]}
						accessibilityRole="button"
						accessibilityLabel="Daftar Try Out"
					>
						<Text style={styles.ctaLabel}>Daftar Sekarang</Text>
					</Pressable>
				</View>
			</ScrollView>
			<BottomNavigation
				items={NAV_ITEMS}
				activeKey="home"
				backgroundColor={colors.white}
				activeColor={colors.primary}
				inactiveColor={colors.navInactive}
				style={styles.bottomNav}
			/>
		</SafeAreaView>
	);
};

export default TryoutDescScreen;

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
	heroCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary,
		borderRadius: 20,
		width: '100%',
	},
	iconWrapper: {
		backgroundColor: colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 14,
	},
	heroContent: {
		flex: 1,
		alignItems: 'flex-start',
		gap: 6,
	},
	heroTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.white,
	},
	heroMeta: {
		fontFamily: fontFamilies.medium,
		fontSize: 11,
		color: 'rgba(255,255,255,0.85)',
	},
	statusBadge: {
		borderRadius: 14,
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
	descriptionCard: {
		backgroundColor: colors.white,
		borderRadius: 20,
		width: '100%',
	},
	subTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	sectionTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	subSectionTitle: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	sectionBody: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.sectionTitle,
		lineHeight: 20,
	},
	bulletRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	bulletDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		marginTop: 7,
		backgroundColor: colors.sectionTitle,
	},
	ctaButton: {
		width: '100%',
		backgroundColor: colors.accent,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ctaLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 16,
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
