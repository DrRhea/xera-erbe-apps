import React, { useMemo } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { colors, fontFamilies } from '../constants/theme';
import { API_URL } from '../services/api';
import LeftPointerIcon from '../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../assets/icons/rightpointer.svg';
import HintIcon from '../../assets/icons/hint.svg';

const poweredByLogo = require('../../assets/images/logoutuhijo.png');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export interface QuestionPalette {
  summaryBackground: string;
  summaryText: string;
  questionIndicatorBackground: string;
  questionIndicatorText: string;
  questionBodyBackground: string;
  questionText: string;
  optionCardBackground: string;
  optionCardSelected: string;
  optionCardCorrect: string;
  optionCardIncorrect: string;
  optionLabel: string;
  optionLabelSelected: string;
  hintButtonBackground: string;
  explanationBackground: string;
  explanationText: string;
}

export const defaultPalette: QuestionPalette = {
  summaryBackground: colors.primary,
  summaryText: colors.white,
  questionIndicatorBackground: colors.accent,
  questionIndicatorText: colors.white,
  questionBodyBackground: '#B8E5DE',
  questionText: colors.primaryDark,
  optionCardBackground: colors.white,
  optionCardSelected: colors.primary,
  optionCardCorrect: colors.greenLight,
  optionCardIncorrect: '#EF0F0F',
  optionLabel: colors.primary,
  optionLabelSelected: colors.white,
  hintButtonBackground: '#318DB6',
  explanationBackground: '#B8E5DE',
  explanationText: colors.primaryDark,
};

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface QuestionData {
  id: string;
  number: number;
  prompt: string;
  options: QuestionOption[];
  correctOptionId?: string;
  hint?: string;
  explanation?: string;
  promptImagePath?: string;
  hintImagePath?: string;
  explanationImagePath?: string;
}

export type OptionVariant = 'default' | 'selected' | 'correct' | 'incorrect';

interface QuestionViewerProps {
  question: QuestionData;
  totalQuestions: number;
  currentIndex: number;
  subjectTitle: string;
  moduleTitle: string;
  moduleIcon: ImageSourcePropType;
  selectedOptionId: string | null;
  isEvaluated: boolean;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleHint: () => void;
  isHintVisible: boolean;
  palette?: Partial<QuestionPalette>;
  layout: {
    contentWidth: number;
    horizontalPadding: number;
    sectionSpacing: number;
  };
  optionVariant: (optionId: string) => OptionVariant;
}

