import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, type NavigationProp } from '@react-navigation/native';

import AuthLayout from './AuthLayout';
import { colors, fontFamilies } from '../../constants/theme';
import { registerMockUser } from '../../services/mockAuthService';
import type { RootStackParamList } from '../../../App';

const buttonGradient = ['#1C637B', '#B0ED9F'] as const;
const placeholderColor = '#9D9D9D';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterScreen: React.FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const isSubmitDisabled = useMemo(() => {
		if (submitting) {
			return true;
		}

		const trimmedName = name.trim();
		const trimmedPassword = password.trim();
		const trimmedEmail = email.trim();

		if (!trimmedName || trimmedName.length < 2) {
			return true;
		}

		if (!emailRegex.test(trimmedEmail)) {
			return true;
		}

		if (trimmedPassword.length < 6) {
			return true;
		}

		return false;
	}, [email, name, password, submitting]);

	const handleNavigateToLogin = useCallback(() => {
		navigation.navigate('Login');
	}, [navigation]);

	const handleRegister = useCallback(() => {
		if (isSubmitDisabled) {
			return;
		}

		setSubmitting(true);
		setErrorMessage('');

		const result = registerMockUser({
			name,
			email,
			password,
		});

		if (!result.success) {
			setErrorMessage(result.error);
			setSubmitting(false);
			return;
		}

		setName('');
		setEmail('');
		setPassword('');
		setSubmitting(false);

		Alert.alert('Registrasi Berhasil', 'Akun kamu sudah siap. Yuk masuk sekarang!', [
			{
				text: 'Masuk',
				onPress: handleNavigateToLogin,
			},
		]);
	}, [email, handleNavigateToLogin, isSubmitDisabled, name, password]);

	return (
		<AuthLayout>
			<View style={styles.formStack}>
				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Nama"
					placeholderTextColor={placeholderColor}
					style={styles.input}
					autoCapitalize="words"
					returnKeyType="next"
					textContentType="name"
				/>
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
					onSubmitEditing={handleRegister}
					textContentType="password"
				/>
			</View>

			{errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

			<Pressable
				onPress={handleNavigateToLogin}
				style={({ pressed }) => [styles.helperLinkWrapper, pressed && styles.helperLinkPressed]}
			>
				<Text style={styles.helperLink}>Sudah memiliki akun?</Text>
			</Pressable>

			<Pressable
				onPress={handleRegister}
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
					<Text style={styles.submitText}>{submitting ? 'Memproses...' : 'Daftar'}</Text>
				</LinearGradient>
			</Pressable>
		</AuthLayout>
	);
};

export default RegisterScreen;

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
