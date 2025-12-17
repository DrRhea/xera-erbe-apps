import React, { FC, useMemo } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../../../App';
import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';

type MateriViewerRoute = RouteProp<RootStackParamList, 'MateriViewer'>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MateriViewerScreen: FC = () => {
  const route = useRoute<MateriViewerRoute>();
  const navigation = useNavigation();
  const { module, subjectTitle, categoryTitle } = route.params;
  const layout = useResponsiveLayout();

  const contentHorizontalPadding = useMemo(
    () => clamp(layout.horizontalPadding, 20, 28),
    [layout.horizontalPadding],
  );

  const handleOpenLink = () => {
    if (module.link) {
      Linking.openURL(module.link).catch((err) =>
        console.error('An error occurred', err)
      );
    }
  };

  const renderContent = () => {
    if (!module.link) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>No link available for this module.</Text>
        </View>
      );
    }

    if (module.linkType === 'website' || module.linkType === 'youtube') {
      return (
        <WebView
          source={{ uri: module.link }}
          style={styles.webview}
          startInLoadingState
          scalesPageToFit
        />
      );
    }

    if (module.linkType === 'pdf') {
      // If it's a Google Drive link, it likely has its own viewer, so don't wrap it in gview
      const isGDrive = module.link.includes('drive.google.com');
      
      // For Android, use Google Docs Viewer only if it's a direct PDF file and NOT a GDrive link
      const uri = (Platform.OS === 'android' && !isGDrive)
        ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(module.link)}`
        : module.link;
        
      return (
        <WebView
          source={{ uri }}
          style={styles.webview}
          startInLoadingState
          scalesPageToFit
        />
      );
    }

    // Default fallback for other types (e.g. google-drive) or if user prefers external
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{module.title}</Text>
          {module.summary ? (
            <Text style={styles.summary}>{module.summary}</Text>
          ) : null}
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{module.linkType}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
            <Text style={styles.buttonText}>Buka Materi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.headerWrapper, { width: layout.contentWidth }]}>
        <AppHeader title="Materi" contentHorizontalPadding={contentHorizontalPadding} />
      </View>
      <View style={[styles.contentContainer, { paddingHorizontal: contentHorizontalPadding }]}>
        <Text style={styles.breadcrumb}>
          Rangkuman Materi {subjectTitle} {categoryTitle} {module.title}
        </Text>
        <View style={styles.viewerContainer}>
          {renderContent()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerWrapper: {
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  breadcrumb: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.primary,
    marginVertical: 16,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webview: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.textSecondary,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  value: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.primary,
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.white,
  },
});

export default MateriViewerScreen;
