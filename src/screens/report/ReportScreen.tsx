import React, { FC, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import AppHeader from '../../components/AppHeader';
import BottomNavigation, { type BottomNavigationItem } from '../../components/BottomNavigation';
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import ErboLogo from '../../../assets/images/logoutuhijo.png';
import { colors, fontFamilies } from '../../constants/theme';
import { useResponsiveLayout } from '../home/HomeScreen';

// ============================================================================
// INTERNAL COMPONENTS
// ============================================================================

// Icon components
const ListIcon: FC<{ size?: number; color?: string }> = ({ size = 11.2, color = colors.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LoaderIcon: FC<{ size?: number; color?: string }> = ({ size = 11.2, color = colors.textPrimary }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Progress Circle Component with gradient
const ProgressCircle: FC<{ percentage: number; size?: number }> = ({ percentage, size = 14.55 }) => {
  const radius = (size - 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine gradient colors based on percentage (green -> yellow -> red)
  const getGradientColors = (pct: number): { start: string; end: string } => {
    if (pct >= 80) {
      return { start: '#00BFAC', end: '#00D4B8' }; // Green
    } else if (pct >= 60) {
      return { start: '#FFD700', end: '#FFB800' }; // Yellow
    } else if (pct >= 40) {
      return { start: '#FFA500', end: '#FF8C00' }; // Orange
    } else {
      return { start: '#FF6B6B', end: '#FF4444' }; // Red
    }
  };

  const gradientColors = getGradientColors(percentage);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id={`progressGradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gradientColors.start} />
          <Stop offset="100%" stopColor={gradientColors.end} />
        </LinearGradient>
      </Defs>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E0E0E0"
        strokeWidth={2}
        fill="none"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#progressGradient-${percentage})`}
        strokeWidth={2}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

// Report Table Row Type
type ReportTableRow = {
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
};

// Report Table Component
const ReportTable: FC<{ data: ReportTableRow[] }> = ({ data }) => {
  return (
    <View style={tableStyles.container}>
      {/* Header Row */}
      <View style={tableStyles.headerRow}>
        <View style={[tableStyles.cell, tableStyles.subjectCell]}>
          <View style={tableStyles.headerContent}>
            <ListIcon size={11.2} color={colors.textPrimary} />
            <Text style={tableStyles.headerText}>Mata Pelajaran</Text>
          </View>
        </View>
        <View style={tableStyles.divider} />
        <View style={[tableStyles.cell, tableStyles.scoreCell]}>
          <View style={tableStyles.headerContent}>
            <ListIcon size={11.2} color={colors.textPrimary} />
            <Text style={tableStyles.headerText}>Total Soal</Text>
          </View>
        </View>
        <View style={tableStyles.divider} />
        <View style={[tableStyles.cell, tableStyles.totalCell]}>
          <View style={tableStyles.headerContent}>
            <LoaderIcon size={11.2} color={colors.textPrimary} />
            <Text style={tableStyles.headerText}>Skor</Text>
          </View>
        </View>
        <View style={tableStyles.divider} />
        <View style={[tableStyles.cell, tableStyles.progressCell]}>
          <View style={tableStyles.headerContent}>
            <LoaderIcon size={11.2} color={colors.textPrimary} />
            <Text style={tableStyles.headerText}>CR</Text>
          </View>
        </View>
        <View style={tableStyles.divider} />
      </View>

      {/* Data Rows */}
      {data.map((row, index) => (
        <React.Fragment key={`row-${index}`}>
          <View style={tableStyles.dataRow}>
            <View style={[tableStyles.cell, tableStyles.subjectCell]}>
              <Text style={tableStyles.dataText}>{row.subject}</Text>
            </View>
            <View style={tableStyles.divider} />
            <View style={[tableStyles.cell, tableStyles.scoreCell]}>
              <Text style={tableStyles.dataText}>{row.totalQuestions}</Text>
            </View>
            <View style={tableStyles.divider} />
            <View style={[tableStyles.cell, tableStyles.totalCell]}>
              <Text style={tableStyles.dataText}>{row.score}</Text>
            </View>
            <View style={tableStyles.divider} />
            <View style={[tableStyles.cell, tableStyles.progressCell]}>
              <View style={tableStyles.progressContainer}>
                <Text style={tableStyles.progressText}>{row.percentage.toFixed(1)}%</Text>
                <ProgressCircle percentage={row.percentage} size={14.55} />
              </View>
            </View>
            <View style={tableStyles.divider} />
          </View>
          {index < data.length - 1 && <View style={tableStyles.horizontalDivider} />}
        </React.Fragment>
      ))}
    </View>
  );
};


// Stat Item Component (for vertical list)
const StatItem: FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={statStyles.itemContainer}>
    <Text style={statStyles.label}>{label}</Text>
    <Text style={statStyles.value}>{value}</Text>
  </View>
);

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const bottomNavItems: BottomNavigationItem[] = [
  { key: 'Home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'Analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'Wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'Profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleReportData: ReportTableRow[] = [
  {
    subject: 'Penalaran Matematika',
    score: 47,
    totalQuestions: 116,
    percentage: 85.5,
  },
  {
    subject: 'Literasi Bahasa Indonesia',
    score: 72,
    totalQuestions: 185,
    percentage: 65.9,
  },
  {
    subject: 'Literasi Bahasa Inggris',
    score: 60,
    totalQuestions: 120,
    percentage: 50.0,
  },
  {
    subject: 'Bahasa Inggris',
    score: 55,
    totalQuestions: 115,
    percentage: 30.8,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ReportScreen: FC = () => {
  const layout = useResponsiveLayout();
  const [activeNavKey, setActiveNavKey] = useState('Analysis');

  const contentWidth = layout.contentWidth;
  const contentHorizontalPadding = layout.horizontalPadding;
  const sectionSpacing = layout.sectionSpacing;

  const handleNavSelect = (key: string) => {
    setActiveNavKey(key);
    // Navigation akan otomatis ditangani oleh BottomNavigation component
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(sectionSpacing * 2, 100),
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerWrapper, { width: contentWidth }]}>
          <AppHeader title="Laporan" contentHorizontalPadding={contentHorizontalPadding} />
        </View>

        <View
          style={[
            styles.contentWrapper,
            {
              width: contentWidth,
              paddingHorizontal: contentHorizontalPadding,
              marginTop: sectionSpacing,
              gap: sectionSpacing,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Report Oktober</Text>

          {/* First row - Progress cards (identical size) */}
          <View style={styles.statRow}>
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Persentase Kelas Offline</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: '78%' }]} />
                  <Text style={styles.progressBarText}>78%</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressCard}>
              <Text style={styles.progressCardTitle}>Moshi-Moshi</Text>
              <Text style={styles.progressCardValue}>3 kali</Text>
            </View>
          </View>

          {/* Second row - Vertical stats list */}
          <View style={styles.statsListCard}>
            <StatItem label="Ranking" value="8" />
            <View style={styles.statDivider} />
            <StatItem label="Total Soal" value="445" />
            <View style={styles.statDivider} />
            <StatItem label="Skor" value="546" />
            <View style={styles.statDivider} />
            <StatItem label="ACR" value="94,5%" />
          </View>

          <Text style={styles.tableTitle}>Tabel Progress Oktober</Text>

          <ReportTable data={sampleReportData} />

          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Image source={ErboLogo} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        items={bottomNavItems}
        activeKey={activeNavKey}
        onSelect={handleNavSelect}
        style={styles.bottomNav}
      />
    </SafeAreaView>
  );
};


// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerWrapper: {
    alignSelf: 'center',
  },
  contentWrapper: {
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.sectionTitle,
  },
  statRow: {
    flexDirection: 'row',
    gap: 13,
  },
  progressCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 14,
    minHeight: 70,
    justifyContent: 'center',
  },
  progressCardTitle: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  progressCardValue: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
    marginTop: 9,
  },
  progressBarContainer: {
    marginTop: 9,
  },
  progressTrack: {
    height: 17,
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.accent,
    borderRadius: 50,
  },
  progressBarText: {
    fontSize: 9,
    fontFamily: fontFamilies.bold,
    color: colors.white,
    zIndex: 1,
  },
  statsListCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 17,
    paddingVertical: 14,
  },
  statDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  tableTitle: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.sectionTitle,
    marginTop: 15,
  },
  poweredByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 16,
  },
  poweredByText: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  logo: {
    width: 53,
    height: 15,
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
});

