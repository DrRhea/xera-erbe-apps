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
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamilies, gradients, spacing, radii } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import BackArrowIcon from '../../../assets/icons/backarrow.svg';
import ArrowIcon from '../../../assets/icons/rightpointer.svg';
import { AVATARS, AVATAR_KEYS, resolveAvatar } from '../../constants/avatars';
import { API_URL } from '../../services/api';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);

  const grades = [
    '7 SMP', '8 SMP', '9 SMP',
    '10 SMA', '11 SMA', '12 SMA',
    'SNBT', 'Kedinasan', 'Alumni'
  ];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    school: user?.school || '',
    grade: user?.grade || '',
    socialMedia: user?.metadata?.socialMedia || '',
    avatarPath: user?.avatarPath || '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarSelect = (key: string) => {
    setFormData((prev) => ({ ...prev, avatarPath: key }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        school: formData.school,
        grade: formData.grade,
        avatarPath: formData.avatarPath,
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

  const currentAvatarSource = resolveAvatar(formData.avatarPath, AVATARS['Ava1.png']);

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
              <Image source={currentAvatarSource} style={styles.avatar} />
            </View>
            <Text style={styles.changeAvatarText}>Pilih Avatar</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarSelectorContent} style={styles.avatarSelector}>
              {AVATAR_KEYS.map((key) => (
                <Pressable 
                  key={key} 
                  onPress={() => handleAvatarSelect(key)} 
                  style={[
                    styles.avatarOption, 
                    formData.avatarPath === key && styles.avatarOptionSelected
                  ]}
                >
                  <Image source={AVATARS[key]} style={styles.avatarOptionImage} />
                </Pressable>
              ))}
            </ScrollView>
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
              <Pressable
                style={[styles.input, styles.dropdownTrigger]}
                onPress={() => setGradeModalVisible(true)}
              >
                <Text style={[styles.inputText, !formData.grade && styles.placeholderText]}>
                  {formData.grade || 'Pilih Jenjang'}
                </Text>
                <ArrowIcon 
                  width={16} 
                  height={16} 
                  color={colors.textSecondary} 
                  style={{ transform: [{ rotate: '90deg' }] }} 
                />
              </Pressable>
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
                    onPress={() => {
                      handleChange('grade', item);
                      setGradeModalVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.gradeText,
                      formData.grade === item && styles.selectedGradeText
                    ]}>
                      {item}
                    </Text>
                    {formData.grade === item && (
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
  avatarSelector: {
    marginTop: 16,
    maxHeight: 80,
  },
  avatarSelectorContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  changeAvatarText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: colors.text,
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
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: '#C7C7CD', // Default placeholder color
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

export default EditProfileScreen;