export const QuestionViewer: React.FC<QuestionViewerProps> = ({
  question,
  totalQuestions,
  currentIndex,
  subjectTitle,
  moduleTitle,
  moduleIcon,
  isEvaluated,
  onSelectOption,
  onNext,
  onPrevious,
  onToggleHint,
  isHintVisible,
  palette: customPalette,
  layout,
  optionVariant,
}) => {
  const palette = { ...defaultPalette, ...customPalette };

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
    const rows: QuestionOption[][] = [];
    if (!question) {
      return rows;
    }
    for (let index = 0; index < question.options.length; index += 2) {
      rows.push(question.options.slice(index, index + 2));
    }
    return rows;
  }, [question]);

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const showExplanation = isEvaluated && question.explanation;

  return (
    <>
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
          {/* Summary Card */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: palette.summaryBackground,
                paddingHorizontal: summaryPadding,
                paddingVertical: clamp(summaryPadding * 0.7, 14, 22),
                columnGap: summaryPadding * 0.4,
                gap: summaryPadding * 0.4,
              },
            ]}
          >
            <View style={styles.summaryIconWrapper}>
              <Image source={moduleIcon} style={styles.summaryIcon} resizeMode="contain" />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={[styles.summaryLabel, { color: palette.summaryText }]}>{subjectTitle}</Text>
              <Text style={[styles.summaryTitle, { color: palette.summaryText }]}>{moduleTitle}</Text>
            </View>
            <View style={[styles.questionIndicator, { backgroundColor: palette.questionIndicatorBackground }]}>
              <Text style={[styles.questionIndicatorText, { color: palette.questionIndicatorText }]}>
                {`Soal ${question.number}/${totalQuestions}`}
              </Text>
            </View>
          </View>

          {/* Question Header */}
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{`Soal No. ${question.number}`}</Text>
          </View>

          {/* Question Body */}
          <View style={[styles.questionBody, { backgroundColor: palette.questionBodyBackground }]}>
            {question.promptImagePath && (
              <Image
                source={{ uri: `${API_URL}/${question.promptImagePath}` }}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.questionPrompt, { color: palette.questionText }]}>{question.prompt}</Text>
            
            {/* Render Option Texts inside Question Body */}
            <View style={styles.optionTextContainer}>
              {question.options.map((option) => (
                <View key={option.id} style={styles.optionTextRow}>
                  <Text style={[styles.optionTextLabel, { color: palette.questionText }]}>{option.label}.</Text>
                  <Text style={[styles.optionTextBody, { color: palette.questionText }]}>{option.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Options Grid (Buttons Only) */}
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
                          backgroundColor: palette.optionCardBackground,
                          paddingVertical: optionPaddingVertical,
                          paddingHorizontal: optionPaddingHorizontal,
                          marginRight: isLastInRow ? 0 : optionGap,
                        },
                        variant === 'selected' && { backgroundColor: palette.optionCardSelected },
                        variant === 'correct' && { backgroundColor: palette.optionCardCorrect },
                        variant === 'incorrect' && { backgroundColor: palette.optionCardIncorrect },
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Jawaban pilihan ${option.label}`}
                      onPress={() => onSelectOption(option.id)}
                      disabled={isEvaluated}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          { color: palette.optionLabel },
                          variant === 'selected' && { color: palette.optionLabelSelected },
                          variant === 'correct' && { color: palette.optionLabelSelected },
                          variant === 'incorrect' && { color: palette.optionLabelSelected },
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

          {/* Explanation */}
          {showExplanation ? (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Pembahasan</Text>
              <View
                style={[
                  styles.explanationBody,
                  {
                    backgroundColor: palette.explanationBackground,
                    paddingHorizontal: explanationPadding,
                    paddingVertical: clamp(explanationPadding * 0.8, 14, 22),
                  },
                ]}
              >
                {question.explanationImagePath && (
                  <Image
                    source={{ uri: `${API_URL}/${question.explanationImagePath}` }}
                    style={styles.explanationImage}
                    resizeMode="contain"
                  />
                )}
                <Text style={[styles.explanationText, { color: palette.explanationText }]}>{question.explanation}</Text>
              </View>
            </View>
          ) : null}

          {/* Controls */}
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
              onPress={onPrevious}
              disabled={isFirstQuestion}
              accessibilityRole="button"
              accessibilityLabel="Soal sebelumnya"
              style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
            >
              <LeftPointerIcon width={66} height={44} />
            </Pressable>

            <Pressable
              onPress={onToggleHint}
              accessibilityRole="button"
              accessibilityLabel="Lihat hint"
              style={[styles.hintButton, { backgroundColor: palette.hintButtonBackground }]}
            >
              <HintIcon width={30} height={30} />
            </Pressable>

            <Pressable
              onPress={onNext}
              disabled={isLastQuestion || !isEvaluated}
              accessibilityRole="button"
              accessibilityLabel="Soal berikutnya"
              style={[styles.navButton, (isLastQuestion || !isEvaluated) && styles.navButtonDisabled]}
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

      {/* Hint Modal */}
      <Modal visible={isHintVisible} transparent animationType="fade" onRequestClose={onToggleHint}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>HINT</Text>
            <View style={styles.modalBody}>
              {question.hintImagePath && (
                <Image
                  source={{ uri: `${API_URL}/${question.hintImagePath}` }}
                  style={styles.hintImage}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.modalHintText}>{question.hint}</Text>
            </View>
            <Pressable
              onPress={onToggleHint}
              accessibilityRole="button"
              accessibilityLabel="Tutup hint"
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonLabel}>Mengerti</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
  },
  contentWrapper: {
    alignSelf: 'center',
  },
  summaryCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  summaryTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  questionIndicator: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  questionIndicatorText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
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
  questionPrompt: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  optionTextContainer: {
    marginTop: 8,
    gap: 8,
  },
  optionTextRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionTextLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
  },
  optionTextBody: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  optionLabel: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 24,
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
    borderRadius: 20,
  },
  explanationText: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  explanationImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
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
  hintImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
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
