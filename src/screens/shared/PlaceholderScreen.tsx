import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies } from '../../constants/theme';

export type PlaceholderScreenProps = {
  title: string;
  message?: string;
};

const PlaceholderScreen: FC<PlaceholderScreenProps> = ({ title, message }) => (
  <SafeAreaView style={styles.safeArea}>
    <AppHeader title={title} />
    <View style={styles.content}>
      <Text style={styles.message}>{message ?? `${title} screen coming soon.`}</Text>
    </View>
  </SafeAreaView>
);

export default PlaceholderScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: colors.primaryDark,
    textAlign: 'center',
  },
});
