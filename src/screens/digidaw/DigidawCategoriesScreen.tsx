import React, { FC, useMemo } from 'react';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { SvgProps } from 'react-native-svg';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import MaterialIcon1 from '../../../assets/icons/material1.svg';
import MaterialIcon2 from '../../../assets/icons/material2.svg';
import MaterialIcon3 from '../../../assets/icons/material3.svg';
import MaterialIcon4 from '../../../assets/icons/material4.svg';
import MaterialIcon5 from '../../../assets/icons/material5.svg';
import MaterialIcon6 from '../../../assets/icons/material6.svg';
import MaterialIcon7 from '../../../assets/icons/material7.svg';
import VectorIcon from '../../../assets/icons/material4.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';

type DigidawCategoriesRoute = RouteProp<RootStackParamList, 'DigidawCategories'>;

type CategoryItem = {
	id: string;
	label: string;
	Icon: FC<SvgProps>;
};

type CategoryCollection = {
	title: string;
	items: CategoryItem[];
};

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const materialIcons = [
	MaterialIcon1,
	MaterialIcon2,
	MaterialIcon3,
	MaterialIcon4,
	MaterialIcon5,
	MaterialIcon6,
	MaterialIcon7,
	VectorIcon,
] as const;

const digidawCategoryCollections: Record<string, CategoryCollection> = {
	sma: {
		title: 'SMA',
		items: [
			{ id: 'matematika', label: 'Matematika', Icon: MaterialIcon1 },
			{ id: 'kimia', label: 'Kimia', Icon: MaterialIcon2 },
			{ id: 'fisika', label: 'Fisika', Icon: MaterialIcon3 },
			{ id: 'biologi', label: 'Biologi', Icon: MaterialIcon4 },
			{ id: 'ekonomi', label: 'Ekonomi', Icon: MaterialIcon5 },
			{ id: 'geografi', label: 'Geografi', Icon: MaterialIcon6 },
			{ id: 'sosiologi', label: 'Sosiologi', Icon: MaterialIcon7 },
			{ id: 'bahasa-inggris', label: 'Bahasa Inggris', Icon: VectorIcon },
		],
	},
	'tka-snbt': {
		title: 'TKA & SNBT',
		items: [
			{ id: 'penalaran-umum', label: 'Penalaran Umum', Icon: MaterialIcon1 },
			{ id: 'penalaran-matematika', label: 'Penalaran Matematika', Icon: MaterialIcon2 },
			{ id: 'literasi-indonesia', label: 'Literasi Indonesia', Icon: MaterialIcon3 },
			{ id: 'literasi-inggris', label: 'Literasi Inggris', Icon: MaterialIcon4 },
			{ id: 'pengetahuan-kuantitatif', label: 'Pengetahuan Kuantitatif', Icon: MaterialIcon5 },
			{ id: 'pemahaman-umum', label: 'Pemahaman Umum', Icon: MaterialIcon6 },
		],
	},
	kedinasan: {
		title: 'Kedinasan',
		items: [
			{ id: 'twk', label: 'TWK', Icon: MaterialIcon1 },
			{ id: 'tiu', label: 'TIU', Icon: MaterialIcon2 },
			{ id: 'tkp', label: 'TKP', Icon: MaterialIcon3 },
			{ id: 'skb', label: 'SKB', Icon: MaterialIcon4 },
			{ id: 'psikotes', label: 'Psikotes', Icon: MaterialIcon5 },
			{ id: 'wawancara', label: 'Wawancara', Icon: MaterialIcon6 },
		],
	},
	smp: {
		title: 'SMP',
		items: [
			{ id: 'matematika-smp', label: 'Matematika', Icon: MaterialIcon1 },
			{ id: 'ipa-terpadu', label: 'IPA Terpadu', Icon: MaterialIcon2 },
			{ id: 'bahasa-indonesia-smp', label: 'Bahasa Indonesia', Icon: MaterialIcon3 },
			{ id: 'bahasa-inggris-smp', label: 'Bahasa Inggris', Icon: MaterialIcon4 },
			{ id: 'ips', label: 'IPS', Icon: MaterialIcon5 },
			{ id: 'ppkn', label: 'PPKn', Icon: MaterialIcon6 },
			{ id: 'tik', label: 'TIK', Icon: MaterialIcon7 },
		],
	},
	'mandiri-univ': {
		title: 'Mandiri Univ',
		items: [
			{ id: 'tpa-numerik', label: 'TPA Numerik', Icon: MaterialIcon1 },
			{ id: 'tpa-verbal', label: 'TPA Verbal', Icon: MaterialIcon2 },
			{ id: 'tes-saintek', label: 'Tes Saintek', Icon: MaterialIcon3 },
			{ id: 'tes-soshum', label: 'Tes Soshum', Icon: MaterialIcon4 },
			{ id: 'bahasa-indonesia-ptn', label: 'Bahasa Indonesia', Icon: MaterialIcon5 },
			{ id: 'bahasa-inggris-ptn', label: 'Bahasa Inggris', Icon: MaterialIcon6 },
			{ id: 'potensi-akademik', label: 'Potensi Akademik', Icon: MaterialIcon7 },
		],
	},
};

