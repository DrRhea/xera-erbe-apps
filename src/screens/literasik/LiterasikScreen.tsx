import React, { useCallback } from 'react';
import {
	FlatList,
	Image,
	ListRenderItemInfo,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies, radii, spacing } from '../../constants/theme';
import { literasikArticles, type LiterasikArticle } from '../../data/literasikContent';
import type { RootStackParamList } from '../../../App';

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const CARD_SHADOW = {
	shadowColor: colors.primaryDark,
	shadowOpacity: 0.08,
	shadowRadius: 12,
	shadowOffset: { width: 0, height: 4 },
	elevation: 3,
};

const LiterasikScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const renderArticle = useCallback(({ item }: ListRenderItemInfo<LiterasikArticle>) => (
		<View style={styles.card}>
			<View style={styles.imageWrapper}>
				<Image source={item.image} style={styles.cardImage} resizeMode="cover" />
			</View>
			<View style={styles.cardBody}>
				<Text style={styles.cardTitle}>{item.title}</Text>
				<Text style={styles.cardExcerpt} numberOfLines={4}>
					{item.excerpt}
				</Text>
			</View>
		</View>
	), []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" />
			<View style={styles.container}>
				<AppHeader title="Literasik" onBackPress={() => navigation.goBack()} />
				<FlatList
					data={literasikArticles}
					renderItem={renderArticle}
					keyExtractor={(article) => article.id}
					contentContainerStyle={styles.listContent}
					showsVerticalScrollIndicator={false}
				/>
			</View>
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

export default LiterasikScreen;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	container: {
		flex: 1,
	},
	listContent: {
		paddingHorizontal: spacing.xl,
		paddingTop: spacing.xl,
		paddingBottom: 120,
		gap: spacing.xl,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: 20,
		overflow: 'hidden',
		...CARD_SHADOW,
	},
	imageWrapper: {
		width: '100%',
		height: 150,
		overflow: 'hidden',
	},
	cardImage: {
		width: '100%',
		height: '100%',
	},
	cardBody: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.lg,
		gap: spacing.sm,
	},
	cardTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.sectionTitle,
	},
	cardExcerpt: {
		fontFamily: fontFamilies.medium,
		fontSize: 12,
		lineHeight: 18,
		color: '#3F3F3F',
		textAlign: 'justify',
	},
	bottomNav: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		borderBottomLeftRadius: radii.xl,
		borderBottomRightRadius: radii.xl,
	},
});
