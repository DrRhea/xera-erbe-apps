import React, { FC, useCallback, useMemo, useState } from 'react';
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import UploadIcon from '../../../assets/icons/upload.svg';
import ChevronIcon from '../../../assets/icons/vector.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Analysis' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

type TryoutRegistrationRouteProp = RouteProp<RootStackParamList, 'TryoutRegistrationFree'>;

const placeholderColor = 'rgba(0,69,89,0.5)';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type IdentityFieldKey = 'fullName' | 'school' | 'phone' | 'socialMedia';

type IdentityFieldConfig = {
	key: IdentityFieldKey;
	placeholder: string;
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
	autoCapitalize?: 'none' | 'sentences' | 'words';
	showDropdown?: boolean;
};

const identityFields: IdentityFieldConfig[] = [
	{ key: 'fullName', placeholder: 'Nama Lengkap', autoCapitalize: 'words' },
	{ key: 'school', placeholder: 'Asal Sekolah', autoCapitalize: 'words', showDropdown: true },
	{ key: 'phone', placeholder: 'Nomor HP/Whatsapp', keyboardType: 'phone-pad' },
	{ key: 'socialMedia', placeholder: 'Sosial Media', autoCapitalize: 'none' },
];

type UploadRequirementKey = 'poster' | 'social';

const uploadRequirements: { key: UploadRequirementKey; title: string; helper: string }[] = [
	{ key: 'poster', title: 'Bukti Share Poster', helper: 'Upload di sini' },
	{ key: 'social', title: 'Bukti Follow Sosmed', helper: 'Upload di sini' },
];

const TryoutRegistrationFreeScreen: FC = () => {
	const {
		params: { tryoutId, title, dateLabel },
	} = useRoute<TryoutRegistrationRouteProp>();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const layout = useResponsiveLayout();

	const handleNotificationPress = useCallback(() => {
		navigation.navigate('Notification');
	}, [navigation]);

	const [identityState, setIdentityState] = useState<Record<IdentityFieldKey, string>>({
		fullName: '',
		school: '',
		phone: '',
		socialMedia: '',
	});

	const contentHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding]
	);
	const sectionSpacing = useMemo(
		() => clamp(layout.sectionSpacing * 0.7, 20, 32),
		[layout.sectionSpacing]
	);
	const heroCardPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.65, 16, 24),
		[layout.horizontalPadding]
	);
	const heroCardPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding, 18, 30),
		[layout.horizontalPadding]
	);
	const heroCardGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 12, 18),
		[layout.horizontalPadding]
	);
	const iconWrapperSize = useMemo(
		() => clamp(layout.horizontalPadding * 2.3, 42, 58),
		[layout.horizontalPadding]
	);
	const iconImageSize = useMemo(
		() => clamp(iconWrapperSize * 0.88, 34, 50),
		[iconWrapperSize]
	);
	const inputHeight = useMemo(
		() => clamp(layout.horizontalPadding * 2.4, 52, 60),
		[layout.horizontalPadding]
	);
	const inputPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.8, 18, 24),
		[layout.horizontalPadding]
	);
	const inputSpacing = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 10, 16),
		[layout.horizontalPadding]
	);
	const uploadGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 12, 18),
		[layout.horizontalPadding]
	);
	const uploadCardHeight = useMemo(
		() => clamp(layout.horizontalPadding * 4.8, 110, 126),
		[layout.horizontalPadding]
	);
	const uploadIconSize = useMemo(
		() => clamp(layout.horizontalPadding * 1.4, 32, 38),
		[layout.horizontalPadding]
	);
	const uploadCardMinWidth = useMemo(
		() => clamp(layout.innerContentWidth * 0.46, 160, 200),
		[layout.innerContentWidth]
	);
	const uploadHelperFontSize = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 10, 12),
		[layout.horizontalPadding]
	);
	const ctaPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.55, 14, 18),
		[layout.horizontalPadding]
	);

	const handleInputChange = useCallback((key: IdentityFieldKey, value: string) => {
		setIdentityState((prev) => ({ ...prev, [key]: value }));
	}, []);

	const handleUploadPress = useCallback((type: UploadRequirementKey) => {
		Alert.alert('Upload Berkas', `Integrasikan unggahan untuk ${type} di tahap berikutnya.`);
	}, []);

	const handleSubmit = useCallback(() => {
		Alert.alert('Kirim Form', 'Fitur pengiriman form akan tersedia segera.');
	}, []);

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.select({ ios: 'padding', android: undefined })}
				keyboardVerticalOffset={Platform.select({ ios: 24, android: 0 })}
			>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={[
						styles.scrollContent,
						{
							alignItems: 'center',
							paddingBottom: clamp(layout.sectionSpacing * 3.2, 108, 180),
						},
					]}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
				>
					<View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
						<AppHeader title="Kembali" contentHorizontalPadding={contentHorizontalPadding} onNotificationPress={handleNotificationPress} />
					</View>

					<View
						style={[
							styles.contentWrapper,
							{
								width: layout.contentWidth,
								paddingHorizontal: contentHorizontalPadding,
								marginTop: clamp(layout.sectionSpacing * 0.4, 18, 28),
								rowGap: sectionSpacing,
								gap: sectionSpacing,
							},
						]}
					>
						<Text style={styles.screenTitle}>Lengkapi Identitas Dulu, Yuk!</Text>

						<View
							style={[
								styles.heroCard,
								{
									paddingVertical: heroCardPaddingVertical,
									paddingHorizontal: heroCardPaddingHorizontal,
									columnGap: heroCardGap,
									gap: heroCardGap,
								},
							]}
						>
							<View
								style={[
									styles.iconWrapper,
									{
										width: iconWrapperSize,
										height: iconWrapperSize,
										borderRadius: clamp(iconWrapperSize * 0.32, 12, 18),
									},
								]}
							>
								<Image
									source={tryoutCardImage}
									style={{ width: iconImageSize, height: iconImageSize }}
									resizeMode="contain"
								/>
							</View>
							<View style={styles.heroContent}>
								<View style={styles.heroHeaderRow}>
									<Text style={styles.heroTitle}>{title}</Text>
									<Text style={styles.heroDate}>{dateLabel}</Text>
								</View>
								<Text style={styles.heroSubtitle}>ID Tryout: {tryoutId.toUpperCase()}</Text>
							</View>
						</View>

						<View style={{ rowGap: inputSpacing, gap: inputSpacing }}>
							<Text style={styles.sectionHeading}>Identitas Diri</Text>
							{identityFields.map((field) => (
								<View key={field.key} style={[styles.inputWrapper, { height: inputHeight }]}>
									<TextInput
										value={identityState[field.key]}
										onChangeText={(value) => handleInputChange(field.key, value)}
										style={[styles.inputField, { paddingHorizontal: inputPaddingHorizontal }]}
										placeholder={field.placeholder}
										placeholderTextColor={placeholderColor}
										keyboardType={field.keyboardType ?? 'default'}
										autoCapitalize={field.autoCapitalize ?? 'sentences'}
										returnKeyType="next"
									/>
									{field.showDropdown ? (
										<Pressable
											style={styles.inputTrailingIcon}
											accessibilityRole="button"
											accessibilityLabel="Pilih asal sekolah"
											onPress={() => Alert.alert('Asal Sekolah', 'Integrasikan daftar sekolah di tahap berikutnya.')}
										>
											<ChevronIcon width={10} height={6} style={styles.dropdownIcon} />
										</Pressable>
									) : null}
								</View>
							))}
						</View>

						<View style={{ rowGap: inputSpacing, gap: inputSpacing }}>
							<Text style={styles.sectionHeading}>Bukti Pendukung</Text>
							<View
								style={[
									styles.uploadRow,
									{
										columnGap: uploadGap,
										rowGap: uploadGap,
										gap: uploadGap,
									},
								]}
							>
								{uploadRequirements.map((requirement) => (
									<Pressable
										key={requirement.key}
										onPress={() => handleUploadPress(requirement.key)}
										style={[
											styles.uploadCard,
											{
												minHeight: uploadCardHeight,
												minWidth: uploadCardMinWidth,
												paddingHorizontal: clamp(inputPaddingHorizontal, 18, 24),
											},
										]}
										accessibilityRole="button"
										accessibilityLabel={`Unggah ${requirement.title}`}
									>
										<Text style={styles.uploadTitle}>{requirement.title}</Text>
										<View style={[styles.uploadIconWrapper, { width: uploadIconSize, height: uploadIconSize }]}>
											<UploadIcon width={uploadIconSize} height={uploadIconSize} />
										</View>
										<Text style={[styles.uploadHelper, { fontSize: uploadHelperFontSize }]}>{requirement.helper}</Text>
									</Pressable>
								))}
							</View>
						</View>

						<Pressable
							onPress={handleSubmit}
							style={[styles.ctaButton, { paddingVertical: ctaPaddingVertical }]}
							accessibilityRole="button"
							accessibilityLabel="Kirim pendaftaran tryout"
						>
							<Text style={styles.ctaLabel}>Kirim</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
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

