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
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import {
	getCategoryCollection,
	getIconComponent,
} from './digidawData';

type DigidawCategoriesRoute = RouteProp<RootStackParamList, 'DigidawCategories'>;

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const DigidawCategoriesScreen: FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute<DigidawCategoriesRoute>();
	const layout = useResponsiveLayout();

	const { categoryId, categoryTitle } = route.params;

	const collection = useMemo(
		() => getCategoryCollection(categoryId, categoryTitle),
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
						{collection.items.map((item) => {
							const Icon = getIconComponent(item.iconKey);
							return (
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
									onPress={() =>
										navigation.navigate('DigidawCategoryDetail', {
											categoryId,
											categoryTitle: collection.title,
											subjectId: item.id,
											subjectTitle: item.label,
											iconKey: item.iconKey,
										})
									}
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
										<Icon width={iconSize} height={iconSize} />
									</View>
									<Text style={styles.cardLabel}>{item.label}</Text>
								</Pressable>
							);
						})}
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
