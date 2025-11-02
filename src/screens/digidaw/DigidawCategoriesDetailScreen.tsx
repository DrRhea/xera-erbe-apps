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
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import SearchBar from '../../components/SearchBar';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import {
	getCategoryCollection,
	getCategoryModules,
	getIconComponent,
} from './digidawData';

type DetailRoute = RouteProp<RootStackParamList, 'DigidawCategoryDetail'>;

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const DigidawCategoriesDetailScreen: FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute<DetailRoute>();
	const layout = useResponsiveLayout();
	const { categoryId, categoryTitle, subjectId, subjectTitle, iconKey } = route.params;

	const Icon = useMemo(() => getIconComponent(iconKey), [iconKey]);
	const modules = useMemo(
		() => getCategoryModules(subjectId, subjectTitle),
		[subjectId, subjectTitle]
	);
	const collection = useMemo(
		() => getCategoryCollection(categoryId, categoryTitle),
		[categoryId, categoryTitle]
	);

	const contentHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding]
	);
	const sectionSpacing = useMemo(
		() => clamp(layout.sectionSpacing * 0.7, 20, 32),
		[layout.sectionSpacing]
	);
	const iconWrapperSize = useMemo(
		() => clamp(layout.horizontalPadding * 1.8, 48, 64),
		[layout.horizontalPadding]
	);
	const iconSize = useMemo(
		() => clamp(iconWrapperSize * 0.55, 28, 36),
		[iconWrapperSize]
	);
	const moduleGap = useMemo(
		() => clamp(layout.sectionSpacing * 0.5, 14, 20),
		[layout.sectionSpacing]
	);
	const modulePadding = useMemo(
		() => clamp(layout.horizontalPadding * 0.75, 18, 26),
		[layout.horizontalPadding]
	);
	const badgeSize = useMemo(
		() => clamp(iconWrapperSize * 0.55, 28, 36),
		[iconWrapperSize]
	);

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
					<AppHeader
						title="DIGIDAW"
						contentHorizontalPadding={contentHorizontalPadding}
						onBackPress={() => navigation.goBack()}
					/>
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
					<View style={styles.breadcrumbWrapper}>
						<Text style={styles.breadcrumbText}>{collection.title}</Text>
						<Text style={styles.breadcrumbSeparator}>•</Text>
						<Text style={styles.breadcrumbText}>{subjectTitle}</Text>
					</View>
					<View style={[styles.subjectHero, { borderRadius: clamp(iconWrapperSize * 0.65, 20, 28) }]}>
						<View
							style={[
								styles.subjectIconWrapper,
								{
									width: iconWrapperSize,
									height: iconWrapperSize,
									borderRadius: iconWrapperSize * 0.4,
								},
							]}
						>
							<Icon width={iconSize} height={iconSize} />
						</View>
						<View style={styles.subjectTextBlock}>
							<Text style={styles.subjectLabel}>Bank Soal</Text>
							<Text style={styles.subjectTitle}>{subjectTitle}</Text>
							<Text style={styles.subjectSubtitle}>{`Kategori ${collection.title}`}</Text>
						</View>
					</View>
					<SearchBar placeholder="Cari modul atau topik" />
					<View style={[styles.moduleList, { rowGap: moduleGap, gap: moduleGap }]}>
						{modules.map((module, index) => (
							<Pressable
								key={module.id}
								style={[
									styles.moduleCard,
									{
										paddingHorizontal: modulePadding,
										paddingVertical: clamp(modulePadding * 0.75, 16, 22),
										borderRadius: clamp(modulePadding, 18, 24),
									},
								]}
								accessibilityRole="button"
								accessibilityLabel={`Buka modul ${module.title}`}
							>
								<View
									style={[
										styles.moduleBadge,
										{
											width: badgeSize,
											height: badgeSize,
											borderRadius: badgeSize / 2,
										},
									]}
								>
									<Text style={styles.moduleBadgeText}>{String(index + 1).padStart(2, '0')}</Text>
								</View>
								<View style={styles.moduleInfo}>
									<Text numberOfLines={2} style={styles.moduleTitle}>
										{module.title}
									</Text>
									<Text style={styles.moduleMeta}>Latihan {subjectTitle}</Text>
								</View>
								<RightPointerIcon width={18} height={18} />
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

export default DigidawCategoriesDetailScreen;

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
	breadcrumbWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	breadcrumbText: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.textSecondary,
	},
	breadcrumbSeparator: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: 'rgba(0,0,0,0.3)',
	},
	subjectHero: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.white,
		padding: 18,
		shadowColor: '#69787D',
		shadowOpacity: 0.2,
		shadowRadius: 14,
		shadowOffset: { width: 0, height: 2 },
		elevation: 4,
		gap: 16,
	},
	subjectIconWrapper: {
		backgroundColor: '#FEF0E1',
		justifyContent: 'center',
		alignItems: 'center',
	},
	subjectTextBlock: {
		flex: 1,
		gap: 4,
	},
	subjectLabel: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.textSecondary,
	},
	subjectTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 20,
		color: colors.textPrimary,
	},
	subjectSubtitle: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: 'rgba(0,0,0,0.6)',
	},
	moduleList: {
		flexDirection: 'column',
	},
	moduleCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.white,
		shadowColor: '#69787D',
		shadowOpacity: 0.15,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
		gap: 16,
	},
	moduleBadge: {
		backgroundColor: colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
	},
	moduleBadgeText: {
		fontFamily: fontFamilies.bold,
		fontSize: 12,
		color: colors.white,
	},
	moduleInfo: {
		flex: 1,
		gap: 4,
	},
	moduleTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 14,
		color: colors.textPrimary,
	},
	moduleMeta: {
		fontFamily: fontFamilies.medium,
		fontSize: 12,
		color: colors.textSecondary,
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
