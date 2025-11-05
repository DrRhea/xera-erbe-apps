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
import { type NavigationProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import SearchBar from '../../components/SearchBar';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import LeftPointerIcon from '../../../assets/icons/leftpointer.svg';
import RightPointerIcon from '../../../assets/icons/rightpointer.svg';
import HintIcon from '../../../assets/icons/hint.svg';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';
import { getExamDefinition, type ExamId, type ExamSubjectDefinition } from '../../data/examContent';
import {
  getCategoryModules,
  getModuleQuestions,
  type DigidawQuestionOption,
} from '../../data/digidawData';

const poweredByLogo = require('../../../assets/images/logoutuhijo.png');

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type GenericParamList = Record<string, object | undefined>;

type NavigationHook = () => NavigationProp<GenericParamList>;

type RouteLike<P> = { params: P };

type ModulesRouteParams = {
  examId: ExamId;
  examTitle: string;
  subjectId: string;
  subjectTitle: string;
};

type QuestionRouteParams = ModulesRouteParams & {
  moduleId: string;
  moduleTitle: string;
};

type CatalogConfig = {
  examId: ExamId;
  routes: {
    modulesRouteName?: string;
    questionRouteName: string;
  };
  useNavigationHook: NavigationHook;
};

type ModulesConfig = {
  examId: ExamId;
  routes: {
    questionRouteName: string;
  };
  useNavigationHook: NavigationHook;
  useRouteHook: () => RouteLike<any>;
};

type QuestionConfig = {
  examId: ExamId;
  useNavigationHook: NavigationHook;
  useRouteHook: () => RouteLike<any>;
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
  sectionTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.sectionTitle,
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
  cardShadow: {
    shadowColor: '#69787D',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});

const defaultPalette = {
  listIconBackground: '#FEF0E1',
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

export const createExamCatalogScreen = ({
  examId,
  routes,
  useNavigationHook,
}: CatalogConfig): FC => {
  const ExamCatalogScreen: FC = () => {
    const navigation = useNavigationHook();
    const navigate = navigation.navigate as (routeName: string, params?: object) => void;
    const layout = useResponsiveLayout();
    const definition = useMemo(() => getExamDefinition(examId), [examId]);
    const palette = { ...defaultPalette, ...definition.palette };

    const contentHorizontalPadding = useMemo(
      () => clamp(layout.horizontalPadding, 20, 28),
      [layout.horizontalPadding]
    );
    const sectionSpacing = useMemo(
      () => clamp(layout.sectionSpacing * 0.7, 20, 32),
      [layout.sectionSpacing]
    );
    const listGap = useMemo(
      () => clamp(layout.sectionSpacing * 0.45, 12, 18),
      [layout.sectionSpacing]
    );
    const cardPadding = useMemo(
      () => clamp(layout.horizontalPadding * 0.7, 16, 22),
      [layout.horizontalPadding]
    );
    const iconWrapperSize = useMemo(
      () => clamp(layout.horizontalPadding * 1.35, 44, 54),
      [layout.horizontalPadding]
    );
    const iconSize = useMemo(
      () => clamp(iconWrapperSize * 0.65, 26, 32),
      [iconWrapperSize]
    );

    const handleSelectSubject = useCallback(
      (subjectId: string, subjectTitle: string) => {
        if (definition.progression === 'twoStep' && routes.modulesRouteName) {
          navigate(routes.modulesRouteName, {
            examId,
            examTitle: definition.headerTitle,
            subjectId,
            subjectTitle,
          });
          return;
        }

        navigate(routes.questionRouteName, {
          examId,
          examTitle: definition.headerTitle,
          subjectId,
          subjectTitle,
          moduleId: subjectId,
          moduleTitle: subjectTitle,
        });
      },
      [definition, examId, navigate, routes.modulesRouteName, routes.questionRouteName]
    );

    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView
          style={sharedStyles.scrollView}
          contentContainerStyle={[
            sharedStyles.scrollContent,
            {
              paddingBottom: clamp(layout.sectionSpacing * 3, 96, 160),
              alignItems: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
            <AppHeader title={definition.headerTitle} contentHorizontalPadding={contentHorizontalPadding} />
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
            <SearchBar placeholder={definition.searchPlaceholder} />
            <Text style={sharedStyles.sectionTitle}>{definition.sectionTitle}</Text>
            <View style={{ flexDirection: 'column', rowGap: listGap, gap: listGap }}>
              {definition.subjects.map((subject: ExamSubjectDefinition) => (
                <Pressable
                  key={subject.id}
                  style={({ pressed }) => [
                    styles.subjectCard,
                    sharedStyles.cardShadow,
                    {
                      paddingHorizontal: cardPadding,
                      paddingVertical: clamp(cardPadding * 0.7, 14, 20),
                      borderRadius: clamp(cardPadding * 0.9, 16, 22),
                    },
                    pressed ? styles.cardPressed : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Buka ${subject.title}`}
                  onPress={() => handleSelectSubject(subject.id, subject.title)}
                >
                  <View
                    style={[
                      styles.subjectIconWrapper,
                      {
                        width: iconWrapperSize,
                        height: iconWrapperSize,
                        borderRadius: iconWrapperSize * 0.4,
                        backgroundColor: palette.listIconBackground,
                      },
                    ]}
                  >
                    <Image source={definition.listIcon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
                  </View>
                  <Text style={styles.subjectLabel}>{subject.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <BottomNavigation
          items={navItems}
          activeKey="home"
          backgroundColor={colors.white}
          activeColor={colors.primary}
          inactiveColor={colors.navInactive}
          style={sharedStyles.bottomNav}
        />
      </SafeAreaView>
    );
  };

  return ExamCatalogScreen;
};

export const createExamModulesScreen = ({
  examId,
  routes,
  useNavigationHook,
  useRouteHook,
}: ModulesConfig): FC => {
  const ExamModulesScreen: FC = () => {
    const navigation = useNavigationHook();
    const navigate = navigation.navigate as (routeName: string, params?: object) => void;
    const route = useRouteHook();
    const layout = useResponsiveLayout();
    const definition = useMemo(() => getExamDefinition(examId), [examId]);
    const palette = { ...defaultPalette, ...definition.palette };

    if (!route.params) {
      throw new Error('Exam modules route params are required.');
    }

    const { examTitle, subjectId, subjectTitle } = route.params as ModulesRouteParams;

    const modules = useMemo(
      () => getCategoryModules(subjectId, subjectTitle),
      [subjectId, subjectTitle]
    );

    const contentHorizontalPadding = useMemo(
      () => clamp(layout.horizontalPadding, 20, 28),
      [layout.horizontalPadding]
    );
    const sectionSpacing = useMemo(
      () => clamp(layout.sectionSpacing * 0.7, 20, 32),
      [layout.sectionSpacing]
    );
    const moduleGap = useMemo(
      () => clamp(layout.sectionSpacing * 0.45, 12, 18),
      [layout.sectionSpacing]
    );
    const modulePadding = useMemo(
      () => clamp(layout.horizontalPadding * 0.7, 16, 22),
      [layout.horizontalPadding]
    );
    const iconWrapperSize = useMemo(
      () => clamp(layout.horizontalPadding * 1.35, 44, 54),
      [layout.horizontalPadding]
    );
    const iconSize = useMemo(
      () => clamp(iconWrapperSize * 0.65, 26, 32),
      [iconWrapperSize]
    );

    const handleSelectModule = useCallback(
      (moduleId: string, moduleTitle: string) => {
        navigate(routes.questionRouteName, {
          examId,
          examTitle,
          subjectId,
          subjectTitle,
          moduleId,
          moduleTitle,
        });
      },
      [examId, examTitle, navigate, routes.questionRouteName, subjectId, subjectTitle]
    );

    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <ScrollView
          style={sharedStyles.scrollView}
          contentContainerStyle={[
            sharedStyles.scrollContent,
            {
              paddingBottom: clamp(layout.sectionSpacing * 3, 96, 160),
              alignItems: 'center',
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
            <AppHeader title={definition.headerTitle} contentHorizontalPadding={contentHorizontalPadding} />
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
            <Text style={styles.breadcrumb}>{`${examTitle} ・ ${subjectTitle}`}</Text>
            <SearchBar placeholder={definition.searchPlaceholder} />
            <Text style={styles.moduleHeading}>{subjectTitle}</Text>
            <View style={{ flexDirection: 'column', rowGap: moduleGap, gap: moduleGap }}>
              {modules.map((module) => (
                <Pressable
                  key={module.id}
                  style={({ pressed }) => [
                    styles.moduleCard,
                    sharedStyles.cardShadow,
                    {
                      paddingHorizontal: modulePadding,
                      paddingVertical: clamp(modulePadding * 0.7, 14, 20),
                      borderRadius: clamp(modulePadding * 0.9, 16, 22),
                    },
                    pressed ? styles.cardPressed : null,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Buka modul ${module.title}`}
                  onPress={() => handleSelectModule(module.id, module.title)}
                >
                  <View
                    style={[
                      styles.subjectIconWrapper,
                      {
                        width: iconWrapperSize,
                        height: iconWrapperSize,
                        borderRadius: iconWrapperSize * 0.4,
                        backgroundColor: palette.listIconBackground,
                      },
                    ]}
                  >
                    <Image source={definition.listIcon} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text numberOfLines={2} style={styles.moduleTitle}>
                      {module.title}
                    </Text>
                    <Text style={styles.moduleMeta}>{`Latihan ${subjectTitle}`}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
        <BottomNavigation
          items={navItems}
          activeKey="home"
          backgroundColor={colors.white}
          activeColor={colors.primary}
          inactiveColor={colors.navInactive}
          style={sharedStyles.bottomNav}
        />
      </SafeAreaView>
    );
  };

  return ExamModulesScreen;
};

export const createExamQuestionScreen = ({
  examId,
  useNavigationHook,
  useRouteHook,
}: QuestionConfig): FC => {
  const ExamQuestionScreen: FC = () => {
    const route = useRouteHook();
    const layout = useResponsiveLayout();
    const definition = useMemo(() => getExamDefinition(examId), [examId]);
    const palette = { ...defaultPalette, ...definition.palette };

    if (!route.params) {
      throw new Error('Exam question route params are required.');
    }

    const { examTitle, subjectTitle, moduleId, moduleTitle } = route.params as QuestionRouteParams;

    const questions = useMemo(
      () => getModuleQuestions(moduleId, moduleTitle),
      [moduleId, moduleTitle]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionStates, setQuestionStates] = useState(() =>
      questions.map(() => ({ selectedOptionId: null as string | null, isEvaluated: false }))
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
      (updater: (state: { selectedOptionId: string | null; isEvaluated: boolean }, index: number) => {
        selectedOptionId: string | null;
        isEvaluated: boolean;
      }) => {
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
      (optionId: string): 'default' | 'selected' | 'correct' | 'incorrect' => {
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
      <SafeAreaView style={sharedStyles.safeArea}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
            <AppHeader title={definition.headerTitle} contentHorizontalPadding={contentHorizontalPadding} />
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
              <View style={styles.summaryIconWrapper}>
                <Image source={definition.badgeImage} style={styles.summaryIcon} resizeMode="contain" />
              </View>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryLabel}>{examTitle}</Text>
                <Text style={styles.summaryTitle}>{moduleTitle}</Text>
              </View>
              <View style={[styles.questionIndicator, { backgroundColor: palette.questionIndicatorBackground }]}>
                <Text style={styles.questionIndicatorText}>{`Soal ${currentQuestion.number}/${questions.length}`}</Text>
              </View>
            </View>

            <View style={styles.questionHeader}>
              <Text style={styles.questionTitle}>{`Soal No. ${currentQuestion.number}`}</Text>
            </View>

            <View
              style={[
                styles.questionBody,
                {
                  backgroundColor: palette.questionBodyBackground,
                },
              ]}
            >
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

                    return (
                      <Pressable
                        key={option.id}
                        style={[
                          styles.optionCard,
                          {
                            paddingVertical: optionPaddingVertical,
                            paddingHorizontal: optionPaddingHorizontal,
                            marginRight: isLastInRow ? 0 : optionGap,
                            backgroundColor,
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Jawaban pilihan ${option.label}`}
                        onPress={() => handleSelectOption(option.id)}
                        disabled={isEvaluated}
                      >
                        <Text style={[styles.optionLabel, { color: labelColor }]}>{option.label}</Text>
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
                      backgroundColor: palette.explanationBackground,
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
                accessibilityLabel="Lihat hint"
                style={[styles.hintButton, { backgroundColor: palette.hintButtonBackground }]}
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
              <Text style={styles.modalTitle}>{`${definition.headerTitle} Hint`}</Text>
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

  return ExamQuestionScreen;
};

const styles = StyleSheet.create({
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
  },
  cardPressed: {
    opacity: 0.88,
  },
  subjectIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectLabel: {
    flex: 1,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  breadcrumb: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  moduleHeading: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
  },
  moduleInfo: {
    flex: 1,
    gap: 4,
  },
  moduleTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  moduleMeta: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: colors.textSecondary,
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
