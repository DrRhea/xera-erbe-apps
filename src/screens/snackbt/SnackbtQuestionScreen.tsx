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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type SnackbtQuestionRoute = RouteProp<RootStackParamList, 'SnackbtQuestion'>;

type QuestionState = {
  selectedOptionId: string | null;
  isEvaluated: boolean;
};

type OptionVariant = 'default' | 'selected' | 'correct' | 'incorrect';

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

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader
          title={moduleTitle}
          showBackButton
          onBackPress={() => navigation.goBack()}
          onNotificationPress={handleNotificationPress}
        />
      </View>

      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={[sharedStyles.scrollContent, { paddingHorizontal: contentHorizontalPadding }]}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Soal {currentIndex + 1} dari {questions.length}
          </Text>
        </View>

        <View style={styles.questionContainer}>
          {currentQuestion.promptImagePath && (
            <Image
              source={{ uri: `${API_URL}/${currentQuestion.promptImagePath}` }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option: any) => {
            const variant = optionVariant(option.id);
            
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.optionButton,
                  variant === 'selected' && styles.optionButtonSelected,
                  variant === 'correct' && styles.optionButtonCorrect,
                  variant === 'incorrect' && styles.optionButtonIncorrect,
                ]}
                onPress={() => handleOptionSelect(option.id)}
                disabled={currentState.isEvaluated}
              >
                <View style={[
                  styles.optionLabelContainer,
                  variant === 'selected' && styles.optionLabelContainerSelected,
                  variant === 'correct' && styles.optionLabelContainerCorrect,
                  variant === 'incorrect' && styles.optionLabelContainerIncorrect,
                ]} />
                <Text style={[
                  styles.optionText,
                  variant === 'selected' && styles.optionTextSelected,
                  variant === 'correct' && styles.optionTextCorrect,
                  variant === 'incorrect' && styles.optionTextIncorrect,
                ]}>{option.body}</Text>
              </Pressable>
            );
          })}
        </View>

        {currentState.isEvaluated && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Pembahasan</Text>
            {currentQuestion.explanationImagePath && (
              <Image
                source={{ uri: `${API_URL}/${currentQuestion.explanationImagePath}` }}
                style={styles.explanationImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}

        <View style={styles.navigationContainer}>
          <Pressable
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <LeftPointerIcon width={24} height={24} color={currentIndex === 0 ? colors.textSecondary : colors.primary} />
          </Pressable>

          <Pressable
            onPress={toggleHint}
            style={styles.hintButton}
          >
            <HintIcon width={24} height={24} />
          </Pressable>

          <Pressable
            style={[styles.navButton, !currentState.isEvaluated && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={!currentState.isEvaluated}
          >
            <RightPointerIcon width={24} height={24} color={!currentState.isEvaluated ? colors.textSecondary : colors.primary} />
          </Pressable>
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
    paddingBottom: 40,
  },
  headerWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  progressContainer: {
    marginBottom: 16,
  },
  progressText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelContainerSelected: {
    backgroundColor: colors.primary,
  },
  optionLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.white,
  },
  optionText: {
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.medium,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    marginBottom: 24,
  },
  explanationTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  explanationImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  explanationText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  hintButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintImage: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.primary,
    marginBottom: 16,
  },
  modalBody: {
    width: '100%',
    marginBottom: 24,
  },
  modalHintText: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  modalButtonLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.white,
  },
  optionButtonCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  optionButtonIncorrect: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  optionLabelContainerCorrect: {
    backgroundColor: colors.success,
  },
  optionLabelContainerIncorrect: {
    backgroundColor: colors.error,
  },
  optionTextCorrect: {
    color: colors.success,
  },
  optionTextIncorrect: {
    color: colors.error,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.primary,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
});

export default SnackbtQuestionScreen;