const statStyles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontFamily: fontFamilies.medium,
    color: colors.textPrimary,
  },
  value: {
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
});


const tableStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 0.672,
    borderColor: '#DBDBDB',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#FCFCFC',
    minHeight: 45.9,
  },
  dataRow: {
    flexDirection: 'row',
    minHeight: 45.9,
    backgroundColor: '#FCFCFC',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  subjectCell: {
    flex: 3.3, // ~125.4px dari total 382.3px
  },
  scoreCell: {
    flex: 2.65, // ~101.9px dari total 382.3px
  },
  totalCell: {
    flex: 1.95, // ~75px dari total 382.3px
  },
  progressCell: {
    flex: 2.1, // ~80px dari total 382.3px
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5.6,
  },
  divider: {
    width: 0.672,
    backgroundColor: '#DBDBDB',
    alignSelf: 'stretch',
  },
  horizontalDivider: {
    height: 1.12,
    backgroundColor: '#DBDBDB',
  },
  headerText: {
    fontFamily: fontFamilies.bold,
    fontSize: 11.2,
    color: '#222222',
  },
  dataText: {
    fontFamily: fontFamilies.medium,
    fontSize: 11.2,
    color: '#222222',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.24,
  },
  progressText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12.32,
    color: '#222222',
  },
});

export default ReportScreen;

