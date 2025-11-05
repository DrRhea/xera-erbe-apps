import React, { FC, useCallback, useMemo } from 'react';
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
import { getCategoryCollection, getIconComponent } from '../../data/digidawData';
import type { MateriIconKey } from '../../data/materiContent';

type MateriCategoryRoute = RouteProp<RootStackParamList, 'MateriCategory'>;

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MateriCategoriesScreen: FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const route = useRoute<MateriCategoryRoute>();
	const layout = useResponsiveLayout();

	const { categoryId, categoryTitle } = route.params;

	const handleNotificationPress = useCallback(() => {
		navigation.navigate('Notification');
	}, [navigation]);

	const collection = useMemo(
		() => getCategoryCollection(categoryId, categoryTitle),
		[categoryId, categoryTitle],
	);

		const contentHorizontalPadding = useMemo(
			() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding],
	);
	const sectionSpacing = useMemo(
			() => clamp(layout.sectionSpacing * 0.6, 18, 28),
		[layout.sectionSpacing],
	);
	const cardGap = useMemo(
			() => clamp(layout.horizontalPadding * 0.4, 12, 18),
		[layout.horizontalPadding],
	);
		const cardPaddingVertical = useMemo(
			() => clamp(layout.horizontalPadding * 0.65, 14, 22),
		[layout.horizontalPadding],
	);
		const cardPaddingHorizontal = useMemo(
			() => clamp(layout.horizontalPadding * 0.5, 18, 24),
			[layout.horizontalPadding],
		);
		const iconWrapperSize = useMemo(
			() => clamp(layout.horizontalPadding * 1.6, 36, 46),
			[layout.horizontalPadding],
		);
		const iconSize = useMemo(
			() => clamp(iconWrapperSize * 0.55, 22, 30),
			[iconWrapperSize],
		);
		const cardRadius = useMemo(() => clamp(iconWrapperSize * 0.8, 18, 24), [iconWrapperSize]);

	const columns = useMemo(() => {
		if (layout.innerContentWidth >= 360) return 4;
		if (layout.innerContentWidth >= 260) return 3;
		return 2;
	}, [layout.innerContentWidth]);

		const cardWidth = useMemo(() => {
			const gapsTotal = cardGap * Math.max(columns - 1, 0);
			return Math.max((layout.innerContentWidth - gapsTotal) / columns, 120);
		}, [layout.innerContentWidth, columns, cardGap]);

			const handleSubjectPress = useCallback(
				(subjectId: string, subjectTitle: string, iconKey: string) => {
					navigation.navigate('MateriDetail', {
					categoryId,
					categoryTitle: collection.title,
					subjectId,
					subjectTitle,
						iconKey: iconKey as MateriIconKey,
				});
			},
				[categoryId, collection.title, navigation],
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
					<AppHeader title="Materi" contentHorizontalPadding={contentHorizontalPadding} onNotificationPress={handleNotificationPress} />
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
					<Text style={styles.sectionTitle}>Rangkuman Materi</Text>
					<View style={[styles.cardGrid, { columnGap: cardGap, rowGap: cardGap, gap: cardGap }]}>
						{collection.items.map((item) => {
							const Icon = getIconComponent(item.iconKey);

							return (
								<Pressable
									key={item.id}
									style={({ pressed }) => [
										styles.subjectCard,
										{
											borderRadius: cardRadius,
											paddingVertical: cardPaddingVertical,
														paddingHorizontal: cardPaddingHorizontal,
											width: cardWidth,
											maxWidth: cardWidth,
											flexBasis: cardWidth,
										},
										pressed ? styles.subjectCardPressed : null,
									]}
									  onPress={() => handleSubjectPress(item.id, item.label, item.iconKey)}
									accessibilityRole="button"
									accessibilityLabel={`Buka rangkuman ${item.label}`}
								>
									<View
										style={[
											styles.iconWrapper,
											{
												width: iconWrapperSize,
												height: iconWrapperSize,
												borderRadius: iconWrapperSize * 0.45,
											},
										]}
									>
										<Icon
											width={iconSize}
											height={iconSize}
											fill={colors.accent}
											stroke={colors.accent}
										/>
									</View>
									<Text style={styles.subjectLabel}>{item.label}</Text>
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

export default MateriCategoriesScreen;

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
	subjectCard: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white,
		shadowColor: '#69787D',
		shadowOpacity: 0.2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
			gap: 12,
	},
	subjectCardPressed: {
		opacity: 0.94,
	},
	iconWrapper: {
		backgroundColor: '#FFF3E6',
		justifyContent: 'center',
		alignItems: 'center',
	},
	subjectLabel: {
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
