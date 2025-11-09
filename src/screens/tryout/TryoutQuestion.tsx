import React, {
	FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { CommonActions, useNavigation, type NavigationProp } from '@react-navigation/native';
import {
	Image,
	Modal,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
	BottomSheetBackgroundProps,
	BottomSheetScrollView,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';
import type { RootStackParamList } from '../../../App';
import { resolveTryoutSubtest } from '../../data/tryoutContent';
import {
	getTryoutQuestions,
	type TryoutQuestion,
	type TryoutQuestionOption,
} from '../../data/tryoutQuestions';
import { markTryoutSubtestCompleted } from '../../data/tryoutProgress';
import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';

const examBadge = require('../../../assets/images/tryoutimage.png');
const poweredByLogo = require('../../../assets/images/logoutuhijo.png');

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const formatSeconds = (totalSeconds: number): string => {
	const safeSeconds = Math.max(Math.floor(totalSeconds), 0);
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;
	return [hours, minutes, seconds].map((segment) => segment.toString().padStart(2, '0')).join(':');
};

type QuestionState = {
	answerId: string | null;
	flagged: boolean;
};

type QuestionStatus = 'current' | 'answered' | 'flagged' | 'unanswered';

type TryoutQuestionRoute = RouteProp<RootStackParamList, 'TryoutQuestion'>;

const TryoutQuestionScreen: FC = () => {
	const route = useRoute<TryoutQuestionRoute>();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const { tryoutId, subtestId, subtestTitle, tryoutTitle } = route.params;
	const layout = useResponsiveLayout();
	const sheetRef = useRef<BottomSheet>(null);

	const subtestDetail = useMemo(
		() => resolveTryoutSubtest(tryoutId, subtestId, subtestTitle),
		[tryoutId, subtestId, subtestTitle]
	);
	const initialDurationSeconds = useMemo(
		() => Math.max(subtestDetail.durationMinutes, 0) * 60,
		[subtestDetail.durationMinutes]
	);
	const [remainingSeconds, setRemainingSeconds] = useState(initialDurationSeconds);
	const [isSubmitDialogVisible, setSubmitDialogVisible] = useState(false);
	const formattedTimer = useMemo(() => formatSeconds(remainingSeconds), [remainingSeconds]);
	const isTimerRunning = remainingSeconds > 0;

	useEffect(() => {
		// Reset the countdown if the selected subtest changes.
		setRemainingSeconds(initialDurationSeconds);
	}, [initialDurationSeconds]);

	useEffect(() => {
		if (!isTimerRunning) {
			return;
		}
		const intervalId = setInterval(() => {
			setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);
		return () => clearInterval(intervalId);
	}, [isTimerRunning]);

	const handleNotificationPress = useCallback(() => {
		navigation.navigate('Notification');
	}, [navigation]);

	const questions = useMemo(
		() => getTryoutQuestions(tryoutId, subtestId, subtestDetail.title),
		[tryoutId, subtestId, subtestDetail.title]
	);
	const questionNumbers = useMemo(
		() => questions.map((question) => question.number),
		[questions]
	);

	const totalQuestions = questions.length;
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [questionStates, setQuestionStates] = useState<QuestionState[]>(() =>
		questions.map(() => ({ answerId: null, flagged: false }))
	);

	useEffect(() => {
		setCurrentQuestionIndex(0);
		setQuestionStates(questions.map(() => ({ answerId: null, flagged: false })));
	}, [questions]);

		const currentQuestion = questions[currentQuestionIndex];
		const currentState = questionStates[currentQuestionIndex] ?? {
			answerId: null,
			flagged: false,
		};

			if (!currentQuestion) {
				return null;
			}

		const snapPoints = useMemo<(string | number)[]>(() => [210, '70%'], []);
		const optionRows = useMemo<TryoutQuestionOption[][]>(() => {
			const rows: TryoutQuestionOption[][] = [];
			for (let index = 0; index < currentQuestion.options.length; index += 2) {
				rows.push(currentQuestion.options.slice(index, index + 2));
			}
			return rows;
		}, [currentQuestion.options]);

	const contentHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 20, 28),
		[layout.horizontalPadding]
	);
	const sectionSpacing = useMemo(
		() => clamp(layout.sectionSpacing * 0.6, 18, 28),
		[layout.sectionSpacing]
	);
	const summaryCardPadding = useMemo(
		() => clamp(layout.horizontalPadding * 0.85, 18, 26),
		[layout.horizontalPadding]
	);
	const summaryCardGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.55, 14, 20),
		[layout.horizontalPadding]
	);
	const optionGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.6, 14, 22),
		[layout.horizontalPadding]
	);
	const optionPaddingVertical = useMemo(
		() => clamp(layout.horizontalPadding * 0.9, 16, 24),
		[layout.horizontalPadding]
	);
	const optionPaddingHorizontal = useMemo(
		() => clamp(layout.horizontalPadding * 0.8, 16, 24),
		[layout.horizontalPadding]
	);
	const controlsGap = useMemo(
		() => clamp(layout.horizontalPadding * 0.5, 14, 20),
		[layout.horizontalPadding]
	);
	const gridBadgeSize = useMemo(
		() => clamp(layout.horizontalPadding * 2.7, 64, 72),
		[layout.horizontalPadding]
	);
	const sheetHorizontalPadding = useMemo(
		() => clamp(layout.horizontalPadding, 18, 26),
		[layout.horizontalPadding]
	);

	const getQuestionStatus = useCallback(
		(index: number): QuestionStatus => {
			if (index === currentQuestionIndex) {
				return 'current';
			}

			const state = questionStates[index];
			if (!state) {
				return 'unanswered';
			}

			if (state.flagged) {
				return 'flagged';
			}

			if (state.answerId) {
				return 'answered';
			}

			return 'unanswered';
		},
		[currentQuestionIndex, questionStates]
	);

		const buildBadgePresentation = useCallback(
			(status: QuestionStatus) => {
				const size = gridBadgeSize;
				let borderWidth = 0;
				let backgroundColor: string = colors.white;
				let borderColor: string = 'transparent';
				let textColor: string = colors.primaryDark;

				if (status === 'current') {
					backgroundColor = colors.primaryDark;
					borderColor = colors.white;
					borderWidth = 2;
					textColor = colors.white;
				} else if (status === 'answered') {
					backgroundColor = colors.primary;
					borderColor = colors.white;
					borderWidth = 2;
					textColor = colors.white;
				} else if (status === 'flagged') {
					backgroundColor = colors.accent;
					borderColor = colors.white;
					borderWidth = 2;
					textColor = colors.white;
				}

				const containerStyle: ViewStyle = {
					width: size,
					height: size,
					borderRadius: 20,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor,
					borderColor,
					borderWidth,
				};

				const labelStyle: TextStyle = {
					color: textColor,
					fontSize: clamp(size * 0.45, 22, 30),
				};

				return {
					containerStyle,
					labelStyle,
				};
			},
			[gridBadgeSize]
		);

		const renderBadge = useCallback(
			(number: number, onPress?: () => void) => {
			const status = getQuestionStatus(number - 1);
				const presentation = buildBadgePresentation(status);

			return (
				<Pressable
						key={`question-${number}`}
							style={[styles.questionBadgeBase, presentation.containerStyle]}
					onPress={onPress}
					disabled={!onPress}
					accessibilityRole={onPress ? 'button' : undefined}
					accessibilityLabel={`Pergi ke soal nomor ${number}`}
				>
							<Text style={[styles.questionBadgeLabel, presentation.labelStyle]}>{number}</Text>
				</Pressable>
			);
		},
			[buildBadgePresentation, getQuestionStatus]
	);

	const handleSelectOption = useCallback(
		(optionId: string) => {
			setQuestionStates((prev) =>
				prev.map((state, index) =>
					index === currentQuestionIndex
						? {
								...state,
								answerId: optionId,
							}
						: state
				)
			);
		},
		[currentQuestionIndex]
	);

	const handleToggleFlag = useCallback(() => {
		setQuestionStates((prev) =>
			prev.map((state, index) =>
				index === currentQuestionIndex
					? {
							...state,
							flagged: !state.flagged,
						}
					: state
			)
		);
	}, [currentQuestionIndex]);

	const handleNavigateToQuestion = useCallback(
		(index: number) => {
			setCurrentQuestionIndex(index);
			sheetRef.current?.collapse();
		},
		[]
	);

	const handleNext = useCallback(() => {
		setCurrentQuestionIndex((prev) => clamp(prev + 1, 0, totalQuestions - 1));
	}, [totalQuestions]);

	const handlePrevious = useCallback(() => {
		setCurrentQuestionIndex((prev) => clamp(prev - 1, 0, totalQuestions - 1));
	}, [totalQuestions]);

	const handleSubmitPress = useCallback(() => {
		setSubmitDialogVisible(true);
	}, []);

	const handleSubmitKeepWorking = useCallback(() => {
		setSubmitDialogVisible(false);
	}, []);

	const handleSubmitConfirm = useCallback(() => {
		markTryoutSubtestCompleted(tryoutId, subtestId);
		setSubmitDialogVisible(false);
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [
					{
						name: 'TryoutDetail',
						params: {
							tryoutId,
							title: tryoutTitle,
						},
					},
				],
			})
		);
	}, [navigation, tryoutId, subtestId, tryoutTitle]);

	const renderSheetBackground = useCallback(
		({ style }: BottomSheetBackgroundProps) => (
			<LinearGradient
				colors={['#1C637B', '#9EE0BF']}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={[style, styles.sheetBackground]}
			/>
		),
		[]
	);

	const isFirstQuestion = currentQuestionIndex === 0;
	const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

	return (
		<GestureHandlerRootView style={styles.gestureRoot}>
			<SafeAreaView style={styles.safeArea}>
				<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={[
						styles.scrollContent,
						{
							paddingBottom: Math.max(layout.sectionSpacing * 6, 260),
							alignItems: 'center',
						},
					]}
					showsVerticalScrollIndicator={false}
				>
					<View style={[styles.headerWrapper, { width: layout.contentWidth, marginBottom: sectionSpacing }]}>
						<AppHeader
							title="Tryout"
							contentHorizontalPadding={contentHorizontalPadding}
							onNotificationPress={handleNotificationPress}
							showBackButton={false}
						/>
					</View>

					<View
						style={[
							styles.contentWrapper,
							{
								width: layout.contentWidth,
								paddingHorizontal: contentHorizontalPadding,
								rowGap: sectionSpacing,
								gap: sectionSpacing,
							},
						]}
					>
						<View
							style={[
								styles.summaryCard,
								{
									paddingHorizontal: Math.max(summaryCardPadding, 20),
									paddingVertical: Math.max(summaryCardPadding * 0.72, 12),
									columnGap: summaryCardGap,
									gap: summaryCardGap,
								},
							]}
						>
							<View style={styles.summaryIconWrapper}>
								<Image source={examBadge} style={styles.summaryIcon} resizeMode="contain" />
							</View>
							<View style={styles.summaryCopy}>
								<Text style={styles.summaryLabel}>{currentQuestion.subject}</Text>
								<Text style={styles.summaryMeta}>{`${tryoutTitle} • ${totalQuestions} Soal`}</Text>
							</View>
							<View style={styles.timerBadge}>
								<Text style={styles.timerBadgeText}>{formattedTimer}</Text>
							</View>
						</View>

						<View style={styles.questionHeader}>
							<Text style={styles.questionTitle}>{`Soal No. ${currentQuestion.number}`}</Text>
							{currentState.flagged ? (
								<Text style={styles.flagIndicator}>Ditandai Ragu-Ragu</Text>
							) : null}
						</View>

						<View style={styles.questionContainer}>
							<Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>
							{currentQuestion.image ? (
								<Image
									source={currentQuestion.image}
									style={styles.questionImage}
									resizeMode="contain"
								/>
							) : null}
						</View>

						<View style={styles.optionsGrid}>
							{optionRows.map((rowOptions: TryoutQuestionOption[], rowIndex: number) => (
								<View
									key={`option-row-${rowIndex}`}
									style={[
										styles.optionRow,
										{
											marginBottom: rowIndex === optionRows.length - 1 ? 0 : optionGap,
										},
									]}
								>
									{rowOptions.map((option: TryoutQuestionOption, optionIndex: number) => {
										const isSelected = currentState.answerId === option.id;

										return (
											<Pressable
												key={option.id}
												onPress={() => handleSelectOption(option.id)}
												style={[
													styles.optionCard,
													{
														paddingVertical: optionPaddingVertical,
														paddingHorizontal: optionPaddingHorizontal,
														marginRight:
															optionIndex === 0 && rowOptions.length > 1 ? optionGap : 0,
													},
													isSelected && styles.optionCardSelected,
												]}
												accessibilityRole="button"
												accessibilityLabel={`Jawaban pilihan ${option.label}`}
											>
												<Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
													{option.label}
												</Text>
											</Pressable>
										);
									})}
									{rowOptions.length === 1 ? (
										<View style={styles.optionCardSpacer} pointerEvents="none" />
									) : null}
								</View>
							))}
						</View>

						<View
							style={[
								styles.controlsRow,
								{
									columnGap: controlsGap,
									gap: controlsGap,
								},
							]}
						>
							<Pressable
								onPress={handlePrevious}
								disabled={isFirstQuestion}
								accessibilityRole="button"
								accessibilityLabel="Soal sebelumnya"
								style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
							>
								<LeftPointerIcon width={66} height={44} />
							</Pressable>

							<Pressable
								onPress={handleToggleFlag}
								accessibilityRole="button"
								accessibilityLabel="Tandai ragu-ragu"
								style={[styles.flagButton, currentState.flagged && styles.flagButtonActive]}
							>
								<Text style={[styles.flagButtonText, currentState.flagged && styles.flagButtonTextActive]}>
									Ragu-Ragu
								</Text>
							</Pressable>

							<Pressable
								onPress={handleNext}
								disabled={isLastQuestion}
								accessibilityRole="button"
								accessibilityLabel="Soal berikutnya"
								style={[styles.navButton, isLastQuestion && styles.navButtonDisabled]}
							>
								<RightPointerIcon width={66} height={44} />
							</Pressable>
						</View>

						<View style={styles.poweredWrapper}>
							<Text style={styles.poweredLabel}>Powered by</Text>
							<Image source={poweredByLogo} style={styles.poweredLogo} resizeMode="contain" />
						</View>
					</View>
				</ScrollView>

				<BottomSheet
					ref={sheetRef}
					index={0}
					snapPoints={snapPoints}
					enablePanDownToClose={false}
					handleComponent={() => (
						<View style={styles.sheetHandleContainer}>
							<View style={styles.sheetHandleIndicator} />
						</View>
					)}
					backgroundComponent={renderSheetBackground}
				>
					<BottomSheetView
						style={[styles.sheetContentWrapper, { paddingHorizontal: sheetHorizontalPadding, rowGap: controlsGap, gap: controlsGap }]}
					>
						<BottomSheetScrollView
							contentContainerStyle={[
								styles.sheetGrid,
								{
									columnGap: controlsGap,
									rowGap: controlsGap,
									gap: controlsGap,
								},
							]}
							showsVerticalScrollIndicator={false}
						>
							<View style={[styles.sheetNumbersRow, { columnGap: controlsGap, rowGap: controlsGap, gap: controlsGap }]}>
								{questionNumbers.map((number, index) =>
									renderBadge(number, () => handleNavigateToQuestion(index))
								)}
							</View>
						</BottomSheetScrollView>

						<Pressable
							onPress={handleSubmitPress}
							style={styles.submitButton}
							accessibilityRole="button"
							accessibilityLabel="Kirim dan selesaikan tryout"
						>
							<Text style={styles.submitButtonText}>Kirim dan Selesaikan TO</Text>
						</Pressable>
					</BottomSheetView>
				</BottomSheet>

				<Modal
					visible={isSubmitDialogVisible}
					transparent
					animationType="fade"
					onRequestClose={handleSubmitKeepWorking}
				>
					<View style={styles.submitModalBackdrop}>
						<View style={styles.submitModalCard}>
							<Text style={styles.submitModalTitle}>Yakin mau selesai?</Text>
							<Text style={styles.submitModalMessage}>
								Masih ada waktu untuk memeriksa jawabanmu, lho. Klik selesai jika kamu sudah yakin dengan jawabanmu, ya.
							</Text>
							<View style={styles.submitModalActions}>
								<Pressable
									onPress={handleSubmitKeepWorking}
									style={[styles.submitModalButton, styles.submitModalSecondaryButton]}
									accessibilityRole="button"
									accessibilityLabel="Kembali ke soal"
								>
									<Text style={styles.submitModalSecondaryLabel}>Belum Selesai</Text>
								</Pressable>
								<Pressable
									onPress={handleSubmitConfirm}
									style={[styles.submitModalButton, styles.submitModalPrimaryButton]}
									accessibilityRole="button"
									accessibilityLabel="Selesaikan tryout"
								>
									<Text style={styles.submitModalPrimaryLabel}>Selesai</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		</GestureHandlerRootView>
	);
};

