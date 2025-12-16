import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, type NavigationProp, type RouteProp } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';
import type { RootStackParamList } from '../../../App';
import { useResponsiveLayout } from '../home/HomeScreen';
import { snackbtService, type SnackbtModule } from '../../services/snackbtService';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const SnackbtDetailScreen: FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'SnackbtDetail'>>();
  const layout = useResponsiveLayout();
  const { moduleId, moduleTitle } = route.params;
  const [module, setModule] = useState<SnackbtModule | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const data = await snackbtService.getModule(moduleId);
        setModule(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchModule();
  }, [moduleId]);

  const handleStart = async () => {
    setLoading(true);
    try {
      const session = await snackbtService.startSession(moduleId);
      navigation.navigate('SnackbtQuestion', {
        moduleId,
        moduleTitle,
        session,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const contentHorizontalPadding = React.useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding]
  );
  const sectionSpacing = React.useMemo(
    () => clamp(layout.sectionSpacing * 0.6, 18, 26),
    [layout.sectionSpacing]
  );

  if (!module) {
    return (
      <SafeAreaView style={sharedStyles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        style={sharedStyles.scrollView}
        contentContainerStyle={sharedStyles.scrollContent}
      >
        <View style={[sharedStyles.headerWrapper, { width: layout.contentWidth }]}>
          <AppHeader
            title={moduleTitle}
            showBackButton
            onBackPress={handleBack}
            contentHorizontalPadding={contentHorizontalPadding}
          />
        </View>

        <View style={[
          sharedStyles.contentContainer, 
          { 
            width: layout.contentWidth,
            paddingHorizontal: contentHorizontalPadding,
            marginTop: sectionSpacing,
          }
        ]}>
          <View style={styles.card}>
            <Text style={styles.title}>{module.title}</Text>
            {module.summary && (
              <Text style={styles.summary}>{module.summary}</Text>
            )}
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{module.metadata.totalQuestions || 0}</Text>
                <Text style={styles.statLabel}>Soal</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                { opacity: pressed || loading ? 0.8 : 1 },
              ]}
              onPress={handleStart}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.startButtonText}>Mulai Latihan</Text>
              )}
            </Pressable>
          </View>
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
  contentContainer: {
    alignSelf: 'center',
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  summary: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.white,
  },
});

export default SnackbtDetailScreen;
