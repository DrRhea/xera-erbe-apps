import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';
import type { RootStackParamList } from '../../../App';
import { snackbtService } from '../../services/snackbtService';
import { QuestionViewer, type QuestionData, type OptionVariant } from '../../components/QuestionViewer';

const moduleBadge = require('../../../assets/images/snackbt.png');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type SnackbtQuestionRoute = RouteProp<RootStackParamList, 'SnackbtQuestion'>;

type QuestionState = {
  selectedOptionId: string | null;
  isEvaluated: boolean;
};

const SnackbtQuestionScreen: FC = () => {
  const route = useRoute<SnackbtQuestionRoute>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { moduleId, moduleTitle, session } = route.params;
  const layout = useResponsiveLayout();

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [isHintVisible, setHintVisible] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // SnackBT specific palette
  const palette = useMemo(() => ({
    summaryBackground: '#015876',
    questionBodyBackground: '#E0F7FA',
    explanationBackground: '#E0F7FA',
    hintButtonBackground: '#E0F7FA',
  }), []);

  useEffect(() => {
    if (session) {
      setAttemptId(session.attemptId);
      
      const mappedQuestions: QuestionData[] = session.questions.map((q: any, index: number) => {
          const correctOption = q.options.find((o: any) => o.isCorrect);
          return {
            id: q.id,
            number: index + 1,
            prompt: q.prompt,
            options: q.options.map((o: any) => ({
              id: o.id,
              label: o.label,
              text: o.body,
            })),
            correctOptionId: correctOption ? correctOption.id : '',
            hint: q.hint,
            explanation: q.explanation,
            promptImagePath: q.promptImagePath,
            hintImagePath: q.hintImagePath,
            explanationImagePath: q.explanationImagePath,
          };
      });
      setQuestions(mappedQuestions);

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
  const isEvaluated = currentState?.isEvaluated ?? false;

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );

  const updateQuestionState = useCallback(
    (updater: (state: QuestionState, index: number) => QuestionState) => {
      setQuestionStates((prev) => prev.map((state, index) => updater(state, index)));
    },
    []
  );

  const handleSelectOption = useCallback(
    async (optionId: string) => {
      if (isEvaluated || !attemptId || !currentQuestion) {
        return;
      }
      
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
      } catch (error) {
        console.error('Failed to record answer:', error);
      }
    },
    [currentIndex, isEvaluated, attemptId, currentQuestion, updateQuestionState]
  );

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => clamp(prev - 1, 0, questions.length - 1));
  }, [questions.length]);

  const handleNext = useCallback(() => {
    if (!isEvaluated) {
        return;
    }
    if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => clamp(prev + 1, 0, questions.length - 1));
    } else {
        navigation.goBack();
    }
  }, [questions.length, isEvaluated, currentIndex, navigation]);

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

  if (!questions.length) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader 
            title="SnackBT" 
            contentHorizontalPadding={contentHorizontalPadding} 
            onNotificationPress={handleNotificationPress}
            showBackButton
            onBackPress={() => navigation.goBack()}
        />
      </View>
      
      <QuestionViewer
        question={currentQuestion}
        totalQuestions={questions.length}
        currentIndex={currentIndex}
        subjectTitle="SnackBT"
        moduleTitle={moduleTitle}
        moduleIcon={moduleBadge}
        selectedOptionId={currentState?.selectedOptionId ?? null}
        isEvaluated={isEvaluated}
        onSelectOption={handleSelectOption}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleHint={toggleHint}
        isHintVisible={isHintVisible}
        layout={layout}
        optionVariant={optionVariant}
        palette={palette}
      />
    </SafeAreaView>
  );
};

export default SnackbtQuestionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    alignSelf: 'center',
  },
});
