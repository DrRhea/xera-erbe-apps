import React, { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import LogoFullGreen from '../../../assets/images/logoutuhijo.png';
import { colors } from '../../constants/theme';

const gradientColors = ['#1C637B', '#9EE0BF'] as const;

type AuthLayoutProps = PropsWithChildren<{
	onLayout?: () => void;
}>;

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, onLayout }) => {
	return (
		<LinearGradient colors={gradientColors} style={styles.gradient}>
			<StatusBar barStyle="light-content" />
			<SafeAreaView style={styles.safeArea}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={styles.flex}
				>
					<ScrollView
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
						onLayout={onLayout}
					>
						<View style={styles.card}>
							<Image source={LogoFullGreen} style={styles.logo} resizeMode="contain" />
							{children}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default AuthLayout;

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	flex: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48,
		paddingHorizontal: 24,
	},
	card: {
		width: '100%',
		maxWidth: 340,
		backgroundColor: colors.white,
		borderRadius: 18,
		paddingHorizontal: 24,
		paddingVertical: 32,
		shadowColor: '#000000',
		shadowOpacity: 0.1,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 6,
		alignItems: 'stretch',
	},
	logo: {
		width: '50%',
		maxWidth: 160,
		alignSelf: 'center',
		marginBottom: 32,
	},
});
