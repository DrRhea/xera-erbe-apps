import React, { FC, useCallback, useMemo, useState } from 'react';
import {
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	View,
	Modal,
} from 'react-native';
import { useNavigation, useFocusEffect, type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import SearchBar from '../../components/SearchBar';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { tryoutService, type TryoutPackage, type TryoutEnrollment } from '../../services/tryoutService';
import { authService } from '../../services/authService';

type ActiveTryout = {
	id: string;
	title: string;
	enrollmentStatus?: 'pending' | 'approved' | 'rejected';
	sessions?: any[];
};

type UpcomingTryout = {
	id: string;
	title: string;
	dateLabel: string;
	statusLabel: string;
	statusVariant: 'free' | 'paid';
	enrollmentType: 'open' | 'paid' | 'free_with_proof';
	enrollmentStatus?: 'pending' | 'approved' | 'rejected';
};

type CompletedTryout = {
	id: string;
	title: string;
	dateLabel: string;
	score: number;
	enrollmentStatus?: 'pending' | 'approved' | 'rejected';
	discussionStartsAt?: string;
	discussionEndsAt?: string;
};

const tryoutCardImage = require('../../../assets/images/tryoutimage.png');

const navItems: BottomNavigationItem[] = [
	{ key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
	{ key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
	{ key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
	{ key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const TryoutScreen: FC = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const layout = useResponsiveLayout();
	const [activeTryouts, setActiveTryouts] = useState<ActiveTryout[]>([]);
	const [upcomingTryouts, setUpcomingTryouts] = useState<UpcomingTryout[]>([]);
	const [completedTryouts, setCompletedTryouts] = useState<CompletedTryout[]>([]);
	const [discussionModalVisible, setDiscussionModalVisible] = useState(false);
	const [discussionDate, setDiscussionDate] = useState<string>('');

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				try {
					const packages = await tryoutService.getPackages(undefined); // Fetch all
					const user = await authService.getUser();
					
					const active: ActiveTryout[] = [];
					const upcoming: UpcomingTryout[] = [];
					const completed: CompletedTryout[] = [];
					const now = new Date();

					for (const pkg of packages) {
						// Fetch enrollment for this package
						let enrollmentStatus: 'pending' | 'approved' | 'rejected' | undefined;
						let sessions: any[] = [];
						try {
							const enrollments = await tryoutService.getMyEnrollments(pkg.id);
							const myEnrollment = enrollments.find(e => e.userId === user?.id);
							if (myEnrollment) {
								enrollmentStatus = myEnrollment.status;
								sessions = myEnrollment.sessions || [];
							}
						} catch (e) {
							console.log('Error fetching enrollment', e);
						}

						const endsAt = new Date(pkg.endsAt);
						const isExpired = endsAt < now;

						// Check if all subtests are completed
						// We need to know total subtests for this package.
						// Ideally getPackages should return subtest count or we fetch it.
						// For performance, maybe we assume if user has sessions and isExpired it's done?
						// Or we fetch subtests for each package (might be slow).
						// Let's try to fetch subtests count if possible or just fetch subtests.
						let isFullyCompleted = false;
						let subtests: any[] = [];
						if (enrollmentStatus === 'approved') {
							subtests = await tryoutService.getSubtests(pkg.id);
							const completedSessions = sessions.filter(s => s.status === 'completed');
							if (subtests.length > 0 && completedSessions.length === subtests.length) {
								isFullyCompleted = true;
							}
						}

						if (enrollmentStatus === 'approved') {
							if (isExpired || isFullyCompleted) {
								// Calculate score (average of sessions)
								let totalScore = 0;
								let validSessionsCount = 0;
								
								// We need to know the total number of subtests to calculate the average correctly
								// If we don't have it, we might calculate average based on completed sessions only?
								// Usually average is Total Score / Total Subtests.
								// We fetched subtests above if enrollmentStatus === 'approved'.
								let subtestCount = 0;
								if (subtests.length > 0) {
									subtestCount = subtests.length;
								} else {
									// Fallback if we didn't fetch subtests (e.g. expired but not fully completed logic path?)
									// But we only enter here if isExpired or isFullyCompleted.
									// If isFullyCompleted, we fetched subtests.
									// If isExpired, we might not have fetched subtests.
									// Let's fetch subtests if we haven't.
									try {
										const s = await tryoutService.getSubtests(pkg.id);
										subtestCount = s.length;
									} catch (e) {
										console.log('Failed to fetch subtests for score calc', e);
									}
								}

								sessions.forEach(s => {
									if (s.score !== undefined && s.score !== null) {
										const val = Number(s.score);
										if (!isNaN(val)) {
											totalScore += val;
											validSessionsCount++;
										}
									}
								});
								
								const finalScore = subtestCount > 0 ? totalScore / subtestCount : 0;
								
								const dateLabel = endsAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

								completed.push({
									id: pkg.id,
									title: pkg.title,
									dateLabel,
									score: finalScore,
									enrollmentStatus,
									discussionStartsAt: pkg.discussionStartsAt,
									discussionEndsAt: pkg.discussionEndsAt,
								});
							} else {
								active.push({
									id: pkg.id,
									title: pkg.title,
									enrollmentStatus,
									sessions,
								});
							}
						} else {
							// Upcoming (Pending or Not Registered)
							// Only show if not expired? Or show expired as "Missed"?
							// User said "upcoming tryout is for all tryout that the user can register or has registered but with a pending status"
							// Usually we don't show expired tryouts in upcoming.
							if (!isExpired) {
								// Format date
								const date = new Date(pkg.startsAt);
								const dateLabel = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
								
								let statusLabel = 'Gratis';
								let statusVariant: 'free' | 'paid' = 'free';
								
								if (pkg.enrollmentType === 'paid') {
									statusLabel = 'Berbayar';
									statusVariant = 'paid';
								} else if (pkg.enrollmentType === 'free_with_proof') {
									statusLabel = 'Gratis (Syarat)';
									statusVariant = 'free';
								}

								upcoming.push({
									id: pkg.id,
									title: pkg.title,
									dateLabel,
									statusLabel,
									statusVariant,
									enrollmentType: pkg.enrollmentType,
									enrollmentStatus,
								});
							}
						}
					}
					setActiveTryouts(active);
					setUpcomingTryouts(upcoming);
					setCompletedTryouts(completed);
				} catch (error) {
					console.error('Failed to fetch tryouts', error);
				}
			};
			fetchData();
		}, [])
	);

	const handleNotificationPress = useCallback(() => {
		navigation.navigate('Notification');
	}, [navigation]);

	const activeCardGap = useMemo(() => clamp(layout.horizontalPadding * 0.6, 12, 18), [layout.horizontalPadding]);
	const activeCardPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.7, 16, 22),
		[layout.horizontalPadding]
	);
	const activeCardPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding, 16, 26),
		[layout.horizontalPadding]
	);
	const activeCardContentGap = useMemo(() => clamp(layout.horizontalPadding * 0.4, 10, 16), [layout.horizontalPadding]);
	const activeCardWidth = useMemo(() => layout.innerContentWidth, [layout.innerContentWidth]);

	const iconWrapperSize = useMemo(() => clamp(layout.horizontalPadding * 2.4, 46, 58), [layout.horizontalPadding]);
	const iconImageSize = useMemo(() => clamp(iconWrapperSize * 0.85, 36, 50), [iconWrapperSize]);
	const actionBadgePaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.55, 14, 18),
		[layout.horizontalPadding]
	);
	const actionBadgePaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.35, 6, 8),
		[layout.horizontalPadding]
	);

	const sectionSpacing = useMemo(() => clamp(layout.sectionSpacing * 0.75, 20, 32), [layout.sectionSpacing]);
	const contentHorizontalPadding = useMemo(() => clamp(layout.horizontalPadding, 20, 28), [layout.horizontalPadding]);

	const upcomingCardPadding = useMemo(
		() => clamp(layout.horizontalPadding * 0.95, 18, 26),
		[layout.horizontalPadding]
	);
	const upcomingCardGap = useMemo(() => clamp(layout.horizontalPadding * 0.5, 12, 18), [layout.horizontalPadding]);
	const upcomingBadgePaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.45, 12, 18),
		[layout.horizontalPadding]
	);
	const upcomingBadgePaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.25, 4, 8),
		[layout.horizontalPadding]
	);

	const handleCompletedCardPress = useCallback(
		(tryout: CompletedTryout) => {
			const now = new Date();
			const start = tryout.discussionStartsAt ? new Date(tryout.discussionStartsAt) : null;
			const end = tryout.discussionEndsAt ? new Date(tryout.discussionEndsAt) : null;

			if (start && now < start) {
				setDiscussionDate(start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
				setDiscussionModalVisible(true);
				return;
			}

			if (end && now > end) {
				// Optional: Handle expired discussion
			}

			navigation.navigate('TryoutDetail', {
				tryoutId: tryout.id,
				title: tryout.title,
				isReview: true,
			});
		},
		[navigation]
	);

	const handleActiveCardPress = useCallback(
		(tryout: ActiveTryout) => {
			navigation.navigate('TryoutDetail', {
				tryoutId: tryout.id,
				title: tryout.title,
			});
		},
		[navigation]
	);

	const handleUpcomingCardPress = useCallback(
		(tryout: UpcomingTryout) => {
			if (tryout.enrollmentStatus === 'pending') {
				alert('Pendaftaran sedang diverifikasi admin.');
			} else {
				navigation.navigate('TryoutDesc', {
					tryoutId: tryout.id,
					title: tryout.title,
					dateLabel: tryout.dateLabel,
					statusLabel: tryout.statusLabel,
					statusVariant: tryout.statusVariant,
				});
			}
		},
		[navigation]
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
					<AppHeader title="Tryout" contentHorizontalPadding={contentHorizontalPadding} onNotificationPress={handleNotificationPress} />
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
					<SearchBar
						placeholder="Mau belajar apa nih?"
						style={[styles.searchBar, { marginBottom: clamp(sectionSpacing * 0.35, 12, 20) }]}
					/>

					{activeTryouts.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Try Out Erbe (Aktif)</Text>
							<View
								style={[
									styles.activeGrid,
									{
										rowGap: activeCardGap,
										width: '100%',
									},
								]}
							>
								{activeTryouts.map((tryout) => (
									<Pressable
										key={tryout.id}
										onPress={() => handleActiveCardPress(tryout)}
										style={[
											styles.activeCard,
											{
												paddingVertical: activeCardPaddingVertical,
												paddingHorizontal: activeCardPaddingHorizontal,
												columnGap: activeCardContentGap,
												maxWidth: activeCardWidth,
												alignSelf: 'center',
											},
										]}
										accessibilityRole="button"
										accessibilityLabel={`Buka ${tryout.title}`}
									>
										<View
											style={[
												styles.activeIconWrapper,
												{
													width: iconWrapperSize,
													height: iconWrapperSize,
													borderRadius: clamp(iconWrapperSize * 0.34, 12, 18),
												},
											]}
										>
											<Image
												source={tryoutCardImage}
												style={{ width: iconImageSize, height: iconImageSize }}
												resizeMode="contain"
											/>
										</View>
										<View style={[styles.activeContent, { marginLeft: activeCardContentGap }]}>
											<Text style={styles.activeTitle}>{tryout.title}</Text>
											<View
												style={[
													styles.activeActionBadge,
													{
														paddingHorizontal: actionBadgePaddingHorizontal,
														paddingVertical: actionBadgePaddingVertical,
													},
												]}
											>
												<Text style={styles.activeActionLabel}>Kerjakan</Text>
											</View>
										</View>
									</Pressable>
								))}
							</View>
						</View>
					)}

					{upcomingTryouts.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Daftar TO Erbe Selanjutnya</Text>
							<View style={[styles.upcomingList, { rowGap: upcomingCardGap, gap: upcomingCardGap }]}>
								{upcomingTryouts.map((tryout) => (
									<Pressable
										key={tryout.id}
										onPress={() => handleUpcomingCardPress(tryout)}
										style={[styles.upcomingCard, { padding: upcomingCardPadding }]}
										accessibilityRole="button"
										accessibilityLabel={`Daftar ${tryout.title}`}
									>
										<View style={[styles.upcomingIconWrapper, { width: iconWrapperSize + 6, height: iconWrapperSize + 6 }]}>
											<Image
												source={tryoutCardImage}
												style={{ width: iconImageSize + 8, height: iconImageSize + 8 }}
												resizeMode="contain"
											/>
										</View>
										<View style={styles.upcomingMeta}>
											<View
												style={[
													styles.statusBadge,
													tryout.statusVariant === 'free' ? styles.statusBadgeFree : styles.statusBadgePaid,
													{
														paddingHorizontal: upcomingBadgePaddingHorizontal,
														paddingVertical: upcomingBadgePaddingVertical,
													},
												]}
											>
												<Text
													style={[
														styles.statusBadgeText,
														tryout.statusVariant === 'free' ? styles.statusBadgeTextFree : styles.statusBadgeTextPaid,
													]}
												>
													{tryout.statusLabel}
												</Text>
											</View>
											<Text style={styles.upcomingTitle}>{tryout.title}</Text>
											<Text style={styles.upcomingDate}>{tryout.dateLabel}</Text>
										</View>
										<View
											style={[
												styles.upcomingCta,
												{
													paddingHorizontal: actionBadgePaddingHorizontal,
													paddingVertical: actionBadgePaddingVertical,
													backgroundColor: tryout.enrollmentStatus === 'pending' ? '#FFC107' : colors.accent
												},
											]}
										>
											<Text style={styles.upcomingCtaLabel}>
												{tryout.enrollmentStatus === 'pending' ? 'Menunggu' : 'Daftar Sekarang'}
											</Text>
										</View>
									</Pressable>
								))}
							</View>
						</View>
					)}

					{completedTryouts.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Try Out yang Sudah Dikerjakan</Text>
							<View style={[styles.upcomingList, { rowGap: upcomingCardGap, gap: upcomingCardGap }]}>
								{completedTryouts.map((tryout) => (
									<Pressable
										key={tryout.id}
										onPress={() => handleCompletedCardPress(tryout)}
										style={[styles.upcomingCard, { padding: upcomingCardPadding }]}
										accessibilityRole="button"
										accessibilityLabel={`Lihat Pembahasan ${tryout.title}`}
									>
										<View style={[styles.upcomingIconWrapper, { width: iconWrapperSize + 6, height: iconWrapperSize + 6 }]}>
											<Image
												source={tryoutCardImage}
												style={{ width: iconImageSize + 8, height: iconImageSize + 8 }}
												resizeMode="contain"
											/>
										</View>
										<View style={styles.upcomingMeta}>
											<View
												style={[
													styles.statusBadge,
													styles.statusBadgeFree,
													{
														paddingHorizontal: upcomingBadgePaddingHorizontal,
														paddingVertical: upcomingBadgePaddingVertical,
													},
												]}
											>
												<Text style={[styles.statusBadgeText, styles.statusBadgeTextFree]}>
													Selesai
												</Text>
											</View>
											<Text style={styles.upcomingTitle}>{tryout.title}</Text>
											<Text style={styles.upcomingDate}>{tryout.dateLabel}</Text>
											<View style={{ marginTop: 8 }}>
												<View style={[styles.activeActionBadge, { paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', backgroundColor: colors.accent }]}>
													<Text style={[styles.activeActionLabel, { fontSize: 10 }]}>Lihat Pembahasan</Text>
												</View>
											</View>
										</View>
										<View style={{ alignItems: 'center', justifyContent: 'center' }}>
											<View style={{ 
												width: 60, 
												height: 60, 
												borderRadius: 30, 
												borderWidth: 4, 
												borderColor: '#4CAF50', 
												alignItems: 'center', 
												justifyContent: 'center' 
											}}>
												<Text style={{ fontFamily: fontFamilies.bold, fontSize: 14, color: '#4CAF50' }}>
													{tryout.score}
												</Text>
											</View>
										</View>
									</Pressable>
								))}
							</View>
						</View>
					)}
				</View>
			</ScrollView>
			<BottomNavigation
				items={navItems}
				activeKey="home"
				backgroundColor={colors.white}
				activeColor={colors.primary}
				inactiveColor="#617283"
				style={styles.bottomNav}
			/>

			<Modal
				visible={discussionModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setDiscussionModalVisible(false)}
			>
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Pembahasan Belum Tersedia</Text>
						<Text style={styles.modalMessage}>
							Pembahasan akan tersedia pada {discussionDate}, tunggu sampai try-outnya selesai yaa!
						</Text>
						<Pressable
							onPress={() => setDiscussionModalVisible(false)}
							style={styles.modalButton}
						>
							<Text style={styles.modalButtonText}>OK</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

export default TryoutScreen;

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
	contentWrapper: {
		alignSelf: 'center',
	},
	section: {
		width: '100%',
	},
	headerWrapper: {
		alignSelf: 'center',
	},
	searchBar: {
		width: '100%',
	},
	sectionTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.sectionTitle,
		marginBottom: 14,
	},
	activeGrid: {
		flexDirection: 'column',
		rowGap: 16,
	},
	activeCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary,
		borderRadius: 20,
		width: '100%',
	},
	activeIconWrapper: {
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		borderTopRightRadius: 14,
	},
	activeContent: {
		flex: 1,
		alignItems: 'flex-start',
		gap: 8,
	},
	activeTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.white,
		textAlign: 'left',
	},
	activeActionBadge: {
		backgroundColor: colors.accent,
		borderRadius: 12,
	},
	activeActionLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 9,
		color: colors.white,
		textAlign: 'center',
	},
	modalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
	},
	modalCard: {
		width: '100%',
		backgroundColor: colors.white,
		borderRadius: 20,
		padding: 24,
		alignItems: 'center',
		elevation: 5,
	},
	modalTitle: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 18,
		color: colors.primaryDark,
		textAlign: 'center',
		marginBottom: 12,
	},
	modalMessage: {
		fontFamily: fontFamilies.medium,
		fontSize: 14,
		color: colors.primaryDark,
		textAlign: 'center',
		marginBottom: 24,
		lineHeight: 20,
	},
	modalButton: {
		backgroundColor: colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 12,
		minWidth: 120,
		alignItems: 'center',
	},
	modalButtonText: {
		fontFamily: fontFamilies.bold,
		fontSize: 14,
		color: colors.white,
	},
	upcomingList: {
		width: '100%',
	},
	upcomingCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: colors.white,
		borderRadius: 20,
		shadowColor: colors.primaryDark,
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
	upcomingIconWrapper: {
		backgroundColor: colors.white,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
	},
	upcomingMeta: {
		flex: 1,
	},
	statusBadge: {
		alignSelf: 'flex-start',
		borderRadius: 12,
		marginBottom: 6,
	},
	statusBadgeFree: {
		backgroundColor: '#C2FFCF',
	},
	statusBadgePaid: {
		backgroundColor: '#C2DFFF',
	},
	statusBadgeText: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 10,
	},
	statusBadgeTextFree: {
		color: '#065900',
	},
	statusBadgeTextPaid: {
		color: colors.sectionTitle,
	},
	upcomingTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.sectionTitle,
	},
	upcomingDate: {
		marginTop: 2,
		fontFamily: fontFamilies.medium,
		fontSize: 12,
		color: colors.textSecondary,
	},
	upcomingCta: {
		marginLeft: 18,
		backgroundColor: colors.accent,
		borderRadius: 14,
	},
	upcomingCtaLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 10,
		color: colors.white,
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
