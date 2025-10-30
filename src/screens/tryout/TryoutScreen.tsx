import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';

const TryoutScreen: FC = () => (
	<SafeAreaView style={styles.safeArea}>
		<AppHeader title="Tryout" />
		<View style={styles.content}>
			<Text style={styles.placeholderText}>Tryout content coming soon.</Text>
		</View>
	</SafeAreaView>
);

export default TryoutScreen;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	placeholderText: {
		fontSize: 16,
		fontFamily: fontFamilies.semiBold,
		color: colors.primaryDark,
		textAlign: 'center',
	},
});
