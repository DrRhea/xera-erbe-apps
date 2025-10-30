import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppHeader from '../../components/AppHeader';

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
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#004559',
    textAlign: 'center',
  },
});
