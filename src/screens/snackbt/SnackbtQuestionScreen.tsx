import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';
import type { RootStackParamList } from '../../../App';
import { snackbtService } from '../../services/snackbtService';
import { API_URL } from '../../services/api';

import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';
import HintIcon from '../../../assets/icons/hint.svg';

const poweredByLogo = require('../../../assets/images/logoutuhijo.png');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type SnackbtQuestionRoute = RouteProp<RootStackParamList, 'SnackbtQuestion'>;

type QuestionState = {
  selectedOptionId: string | null;
  isEvaluated: boolean;
};

type OptionVariant = 'default' | 'selected' | 'correct' | 'incorrect';

const defaultPalette = {
  summaryBackground: colors.primary,
  questionIndicatorBackground: colors.accent,
  questionBodyBackground: '#B8E5DE',
  explanationBackground: '#B8E5DE',
  optionSelectedBackground: colors.primary,
  optionCorrectBackground: colors.greenLight,
  optionIncorrectBackground: '#EF0F0F',
  optionLabelDefault: colors.primary,
  optionLabelOnEmphasis: colors.white,
  hintButtonBackground: '#318DB6',
};

const SnackbtQuestionScreen: FC = () => {
  const route = useRoute<SnackbtQuestionRoute>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { moduleId, moduleTitle, session } = route.params;
  const layout = useResponsiveLayout();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isHintVisible, setHintVisible] = useState(false);

  // SnackBT specific palette
  const palette = {
    ...defaultPalette,
    summaryBackground: '#015876', // SnackBT Primary
    questionBodyBackground: '#E0F7FA', // Light Cyan
    explanationBackground: '#E0F7FA',
    hintButtonBackground: '#E0F7FA',
  };

  useEffect(() => {
    if (session) {
      setAttemptId(session.attemptId);
      setQuestions(session.questions);
      
      const initialStates = session.questions.map((q: any) => {
        const answer = session.answers?.find((a: any) => a.questionId === q.id);
        return {
            selectedOptionId: answer ? answer.optionId : null,
            isEvaluated: !!answer
        };
      });
      setQuestionStates(initialStates);

      const firstUnansweredIndex = initialStates.findIndex((s: any) => !s.isEvaluated);
      setCurrentIndex(firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0);
    }
  }, [session]);

  const currentQuestion = questions[currentIndex];
  const currentState = questionStates[currentIndex];

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const updateQuestionState = useCallback(
    (updater: (state: QuestionState, index: number) => QuestionState) => {
      setQuestionStates((prev) => prev.map((state, index) => updater(state, index)));
    },
    []
  );

  const handleOptionSelect = useCallback(async (optionId: string) => {
    if (!attemptId) return;
    
    if (!currentQuestion || !currentState) return;

    if (currentState.isEvaluated) return;

    updateQuestionState((state, index) => {
        if (index !== currentIndex) {
          return state;
        }
        return {
          selectedOptionId: optionId,
          isEvaluated: true,
        };
    });

    try {
      await snackbtService.recordAnswer(attemptId, currentQuestion.id, optionId);
    } catch (e) {
      console.error('Failed to record answer', e);
    }
  }, [attemptId, currentQuestion, currentState, currentIndex, updateQuestionState]);

  const handleNext = useCallback(() => {
    if (!currentState?.isEvaluated) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.goBack(); // Or navigate to a result screen
    }
  }, [currentIndex, questions.length, navigation, currentState]);

  const toggleHint = useCallback(() => setHintVisible((prev) => !prev), []);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const optionVariant = useCallback(
    (optionId: string): OptionVariant => {
      if (!currentQuestion || !currentState) {
        return 'default';
      }
      if (!currentState.isEvaluated) {
        return currentState.selectedOptionId === optionId ? 'selected' : 'default';
      }
      const option = currentQuestion.options.find((o: any) => o.id === optionId);
      if (option?.isCorrect) {
        return 'correct';
      }
      if (optionId === currentState.selectedOptionId) {
        return 'incorrect';
      }
      return 'default';
    },
    [currentQuestion, currentState]
  );

  if (!questions.length) {
    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );
  const sectionSpacing = useMemo(
    () => clamp(layout.sectionSpacing * 0.65, 18, 28),
    [layout.sectionSpacing]
  );
  const summaryPadding = useMemo(
    () => clamp(layout.horizontalPadding * 0.9, 18, 26),
    [layout.horizontalPadding]
  );
  const optionGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.55, 12, 18),
    [layout.horizontalPadding]
  );
  const optionPaddingVertical = useMemo(
    () => clamp(layout.horizontalPadding * 0.85, 16, 24),
    [layout.horizontalPadding]
  );
  const optionPaddingHorizontal = useMemo(
    () => clamp(layout.horizontalPadding * 0.8, 16, 24),
    [layout.horizontalPadding]
  );
  const controlsGap = useMemo(
    () => clamp(layout.horizontalPadding * 0.45, 12, 18),
    [layout.horizontalPadding]
  );
  const explanationPadding = useMemo(
    () => clamp(layout.horizontalPadding * 0.7, 16, 24),
    [layout.horizontalPadding]
  );

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const showExplanation = Boolean(currentState?.isEvaluated);

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={[
          sharedStyles.scrollContent,
          {
            paddingBottom: clamp(layout.sectionSpacing * 4, 160, 220),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
          <AppHeader
            title={moduleTitle}
            showBackButton
            onBackPress={() => navigation.goBack()}
            onNotificationPress={handleNotificationPress}
            contentHorizontalPadding={contentHorizontalPadding}
          />
        </View>

        <View
          style={[
            sharedStyles.contentWrapper,
            {
              width: layout.contentWidth,
              paddingHorizontal: contentHorizontalPadding,
              marginTop: sectionSpacing,
              rowGap: sectionSpacing,
              gap: sectionSpacing,
            },
          ]}
        >
          {/* Summary Card */}
          <View
            style={[
              styles.summaryCard,
              {
                paddingHorizontal: summaryPadding,
                paddingVertical: clamp(summaryPadding * 0.7, 14, 22),
                columnGap: summaryPadding * 0.4,
                gap: summaryPadding * 0.4,
                backgroundColor: palette.summaryBackground,
              },
            ]}
          >
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryLabel}>SnackBT</Text>
              <Text style={styles.summaryTitle}>{moduleTitle}</Text>
            </View>
            <View style={[styles.questionIndicator, { backgroundColor: palette.questionIndicatorBackground }]}>
              <Text style={styles.questionIndicatorText}>{`Soal ${currentIndex + 1}/${questions.length}`}</Text>
            </View>
          </View>

          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{`Soal No. ${currentIndex + 1}`}</Text>
          </View>

          {/* Question Body */}
          <View
            style={[
              styles.questionBody,
              {
                backgroundColor: palette.questionBodyBackground,
              },
            ]}
          >
            {currentQuestion.promptImagePath && (
              <Image
                source={{ uri: `${API_URL}/${currentQuestion.promptImagePath}` }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>
          </View>

          {/* Options */}
          <View style={styles.optionsGrid}>
            {currentQuestion.options.map((option: any, index: number) => {
              const variant = optionVariant(option.id);
              const backgroundColor =
                variant === 'selected'
                  ? palette.optionSelectedBackground
                  : variant === 'correct'
                  ? palette.optionCorrectBackground
                  : variant === 'incorrect'
                  ? palette.optionIncorrectBackground
                  : colors.white;
              
              const labelColor =
                variant === 'default'
                  ? palette.optionLabelDefault
                  : palette.optionLabelOnEmphasis;
              
              const textColor = 
                variant === 'default'
                  ? colors.textPrimary
                  : colors.white;

              // Generate A, B, C, D labels
              const optionLabel = String.fromCharCode(65 + index);

              return (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    {
                      paddingVertical: optionPaddingVertical,
                      paddingHorizontal: optionPaddingHorizontal,
                      marginBottom: index === currentQuestion.options.length - 1 ? 0 : optionGap,
                      backgroundColor,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      gap: 12,
                    },
                  ]}
                  onPress={() => handleOptionSelect(option.id)}
                  disabled={currentState.isEvaluated}
                >
                  <View style={[
                    styles.optionLabelContainer,
                    { backgroundColor: variant === 'default' ? colors.background : 'rgba(255,255,255,0.2)' }
                  ]}>
                    <Text style={[styles.optionLabelText, { color: labelColor }]}>{optionLabel}</Text>
                  </View>
                  <Text style={[styles.optionText, { color: textColor }]}>{option.body}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Pembahasan</Text>
              <View
                style={[
                  styles.explanationBody,
                  {
                    paddingHorizontal: explanationPadding,
                    paddingVertical: clamp(explanationPadding * 0.8, 14, 22),
                    backgroundColor: palette.explanationBackground,
                  },
                ]}
              >
                {currentQuestion.explanationImagePath && (
                  <Image
                    source={{ uri: `${API_URL}/${currentQuestion.explanationImagePath}` }}
                    style={styles.explanationImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              </View>
            </View>
          )}

          {/* Navigation Controls */}
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
              onPress={handlePrev}
              disabled={isFirstQuestion}
              style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
            >
              <LeftPointerIcon width={66} height={44} />
            </Pressable>

            <Pressable
              onPress={toggleHint}
              style={[styles.hintButton, { backgroundColor: palette.hintButtonBackground }]}
            >
              <HintIcon width={30} height={30} />
            </Pressable>

            <Pressable
              onPress={handleNext}
              disabled={!currentState.isEvaluated}
              style={[styles.navButton, !currentState.isEvaluated && styles.navButtonDisabled]}
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

      <Modal visible={isHintVisible} transparent animationType="fade" onRequestClose={toggleHint}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>HINT</Text>
            <View style={styles.modalBody}>
              {currentQuestion.hintImagePath && (
                <Image
                  source={{ uri: `${API_URL}/${currentQuestion.hintImagePath}` }}
                  style={styles.hintImage}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.modalHintText}>{currentQuestion.hint}</Text>
            </View>
            <Pressable
              onPress={toggleHint}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonLabel}>Mengerti</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const sharedStyles = StyleSheet.create({
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
});

const styles = StyleSheet.create({
  summaryCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  summaryCopy: {
    flex: 1,
    rowGap: 4,
  },
  summaryLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.white,
  },
  summaryTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.white,
  },
  questionIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  questionIndicatorText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.white,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
  },
  questionBody: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  questionPrompt: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'column',
  },
  optionCard: {
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  explanationSection: {
    width: '100%',
    rowGap: 10,
  },
  explanationTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.sectionTitle,
  },
  explanationBody: {
    borderRadius: 20,
  },
  explanationImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  explanationText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  hintButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  poweredWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 18,
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.primaryDark,
  },
  modalBody: {
    width: '100%',
  },
  modalHintText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  modalButtonLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.white,
  },
  hintImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
});

export default SnackbtQuestionScreen;
