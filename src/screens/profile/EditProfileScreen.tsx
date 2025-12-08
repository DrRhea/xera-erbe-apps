import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, gradients, spacing, radii } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import BackArrowIcon from '../../../assets/icons/backarrow.svg';
import AvatarPlaceholder from '../../../assets/images/Ava2.png'; // Default avatar

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    // username: user?.username || '', // Backend doesn't seem to have username, maybe use email or add it?
    // For now I'll skip username or map it to something else if needed. 
    // The design shows username, but the backend User entity has name and email.
    // I'll assume 'name' is the display name.
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    school: user?.school || '',
    grade: user?.grade || '',
    socialMedia: user?.metadata?.socialMedia || '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        metadata: {
          ...user?.metadata,
          socialMedia: formData.socialMedia,
        },
      };
      // Remove flat socialMedia from payload if it causes issues with backend DTO validation, 
      // but since UpdateUserDto is Partial<RegisterData> and RegisterData doesn't have socialMedia, 
      // we should probably sanitize it or just pass the constructed object.
      // The authService.updateProfile takes Partial<RegisterData>.
      // Let's construct the exact object expected.
      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        school: formData.school,
        grade: formData.grade,
        metadata: {
          ...user?.metadata,
          socialMedia: formData.socialMedia,
        },
      };

      await updateProfile(updateData);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradients.header} style={styles.headerBackground} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackArrowIcon width={24} height={24} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profil</Text>
          <Pressable onPress={handleSave} disabled={isLoading} style={styles.saveButton}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Selesai</Text>
            )}
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image source={AvatarPlaceholder} style={styles.avatar} />
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Nama Lengkap"
              />
            </View>

            {/* Username is not in backend yet, skipping or using email as placeholder */}
            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) => handleChange('username', text)}
                placeholder="@username"
              />
            </View> */}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nomor HP/WA</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="081234567890"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sekolah Asal</Text>
              <TextInput
                style={styles.input}
                value={formData.school}
                onChangeText={(text) => handleChange('school', text)}
                placeholder="Nama Sekolah"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Jenjang</Text>
              <TextInput
                style={styles.input}
                value={formData.grade}
                onChangeText={(text) => handleChange('grade', text)}
                placeholder="Kelas"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sosial Media</Text>
              <TextInput
                style={styles.input}
                value={formData.socialMedia}
                onChangeText={(text) => handleChange('socialMedia', text)}
                placeholder="Instagram / Twitter / TikTok"
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    height: 200, // Adjust as needed
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.white,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
  },
  saveButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.white,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#CDE8E5', // Light teal background from image
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    paddingHorizontal: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    color: colors.sectionTitle,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface, // Or a very light grey/pinkish from image
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textPrimary,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default EditProfileScreen;
