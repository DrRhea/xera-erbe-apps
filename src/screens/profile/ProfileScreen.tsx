import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AppHeader from '../../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamilies, gradients, spacing, radii } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation, { BottomNavigationItem } from '../../components/BottomNavigation';
import { AVATARS, resolveAvatar } from '../../constants/avatars';
import { API_URL } from '../../services/api';

// Icons
import HomeIcon from '../../../assets/icons/home-2.svg';
import GraphIcon from '../../../assets/icons/graph.svg';
import TagIcon from '../../../assets/icons/tag.svg';
import UserIcon from '../../../assets/icons/user.svg';
import LogoutIcon from '../../../assets/icons/logout.svg';
import ContactIcon from '../../../assets/icons/contact.svg';
import ArrowIcon from '../../../assets/icons/rightpointer.svg';

import AvatarPlaceholder from '../../../assets/images/Ava2.png';

const navItems: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'leaderboard', label: 'Leaderboard', Icon: TagIcon, routeName: 'Leaderboard' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, updateProfile } = useAuth();
  const [gradeModalVisible, setGradeModalVisible] = React.useState(false);

  const grades = [
    '7 SMP', '8 SMP', '9 SMP',
    '10 SMA', '11 SMA', '12 SMA',
    'SNBT', 'Kedinasan', 'Alumni'
  ];

  const handleUpdateGrade = async (grade: string) => {
    try {
      await updateProfile({ grade });
      setGradeModalVisible(false);
    } catch (error) {
      console.error('Failed to update grade', error);
      Alert.alert('Error', 'Failed to update grade');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation to Login is handled by App.tsx based on isAuthenticated state
    } catch (error) {
      console.error('Logout failed', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleContact = () => {
    // Placeholder for now
    console.log('Contact Us clicked');
  };

  const avatarSource = resolveAvatar(user?.avatarPath, AvatarPlaceholder);

  return (
    <View style={styles.container}>
      <AppHeader title="Profil Saya" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={avatarSource} style={styles.avatar} />
              </View>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userHandle}>@{user?.email?.split('@')[0] || 'username'}</Text>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user?.badgeLabel || 'Idaman UI'}</Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nomor Telepon</Text>
                <Text style={styles.infoValue}>{user?.phoneNumber || '-'}</Text>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sekolah Asal</Text>
                <Text style={styles.infoValue}>{user?.school || '-'}</Text>
              </View>
              <View style={styles.divider} />
              
              <Pressable style={styles.infoRow} onPress={() => setGradeModalVisible(true)}>
                <Text style={styles.infoLabel}>Jenjang</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.infoValue, { marginRight: 8 }]}>{user?.grade || '-'}</Text>
                  <ArrowIcon width={12} height={12} color={colors.textSecondary} style={{ transform: [{ rotate: '90deg' }] }} />
                </View>
              </Pressable>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sosial Media</Text>
                <Text style={styles.infoValue}>{user?.metadata?.socialMedia || '-'}</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.actionButton} onPress={() => navigation.navigate('EditProfile' as never)}>
            <View style={styles.actionContent}>
              <UserIcon width={24} height={24} color={colors.primary} />
              <Text style={styles.actionText}>Edit Profil</Text>
            </View>
            <ArrowIcon width={20} height={20} color={colors.textSecondary} /> 
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleContact}>
            <View style={styles.actionContent}>
              <ContactIcon width={24} height={24} color={colors.primary} />
              <Text style={styles.actionText}>Kontak Kami</Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleLogout}>
            <View style={styles.actionContent}>
              <LogoutIcon width={24} height={24} color={colors.primary} />
              <Text style={styles.actionText}>Keluar</Text>
            </View>
          </Pressable>

        </ScrollView>

      <Modal
        visible={gradeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGradeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Jenjang</Text>
            <FlatList
              data={grades}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gradeItem}
                  onPress={() => handleUpdateGrade(item)}
                >
                  <Text style={[
                    styles.gradeText,
                    user?.grade === item && styles.selectedGradeText
                  ]}>
                    {item}
                  </Text>
                  {user?.grade === item && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setGradeModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation items={navItems} activeKey="profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#CDE8E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
  },
  userName: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.primary, // Or dark text
    marginBottom: spacing.xs,
  },
  userHandle: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: '#8BC34A', // Greenish
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
  },
  badgeText: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    color: colors.white,
  },
  infoSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    width: '100%',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.sectionTitle,
  },
  infoValue: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: spacing.xs,
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.sectionTitle,
    marginLeft: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    maxHeight: '50%',
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  gradeItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  selectedGradeText: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
  },
  selectedIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  closeButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  closeButtonText: {
    fontFamily: fontFamilies.bold,
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
