import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AuthLayout from './AuthLayout';
import { colors, fontFamilies } from '../../constants/theme';
import { loginMockUser } from '../../services/mockAuthService';
import type { RootStackParamList } from '../../../App';

const buttonGradient = ['#1C637B', '#B0ED9F'] as const;
const placeholderColor = '#9D9D9D';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const isSubmitDisabled = useMemo(() => {
		if (submitting) {
			return true;
		}
		const trimmedEmail = email.trim();
		const trimmedPassword = password.trim();

		if (!emailRegex.test(trimmedEmail)) {
			return true;
		}

		if (trimmedPassword.length < 6) {
			return true;
		}

		return false;
	}, [email, password, submitting]);

	const handleNavigateToRegister = useCallback(() => {
		navigation.navigate('Register');
	}, [navigation]);

	const handleLogin = useCallback(() => {
		if (isSubmitDisabled) {
			return;
		}

		setSubmitting(true);
		setErrorMessage('');

		const result = loginMockUser({ email, password });

		if (!result.success) {
			setErrorMessage(result.error);
			setSubmitting(false);
			return;
		}

		setSubmitting(false);

		Alert.alert('Selamat datang', `Hai ${result.user.name}!`, [
			{
				text: 'Mulai Belajar',
				onPress: () =>
					navigation.reset({
						index: 0,
						routes: [{ name: 'Home' }],
					}),
			},
		]);
	}, [email, isSubmitDisabled, navigation, password]);

	return (
		<AuthLayout>
			<View style={styles.formStack}>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="Email"
					placeholderTextColor={placeholderColor}
					style={styles.input}
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					returnKeyType="next"
					textContentType="emailAddress"
				/>
				<TextInput
					value={password}
					onChangeText={setPassword}
					placeholder="Password"
					placeholderTextColor={placeholderColor}
					style={styles.input}
					secureTextEntry
					autoCapitalize="none"
					returnKeyType="done"
					onSubmitEditing={handleLogin}
					textContentType="password"
				/>
			</View>

			{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

			<Pressable
				onPress={handleNavigateToRegister}
				style={({ pressed }) => [styles.helperLinkWrapper, pressed && styles.helperLinkPressed]}
			>
				<Text style={styles.helperLink}>Belum memiliki akun?</Text>
			</Pressable>

			<Pressable
				onPress={handleLogin}
				disabled={isSubmitDisabled}
				style={({ pressed }) => [
					styles.submitPressable,
					pressed && !isSubmitDisabled ? styles.submitPressablePressed : null,
				]}
			>
				<LinearGradient
					colors={buttonGradient}
					start={{ x: 0, y: 0.5 }}
					end={{ x: 1, y: 0.5 }}
					style={[styles.submitGradient, isSubmitDisabled && styles.submitGradientDisabled]}
				>
					<Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Masuk'}</Text>
				</LinearGradient>
			</Pressable>
		</AuthLayout>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	formStack: {
		flexDirection: 'column',
		gap: 16,
	},
	input: {
		backgroundColor: '#F6F6F6',
		borderRadius: 12,
		paddingHorizontal: 18,
		paddingVertical: 14,
		fontFamily: fontFamilies.regular,
		fontSize: 15,
		color: colors.textPrimary,
	},
	errorText: {
		marginTop: 16,
		fontSize: 13,
		color: colors.accent,
		fontFamily: fontFamilies.semiBold,
		textAlign: 'center',
	},
	helperLinkWrapper: {
		alignSelf: 'flex-end',
		marginTop: 16,
	},
	helperLinkPressed: {
		opacity: 0.7,
	},
	helperLink: {
		fontSize: 12,
		fontFamily: fontFamilies.semiBold,
		color: colors.accent,
	},
	submitPressable: {
		marginTop: 24,
		alignSelf: 'center',
		width: '100%',
	},
	submitPressablePressed: {
		opacity: 0.85,
		transform: [{ scale: 0.99 }],
	},
	submitGradient: {
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
	},
	submitGradientDisabled: {
		opacity: 0.6,
	},
	submitText: {
		fontSize: 16,
		fontFamily: fontFamilies.bold,
		color: colors.white,
	},
});
