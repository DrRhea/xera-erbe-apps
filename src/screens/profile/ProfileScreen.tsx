import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamilies, gradients, spacing, radii } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import BottomNavigation, { BottomNavigationItem } from '../../components/BottomNavigation';

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
  { key: 'wallet', label: 'Wallet', Icon: TagIcon, routeName: 'Wallet' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

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

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.header} style={styles.headerBackground} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
          <Text style={styles.headerBrand}>erbe</Text> 
          {/* Note: The brand logo in image is an icon + text. Using text for now. */}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={AvatarPlaceholder} style={styles.avatar} />
              </View>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userHandle}>@{user?.email?.split('@')[0] || 'username'}</Text>
            
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RBD0925015 - Idaman UI</Text>
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
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Jenjang</Text>
                <Text style={styles.infoValue}>{user?.grade || '-'}</Text>
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
      </SafeAreaView>
      <BottomNavigation items={navItems} activeKey="profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250, // Covers top part
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.white,
  },
  headerBrand: {
    fontFamily: fontFamilies.hero,
    fontSize: 20,
    color: colors.white,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    backgroundColor: colors.surface, // Or transparent? The image shows the card is white but the top part is transparent/gradient.
    // Actually the card with info starts below the avatar.
    // Let's make a card for the info section.
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
});

export default ProfileScreen;