export default TryoutQuestionScreen;

const styles = StyleSheet.create({
	gestureRoot: {
		flex: 1,
		backgroundColor: colors.background,
	},
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
	summaryCard: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.primary,
		borderRadius: 20,
		minHeight: 61,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	summaryIconWrapper: {
		width: 43,
		height: 43,
		backgroundColor: colors.white,
		borderTopLeftRadius: 3,
		borderTopRightRadius: 10,
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryIcon: {
		width: 35,
		height: 35,
	},
	summaryCopy: {
		flex: 1,
		marginLeft: 16,
	},
	summaryLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.white,
	},
	summaryMeta: {
		marginTop: 2,
		fontFamily: fontFamilies.medium,
		fontSize: 11,
		color: 'rgba(255,255,255,0.8)',
	},
	timerBadge: {
		minWidth: 88,
		height: 22,
		paddingHorizontal: 12,
		borderRadius: 10,
		backgroundColor: colors.accent,
		alignItems: 'center',
		justifyContent: 'center',
	},
	timerBadgeText: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.white,
	},
	questionHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	questionTitle: {
		fontFamily: fontFamilies.bold,
		fontSize: 15,
		color: colors.sectionTitle,
	},
	flagIndicator: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 11,
		color: colors.accent,
	},
	questionContainer: {
		width: '100%',
		backgroundColor: '#B8E5DE',
		borderRadius: 20,
		paddingHorizontal: 20,
		paddingVertical: 18,
		gap: 12,
	},
	questionPrompt: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 13,
		color: colors.primaryDark,
		lineHeight: 20,
	},
	questionImage: {
		width: '100%',
		aspectRatio: 16 / 9,
	},
	optionsGrid: {
		width: '100%',
		flexDirection: 'column',
	},
	optionRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	optionCard: {
		flex: 1,
		borderRadius: 20,
		backgroundColor: colors.white,
		shadowColor: '#000000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 92,
	},
	optionCardSelected: {
		backgroundColor: colors.primary,
	},
	optionCardSpacer: {
		flex: 1,
		minHeight: 92,
	},
	optionLabel: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 24,
		color: colors.primary,
		textAlign: 'center',
	},
	optionLabelSelected: {
		color: colors.white,
	},
	controlsRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	navButton: {
		width: 66,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	navButtonDisabled: {
		opacity: 0.4,
	},
	flagButton: {
		backgroundColor: '#F18C1E',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 24,
		minWidth: 176,
		flexShrink: 0,
	},
	flagButtonActive: {
		backgroundColor: colors.primary,
	},
	flagButtonText: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 15,
		color: colors.white,
	},
	flagButtonTextActive: {
		color: colors.white,
	},
	poweredWrapper: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 6,
	},
	poweredLabel: {
		fontFamily: fontFamilies.semiBold,
		fontSize: 13,
		color: colors.sectionTitle,
	},
	poweredLogo: {
		width: 60,
		height: 16,
	},
	sheetHandleContainer: {
		paddingTop: 12,
		paddingBottom: 18,
		alignItems: 'center',
	},
	sheetHandleIndicator: {
		width: 48,
		height: 4,
		borderRadius: 2,
		backgroundColor: 'rgba(255,255,255,0.6)',
		marginBottom: 14,
	},
	sheetBackground: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	sheetContentWrapper: {
		flex: 1,
		paddingTop: 12,
		paddingBottom: 24,
	},
	sheetGrid: {
		paddingBottom: 24,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	sheetNumbersRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	submitButton: {
		marginTop: 8,
		backgroundColor: '#EF0F0F',
		borderRadius: 20,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	submitButtonText: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 15,
		color: colors.white,
	},
	submitModalBackdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
	},
	submitModalCard: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: colors.white,
		borderRadius: 24,
		paddingHorizontal: 28,
		paddingVertical: 26,
		alignItems: 'center',
		rowGap: 18,
		shadowColor: '#000000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 6,
	},
	submitModalTitle: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 18,
		color: colors.primaryDark,
		textAlign: 'center',
	},
	submitModalMessage: {
		fontFamily: fontFamilies.medium,
		fontSize: 13,
		color: colors.primaryDark,
		textAlign: 'center',
		lineHeight: 20,
	},
	submitModalActions: {
		width: '100%',
		flexDirection: 'row',
		columnGap: 14,
	},
	submitModalButton: {
		flex: 1,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
	},
	submitModalSecondaryButton: {
		backgroundColor: '#F18C1E',
	},
	submitModalPrimaryButton: {
		backgroundColor: colors.success,
	},
	submitModalSecondaryLabel: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 15,
		color: colors.white,
	},
	submitModalPrimaryLabel: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 15,
		color: colors.white,
	},
	questionBadgeBase: {
		borderWidth: 0,
		borderColor: 'transparent',
		borderRadius: 20,
	},
	questionBadgeLabel: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 24,
		color: colors.primaryDark,
	},
});