export default TryoutRegistrationFreeScreen;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: colors.background,
	},
	flex: {
		flex: 1,
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
	screenTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 17,
		color: colors.sectionTitle,
	},
	heroCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary,
		borderRadius: 20,
		width: '100%',
	},
	iconWrapper: {
		backgroundColor: colors.white,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 14,
	},
	heroContent: {
		flex: 1,
		alignItems: 'flex-start',
		gap: 6,
	},
	heroHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	heroTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.white,
		flex: 1,
		marginRight: 12,
	},
	heroDate: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 11,
		color: 'rgba(255,255,255,0.85)',
	},
	heroSubtitle: {
		fontFamily: fontFamilies.medium,
		fontSize: 11,
		color: 'rgba(255,255,255,0.85)',
	},
	sectionHeading: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	inputWrapper: {
		width: '100%',
		backgroundColor: colors.white,
		borderRadius: 20,
		justifyContent: 'center',
	},
	inputField: {
		flex: 1,
		height: '100%',
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	inputTrailingIcon: {
		position: 'absolute',
		right: 18,
		top: '50%',
		transform: [{ translateY: -8 }],
		padding: 8,
	},
	dropdownIcon: {
		transform: [{ rotate: '90deg' }],
	},
	uploadRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	uploadCard: {
		flexGrow: 1,
		flexBasis: '48%',
		backgroundColor: colors.white,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 18,
		gap: 12,
	},
	uploadTitle: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 13,
		color: colors.sectionTitle,
		textAlign: 'center',
	},
	uploadIconWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	uploadHelper: {
		fontFamily: fontFamilies.medium,
		color: 'rgba(0,69,89,0.5)',
		textAlign: 'center',
	},
	ctaButton: {
		width: '100%',
		backgroundColor: colors.accent,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	ctaLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 16,
		color: colors.white,
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
