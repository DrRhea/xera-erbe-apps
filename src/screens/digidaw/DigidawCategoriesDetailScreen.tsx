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
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { getCategoryModules, getIconComponent } from '../../data/digidawData';

type DetailRoute = RouteProp<RootStackParamList, 'DigidawCategoryDetail'>;

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const DigidawCategoriesDetailScreen: FC = () => {
	const route = useRoute<DetailRoute>();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const layout = useResponsiveLayout();
	const { categoryId, categoryTitle, subjectId, subjectTitle, iconKey } = route.params;

	const Icon = useMemo(() => getIconComponent(iconKey), [iconKey]);
	const modules = useMemo(
		() => getCategoryModules(subjectId, subjectTitle),
		[subjectId, subjectTitle]
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
		() => clamp(layout.horizontalPadding * 1.4, 44, 52),
		[layout.horizontalPadding]
	);
	const iconSize = useMemo(
		() => clamp(iconWrapperSize * 0.55, 24, 30),
		[iconWrapperSize]
	);
	const moduleGap = useMemo(
		() => clamp(layout.sectionSpacing * 0.45, 12, 18),
		[layout.sectionSpacing]
	);
	const modulePadding = useMemo(
		() => clamp(layout.horizontalPadding * 0.7, 16, 22),
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
					<Text style={styles.sectionBreadcrumb}>{`${categoryTitle} ・ ${subjectTitle}`}</Text>
					<SearchBar placeholder="Mau belajar apa nih?" />
					<Text style={styles.sectionHeading}>{subjectTitle}</Text>
								<View style={[styles.moduleList, { rowGap: moduleGap, gap: moduleGap }]}> 
						{modules.map((module) => (
							<Pressable
								key={module.id}
								style={[
									styles.moduleCard,
									{
										paddingHorizontal: modulePadding,
										paddingVertical: clamp(modulePadding * 0.7, 14, 20),
										borderRadius: clamp(modulePadding * 0.9, 16, 22),
									},
								]}
								onPress={() =>
									navigation.navigate('DigidawQuestion', {
										categoryId,
										categoryTitle,
										subjectId,
										subjectTitle,
										moduleId: module.id,
										moduleTitle: module.title,
									})
								}
								accessibilityRole="button"
								accessibilityLabel={`Buka modul ${module.title}`}
							>
								<View
									style={[
										styles.moduleIconWrapper,
										{
											width: iconWrapperSize,
											height: iconWrapperSize,
											borderRadius: iconWrapperSize * 0.4,
										},
									]}
								>
									<Icon width={iconSize} height={iconSize} />
								</View>
												<View style={styles.moduleInfo}>
									<Text numberOfLines={2} style={styles.moduleTitle}>
										{module.title}
									</Text>
									<Text style={styles.moduleMeta}>Latihan {subjectTitle}</Text>
								</View>
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
	sectionBreadcrumb: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.textSecondary,
	},
	sectionHeading: {
		fontFamily: fontFamilies.bold,
		fontSize: 16,
		color: colors.textPrimary,
	},
	moduleList: {
		flexDirection: 'column',
	},
	moduleCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.white,
		shadowColor: '#69787D',
		shadowOpacity: 0.14,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 2 },
		elevation: 3,
		gap: 16,
	},
	moduleIconWrapper: {
		backgroundColor: '#FEF0E1',
		justifyContent: 'center',
		alignItems: 'center',
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
