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

import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';

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

  useEffect(() => {
    if (session) {
      setAttemptId(session.attemptId);
      setQuestions(session.questions);
      setQuestionStates(session.questions.map(() => ({ selectedOptionId: null, isEvaluated: false })));
    }
  }, [session]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleOptionSelect = useCallback(async (optionId: string) => {
    if (!attemptId) return;
    
    const currentQuestion = questions[currentIndex];
    const currentState = questionStates[currentIndex];

    if (currentState.isEvaluated) return;

    // Optimistic update
    const newStates = [...questionStates];
    newStates[currentIndex] = {
      selectedOptionId: optionId,
      isEvaluated: true,
    };
    setQuestionStates(newStates);

    try {
      await snackbtService.recordAnswer(attemptId, currentQuestion.id, optionId);
    } catch (e) {
      console.error('Failed to record answer', e);
    }
  }, [attemptId, questions, currentIndex, questionStates]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.goBack(); // Or navigate to a result screen
    }
  }, [currentIndex, questions.length, navigation]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  if (!questions.length) {
    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentState = questionStates[currentIndex];

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
          showBack
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
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option: any) => {
            const isSelected = currentState.selectedOptionId === option.id;
            const variant: OptionVariant = isSelected ? 'selected' : 'default';
            
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.optionButton,
                  variant === 'selected' && styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionSelect(option.id)}
                disabled={currentState.isEvaluated}
              >
                <View style={[
                  styles.optionLabelContainer,
                  variant === 'selected' && styles.optionLabelContainerSelected
                ]}>
                  <Text style={[
                    styles.optionLabel,
                    variant === 'selected' && styles.optionLabelSelected
                  ]}>{option.label}</Text>
                </View>
                <Text style={[
                  styles.optionText,
                  variant === 'selected' && styles.optionTextSelected
                ]}>{option.body}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.navigationContainer}>
          <Pressable
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <LeftPointerIcon width={24} height={24} color={currentIndex === 0 ? colors.textSecondary : colors.primary} />
            <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>Sebelumnya</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>{currentIndex === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}</Text>
            <RightPointerIcon width={24} height={24} color={colors.primary} />
          </Pressable>
        </View>
      </ScrollView>
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
    fontFamily: fontFamilies.montserrat.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontFamily: fontFamilies.playpenSans.medium,
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
    fontFamily: fontFamilies.montserrat.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.white,
  },
  optionText: {
    flex: 1,
    fontFamily: fontFamilies.playpenSans.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.playpenSans.medium,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontFamily: fontFamilies.montserrat.bold,
    fontSize: 14,
    color: colors.primary,
  },
  navButtonTextDisabled: {
    color: colors.textSecondary,
  },
});

export default SnackbtQuestionScreen;
