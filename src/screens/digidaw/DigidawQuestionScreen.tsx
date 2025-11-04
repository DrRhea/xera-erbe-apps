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
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';
import type { RootStackParamList } from '../../../App';
import { getModuleQuestions, type DigidawQuestionOption } from './digidawData';

import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';
import HintIcon from '../../../assets/icons/hint.svg';

const moduleBadge = require('../../../assets/images/digidaw.png');
const poweredByLogo = require('../../../assets/images/logoutuhijo.png');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type DigidawQuestionRoute = RouteProp<RootStackParamList, 'DigidawQuestion'>;

type QuestionState = {
  selectedOptionId: string | null;
  isEvaluated: boolean;
};

type OptionVariant = 'default' | 'selected' | 'correct' | 'incorrect';

const DigidawQuestionScreen: FC = () => {
  const route = useRoute<DigidawQuestionRoute>();
  const { moduleId, moduleTitle, subjectTitle } = route.params;
  const layout = useResponsiveLayout();

  const questions = useMemo(() => getModuleQuestions(moduleId, moduleTitle), [moduleId, moduleTitle]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(() =>
    questions.map(() => ({ selectedOptionId: null, isEvaluated: false }))
  );
  const [isHintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setQuestionStates(questions.map(() => ({ selectedOptionId: null, isEvaluated: false })));
  }, [questions]);

  const currentQuestion = questions[currentIndex];
  const currentState = questionStates[currentIndex];
  const isEvaluated = currentState?.isEvaluated ?? false;

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

  const optionRows = useMemo(() => {
    const rows: DigidawQuestionOption[][] = [];
    if (!currentQuestion) {
      return rows;
    }
    for (let index = 0; index < currentQuestion.options.length; index += 2) {
      rows.push(currentQuestion.options.slice(index, index + 2));
    }
    return rows;
  }, [currentQuestion]);

  const updateQuestionState = useCallback(
    (updater: (state: QuestionState, index: number) => QuestionState) => {
      setQuestionStates((prev) => prev.map((state, index) => updater(state, index)));
    },
    []
  );

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isEvaluated) {
        return;
      }
      updateQuestionState((state, index) => {
        if (index !== currentIndex) {
          return state;
        }
        const isSameOption = state.selectedOptionId === optionId;
        return {
          selectedOptionId: isSameOption ? state.selectedOptionId : optionId,
          isEvaluated: false,
        };
      });
    },
    [currentIndex, isEvaluated, updateQuestionState]
  );

  const handleEvaluate = useCallback(() => {
    if (!currentState?.selectedOptionId) {
      return;
    }
    updateQuestionState((state, index) =>
      index === currentIndex
        ? {
            ...state,
            isEvaluated: true,
          }
        : state
    );
  }, [currentIndex, currentState?.selectedOptionId, updateQuestionState]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => clamp(prev - 1, 0, questions.length - 1));
  }, [questions.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => clamp(prev + 1, 0, questions.length - 1));
  }, [questions.length]);

  const toggleHint = useCallback(() => setHintVisible((prev) => !prev), []);

  const optionVariant = useCallback(
    (optionId: string): OptionVariant => {
      if (!currentQuestion || !currentState) {
        return 'default';
      }
      if (!currentState.isEvaluated) {
        return currentState.selectedOptionId === optionId ? 'selected' : 'default';
      }
      if (optionId === currentQuestion.correctOptionId) {
        return 'correct';
      }
      if (optionId === currentState.selectedOptionId) {
        return 'incorrect';
      }
      return 'default';
    },
    [currentQuestion, currentState]
  );

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasSelection = Boolean(currentState?.selectedOptionId);
  const showExplanation = Boolean(currentState?.isEvaluated);

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: clamp(layout.sectionSpacing * 4, 160, 220),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerWrapper, { width: layout.contentWidth }]}> 
          <AppHeader title="DIGIDAW" contentHorizontalPadding={contentHorizontalPadding} />
        </View>

        <View
          style={[
            styles.contentWrapper,
            {
              width: layout.contentWidth,
              paddingHorizontal: contentHorizontalPadding,
              marginTop: sectionSpacing,
              rowGap: sectionSpacing,
              gap: sectionSpacing,
            },
          ]}
        >
          <View
            style={[
              styles.summaryCard,
              {
                paddingHorizontal: summaryPadding,
                paddingVertical: clamp(summaryPadding * 0.7, 14, 22),
                columnGap: summaryPadding * 0.4,
                gap: summaryPadding * 0.4,
              },
            ]}
          >
            <View style={styles.summaryIconWrapper}>
              <Image source={moduleBadge} style={styles.summaryIcon} resizeMode="contain" />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryLabel}>{subjectTitle}</Text>
              <Text style={styles.summaryTitle}>{moduleTitle}</Text>
            </View>
            <View style={styles.questionIndicator}>
              <Text style={styles.questionIndicatorText}>{`Soal ${currentQuestion.number}/${questions.length}`}</Text>
            </View>
          </View>

          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{`Soal No. ${currentQuestion.number}`}</Text>
          </View>

          <View style={styles.questionBody}>
            <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>
          </View>

          <View style={styles.optionsGrid}>
            {optionRows.map((rowOptions, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={[
                  styles.optionRow,
                  {
                    marginBottom: rowIndex === optionRows.length - 1 ? 0 : optionGap,
                  },
                ]}
              >
                {rowOptions.map((option, optionIndex) => {
                  const variant = optionVariant(option.id);
                  const isLastInRow = optionIndex === rowOptions.length - 1;
                  return (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.optionCard,
                        {
                          paddingVertical: optionPaddingVertical,
                          paddingHorizontal: optionPaddingHorizontal,
                          marginRight: isLastInRow ? 0 : optionGap,
                        },
                        variant === 'selected' && styles.optionCardSelected,
                        variant === 'correct' && styles.optionCardCorrect,
                        variant === 'incorrect' && styles.optionCardIncorrect,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Jawaban pilihan ${option.label}`}
                      onPress={() => handleSelectOption(option.id)}
                      disabled={isEvaluated}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          variant === 'selected' && styles.optionLabelSelected,
                          variant === 'correct' && styles.optionLabelSelected,
                          variant === 'incorrect' && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
                {rowOptions.length === 1 ? <View style={styles.optionSpacer} /> : null}
              </View>
            ))}
          </View>

          {showExplanation ? (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Pembahasan</Text>
              <View
                style={[
                  styles.explanationBody,
                  {
                    paddingHorizontal: explanationPadding,
                    paddingVertical: clamp(explanationPadding * 0.8, 14, 22),
                  },
                ]}
              >
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              </View>
            </View>
          ) : null}

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
              onPress={toggleHint}
              accessibilityRole="button"
              accessibilityLabel="Lihat hint DIGIDAW"
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

          <Pressable
            onPress={handleEvaluate}
            disabled={!hasSelection || isEvaluated}
            accessibilityRole="button"
            accessibilityLabel="Periksa jawaban"
            style={[
              styles.submitButton,
              (!hasSelection || isEvaluated) && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>Periksa Jawaban</Text>
          </Pressable>

          <View style={styles.poweredWrapper}>
            <Text style={styles.poweredLabel}>Powered by</Text>
            <Image source={poweredByLogo} style={styles.poweredLogo} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>

      <Modal visible={isHintVisible} transparent animationType="fade" onRequestClose={toggleHint}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>DIGIDAW HINT</Text>
            <View style={styles.modalBody}>
              <Text style={styles.modalHintText}>{currentQuestion.hint}</Text>
            </View>
            <Pressable
              onPress={toggleHint}
              accessibilityRole="button"
              accessibilityLabel="Tutup hint"
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

export default DigidawQuestionScreen;

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
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 36,
    height: 36,
  },
  summaryCopy: {
    flex: 1,
    marginLeft: 16,
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
    backgroundColor: colors.accent,
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
    backgroundColor: '#B8E5DE',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
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
  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  optionCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  optionCardSelected: {
    backgroundColor: colors.primary,
  },
  optionCardCorrect: {
    backgroundColor: colors.greenLight,
  },
  optionCardIncorrect: {
    backgroundColor: '#EF0F0F',
  },
  optionLabel: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 24,
    color: colors.primary,
  },
  optionLabelSelected: {
    color: colors.white,
  },
  optionSpacer: {
    flex: 1,
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
    backgroundColor: '#B8E5DE',
    borderRadius: 20,
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
    backgroundColor: '#318DB6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  submitButton: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 15,
    color: colors.white,
  },
  poweredWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});