const getCollectionForCategory = (categoryId: string, categoryTitle: string): CategoryCollection => {
	const normalizedId = categoryId.toLowerCase();
	if (digidawCategoryCollections[normalizedId]) {
		return digidawCategoryCollections[normalizedId];
	}

	return {
		title: categoryTitle,
		items: Array.from({ length: 6 }).map((_, index) => ({
			id: `${normalizedId}-${index + 1}`,
			label: `${categoryTitle} ${index + 1}`,
			Icon: materialIcons[index % materialIcons.length],
		})),
	};
};

const DigidawCategoriesScreen: FC = () => {
	const route = useRoute<DigidawCategoriesRoute>();
	const layout = useResponsiveLayout();

		const { categoryId, categoryTitle } = route.params;

	const collection = useMemo(
		() => getCollectionForCategory(categoryId, categoryTitle),
		[categoryId, categoryTitle]
	);

	const title = `Let's DIGIDAW ${collection.title}`;

	const contentHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding]
	);
	const sectionSpacing = useMemo(
		() => clamp(layout.sectionSpacing * 0.6, 18, 28),
		[layout.sectionSpacing]
	);
	const cardGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.4, 12, 18),
		[layout.horizontalPadding]
	);
	const cardPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.65, 14, 22),
		[layout.horizontalPadding]
	);
	const cardPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.5, 18, 24),
		[layout.horizontalPadding]
	);
	const iconWrapperSize = useMemo(
		() => clamp(layout.horizontalPadding * 1.6, 36, 46),
		[layout.horizontalPadding]
	);
	const iconSize = useMemo(
		() => clamp(iconWrapperSize * 0.55, 22, 30),
		[iconWrapperSize]
	);
	const columns = useMemo(() => {
		if (layout.innerContentWidth >= 360) return 4;
		if (layout.innerContentWidth >= 260) return 3;
		return 2;
	}, [layout.innerContentWidth]);
	const cardWidth = useMemo(() => {
		const gapsTotal = cardGap * Math.max(columns - 1, 0);
		return Math.max((layout.innerContentWidth - gapsTotal) / columns, 120);
	}, [layout.innerContentWidth, columns, cardGap]);

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
				<View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
					<AppHeader title="DIGIDAW" contentHorizontalPadding={contentHorizontalPadding} />
				</View>
				<View
					style={[
						styles.contentWrapper,
						{
							width: layout.contentWidth,
							paddingHorizontal: contentHorizontalPadding,
							marginTop: sectionSpacing,
							rowGap: sectionSpacing,
							gap: sectionSpacing,
						},
					]}
				>
					<Text style={styles.sectionTitle}>{title}</Text>
					<View style={[styles.cardGrid, { columnGap: cardGap, rowGap: cardGap, gap: cardGap }]}>
						{collection.items.map((item, index) => (
							<Pressable
								key={item.id}
								style={[
									styles.categoryCard,
									{
										paddingHorizontal: cardPaddingHorizontal,
										paddingVertical: cardPaddingVertical,
										borderRadius: clamp(iconWrapperSize * 0.8, 18, 24),
										maxWidth: cardWidth,
										flexBasis: cardWidth,
									},
								]}
								accessibilityRole="button"
								accessibilityLabel={`Buka bank soal ${item.label}`}
								onPress={() => {}}
							>
								<View
									style={[
										styles.iconWrapper,
										{
											width: iconWrapperSize,
											height: iconWrapperSize,
											borderRadius: iconWrapperSize * 0.4,
										},
									]}
								>
									<item.Icon width={iconSize} height={iconSize} />
								</View>
								<Text style={styles.cardLabel}>{item.label}</Text>
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

export default DigidawCategoriesScreen;

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
		justifyContent: 'flex-start',
	},
	categoryCard: {
		backgroundColor: colors.white,
		alignItems: 'center',
		gap: 12,
		shadowColor: '#69787D',
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
	},
	iconWrapper: {
		backgroundColor: '#FEF0E1',
		justifyContent: 'center',
		alignItems: 'center',
	},
	cardLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 12,
		color: colors.textPrimary,
		textAlign: 'center',
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
