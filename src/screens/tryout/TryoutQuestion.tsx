import React, {
	FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	Image,
	ImageSourcePropType,
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

import HintIcon from '../../../assets/icons/hint.svg';
import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';

const examBadge = require('../../../assets/images/tryoutimage.png');
const poweredByLogo = require('../../../assets/images/logoutuhijo.png');

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

type QuestionOption = {
	id: string;
	label: string;
	text: string;
};

type Question = {
	id: string;
	number: number;
	subject: string;
	prompt: string;
	options: QuestionOption[];
	image?: ImageSourcePropType;
};

type QuestionState = {
	answerId: string | null;
	flagged: boolean;
};

type QuestionStatus = 'current' | 'answered' | 'flagged' | 'unanswered';

const baseOptions: QuestionOption[] = [
	{ id: 'opt-a', label: 'A', text: '8√2 cm' },
	{ id: 'opt-b', label: 'B', text: '12 cm' },
	{ id: 'opt-c', label: 'C', text: '16√2 cm' },
	{ id: 'opt-d', label: 'D', text: '24 cm' },
	{ id: 'opt-e', label: 'E', text: '32 cm' },
];

const questionSeeds: Record<
	string,
	{
		prompt: string;
		options?: QuestionOption[];
		count?: number;
	}
> = {
	math: {
		prompt:
			'Diketahui sebuah persegi memiliki luas 256 cm². Tentukan keliling persegi tersebut.',
	},
	literasi: {
		prompt:
			'Bacalah paragraf singkat tentang perubahan iklim berikut lalu tentukan ide pokok paragraf tersebut.',
		options: [
			{ id: 'opt-a', label: 'A', text: 'Dampak perubahan iklim terhadap cuaca ekstrem.' },
			{ id: 'opt-b', label: 'B', text: 'Peran manusia dalam mitigasi perubahan iklim.' },
			{ id: 'opt-c', label: 'C', text: 'Pengaruh perubahan iklim terhadap kesehatan.' },
			{ id: 'opt-d', label: 'D', text: 'Perubahan iklim dan transportasi publik.' },
			{ id: 'opt-e', label: 'E', text: 'Kemajuan teknologi energi terbarukan.' },
		],
	},
	science: {
		prompt:
			'Sebuah benda bermassa 2 kg ditarik dengan gaya konstan 10 N. Tentukan percepatan benda tersebut.',
	},
	penalaran: {
		prompt:
			'Jika pola bilangan 2, 6, 12, 20, ... berlanjut, berapakah suku ke-6 dari pola tersebut?',
	},
	kognitif: {
		prompt:
			'Seseorang membeli barang seharga Rp150.000 dengan diskon 20%. Berapa harga yang harus dibayar?',
	},
	numerasi: {
		prompt:
			'Dalam sebuah kelas terdapat 28 siswa. Jika 3/4 dari siswa menyukai matematika, berapa banyak siswa yang menyukainya?',
		options: [
			{ id: 'opt-a', label: 'A', text: '18 siswa' },
			{ id: 'opt-b', label: 'B', text: '20 siswa' },
			{ id: 'opt-c', label: 'C', text: '21 siswa' },
			{ id: 'opt-d', label: 'D', text: '24 siswa' },
			{ id: 'opt-e', label: 'E', text: '26 siswa' },
		],
	},
};

const buildQuestions = (subtestId: string, subject: string): Question[] => {
	const seed = questionSeeds[subtestId] ?? {
		prompt:
			'Pilih jawaban terbaik berdasarkan informasi yang diberikan pada soal berikut.',
	};
	const optionsSource = seed.options ?? baseOptions;
	const total = seed.count ?? 20;

		return Array.from({ length: total }).map((_, index) => ({
		id: `${subtestId || 'question'}-${index + 1}`,
		number: index + 1,
		subject,
				prompt:
					index === 0 ? seed.prompt : `${seed.prompt} - variasi ${index + 1}`,
		options: optionsSource.map((option) => ({
			...option,
			id: `${option.id}-${subtestId || 'default'}-${index + 1}`,
		})),
	}));
};

type TryoutQuestionRoute = RouteProp<RootStackParamList, 'TryoutQuestion'>;

const TryoutQuestionScreen: FC = () => {
	const route = useRoute<TryoutQuestionRoute>();
	const { subtestId, subtestTitle, tryoutTitle } = route.params;
	const layout = useResponsiveLayout();
	const sheetRef = useRef<BottomSheet>(null);

	const questions = useMemo(() => buildQuestions(subtestId, subtestTitle), [subtestId, subtestTitle]);
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

		const snapPoints = useMemo<(string | number)[]>(() => ['20%', '80%'], []);
	const handleNumbers = useMemo(
		() => questionNumbers.slice(0, Math.min(5, questionNumbers.length)),
		[questionNumbers]
	);

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
	const optionWidth = useMemo(
		() => (layout.innerContentWidth - optionGap) / 2,
		[layout.innerContentWidth, optionGap]
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
	const handleBadgeSize = useMemo(
		() => clamp(layout.horizontalPadding * 3, 56, 72),
		[layout.horizontalPadding]
	);
	const gridBadgeSize = useMemo(
		() => clamp(layout.horizontalPadding * 2.4, 50, 64),
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
			(status: QuestionStatus, variant: 'handle' | 'grid') => {
				const size = variant === 'handle' ? handleBadgeSize : gridBadgeSize;
				const baseStyle: ViewStyle = {
					width: size,
					height: size,
					borderRadius: size / 2,
					alignItems: 'center',
					justifyContent: 'center',
					borderWidth: 0,
				};

				let backgroundColor: string = colors.white;
				let borderColor: string = 'transparent';
				let textColor: string = colors.primaryDark;

				if (status === 'current') {
					backgroundColor = colors.primary;
					borderColor = colors.white;
					textColor = colors.white;
				} else if (status === 'answered') {
					backgroundColor = colors.primaryDark;
					borderColor = colors.white;
					textColor = colors.white;
				} else if (status === 'flagged') {
					backgroundColor = colors.accent;
					borderColor = colors.white;
					textColor = colors.white;
				} else {
					borderColor = 'rgba(1, 88, 118, 0.3)';
					textColor = colors.primaryDark;
					baseStyle.borderWidth = 2;
				}

				const containerStyle: ViewStyle = {
					...baseStyle,
					backgroundColor,
					borderColor,
				};

				const labelStyle: TextStyle = {
					color: textColor,
					fontSize: clamp(size * 0.33, 14, 20),
				};

				return {
					containerStyle,
					labelStyle,
				};
			},
			[gridBadgeSize, handleBadgeSize]
		);

	const renderBadge = useCallback(
		(number: number, variant: 'handle' | 'grid', onPress?: () => void) => {
			const status = getQuestionStatus(number - 1);
					const presentation = buildBadgePresentation(status, variant);

			return (
				<Pressable
					key={`${variant}-${number}`}
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
					<View style={[styles.headerWrapper, { width: layout.contentWidth }]}> 
						<AppHeader title="Tryout" contentHorizontalPadding={contentHorizontalPadding} />
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
									paddingHorizontal: summaryCardPadding,
									paddingVertical: summaryCardPadding * 0.85,
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
								<Text style={styles.timerBadgeText}>00:25:41</Text>
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

						<View
							style={[
								styles.optionsGrid,
								{
									rowGap: optionGap,
									columnGap: optionGap,
									gap: optionGap,
								},
							]}
						>
							{currentQuestion.options.map((option) => {
								const isSelected = currentState.answerId === option.id;

								return (
									<Pressable
										key={option.id}
										onPress={() => handleSelectOption(option.id)}
										style={[
											styles.optionCard,
											{
												width: optionWidth,
												paddingVertical: optionPaddingVertical,
												paddingHorizontal: optionPaddingHorizontal,
											},
											isSelected && styles.optionCardSelected,
										]}
										accessibilityRole="button"
										accessibilityLabel={`Jawaban pilihan ${option.label}`}
									>
										<Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
											{option.label}
										</Text>
										<Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option.text}</Text>
									</Pressable>
								);
							})}
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
								onPress={() => {}}
								accessibilityRole="button"
								accessibilityLabel="Buka hint"
								style={styles.hintButton}
							>
								<HintIcon width={30} height={30} />
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
							<View style={[styles.sheetHandleList, { columnGap: controlsGap, gap: controlsGap }]}>
								{handleNumbers.map((number) =>
									renderBadge(number, 'handle', () => handleNavigateToQuestion(number - 1))
								)}
							</View>
						</View>
					)}
					backgroundComponent={renderSheetBackground}
				>
					<BottomSheetView
						style={[styles.sheetContentWrapper, { paddingHorizontal: sheetHorizontalPadding }]}
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
							{questionNumbers.map((number, index) =>
								renderBadge(number, 'grid', () => handleNavigateToQuestion(index))
							)}
						</BottomSheetScrollView>

						<Pressable
							style={styles.submitButton}
							accessibilityRole="button"
							accessibilityLabel="Kirim dan selesaikan tryout"
						>
							<Text style={styles.submitButtonText}>Kirim dan Selesaikan TO</Text>
						</Pressable>
					</BottomSheetView>
				</BottomSheet>
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
	},
	summaryIconWrapper: {
		width: 48,
		height: 48,
		backgroundColor: colors.white,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	summaryIcon: {
		width: 36,
		height: 36,
	},
	summaryCopy: {
		flex: 1,
	},
	summaryLabel: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.white,
	},
	summaryMeta: {
		marginTop: 4,
		fontFamily: fontFamilies.medium,
		fontSize: 11,
		color: 'rgba(255,255,255,0.8)',
	},
	timerBadge: {
		backgroundColor: colors.accent,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 6,
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
		padding: 20,
		gap: 16,
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
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	optionCard: {
		borderRadius: 20,
		backgroundColor: colors.white,
		shadowColor: '#000000',
		shadowOpacity: 0.05,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
	},
	optionCardSelected: {
		backgroundColor: colors.primary,
	},
	optionLabel: {
		fontFamily: fontFamilies.extraBold,
		fontSize: 24,
		color: colors.primary,
		marginBottom: 6,
		textAlign: 'center',
	},
	optionLabelSelected: {
		color: colors.white,
	},
	optionText: {
		fontFamily: fontFamilies.bold,
		fontSize: 13,
		color: colors.primaryDark,
		textAlign: 'center',
	},
	optionTextSelected: {
		color: colors.white,
	},
	controlsRow: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	navButton: {
		borderRadius: 22,
		overflow: 'hidden',
	},
	navButtonDisabled: {
		opacity: 0.4,
	},
	flagButton: {
		flex: 1,
		backgroundColor: '#F18C1E',
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
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
	hintButton: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOpacity: 0.05,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
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
	sheetHandleList: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sheetBackground: {
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	sheetContentWrapper: {
		flex: 1,
		paddingBottom: 24,
	},
	sheetGrid: {
		paddingBottom: 24,
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
	questionBadgeBase: {
		borderWidth: 2,
		borderColor: 'transparent',
	},
	questionBadgeLabel: {
		fontFamily: fontFamilies.extraBold,
		color: colors.primaryDark,
	},
});
