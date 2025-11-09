import React, { FC, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import AppHeader from '../../components/AppHeader';
import { colors, fontFamilies, spacing, radii } from '../../constants/theme';
import DigidawImage from '../../../assets/images/digidaw.png';
import { getNotificationData, type NotificationItem } from '../../data/notificationData';


const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// ============================================================================
// RESPONSIVE LAYOUT HOOK
// ============================================================================

const useResponsiveLayout = () => {
  const { width } = useWindowDimensions();

  const contentWidth = clamp(width, 320, 440);
  const horizontalPadding = clamp((width - contentWidth) / 2 + spacing.xxl, spacing.xxl, 60);
  const cardWidth = contentWidth - horizontalPadding * 2;
  const cardGap = clamp(spacing.xxl, 20, 30);
  const iconSize = clamp(cardWidth * 0.147, 50, 57);
  const buttonWidth = clamp(cardWidth * 0.227, 75, 88);

  return {
    contentWidth,
    horizontalPadding,
    cardWidth,
    cardGap,
    iconSize,
    buttonWidth,
  };
};

// ============================================================================
// NOTIFICATION CARD COMPONENT
// ============================================================================

type NotificationCardProps = {
  item: NotificationItem;
  layout: ReturnType<typeof useResponsiveLayout>;
};

const NotificationCard: FC<NotificationCardProps> = ({ item, layout }) => {
  const { cardWidth, iconSize, buttonWidth } = layout;

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}>
      {/* Unread Indicator */}
      {item.isUnread && (
        <View style={styles.unreadDot}>
          <Svg width={10} height={10}>
            <Circle cx={5} cy={5} r={5} fill="#FF8725" />
          </Svg>
        </View>
      )}

      {/* Card Background */}
      <View
        style={[
          styles.card,
          { backgroundColor: item.isUnread ? '#F5FFFD' : colors.white },
        ]}
      >
        <View style={styles.cardContent}>
          {/* Icon */}
          <View style={[styles.iconWrapper, { width: iconSize, height: iconSize }]}>
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={[styles.icon, { width: iconSize, height: iconSize }]}
              resizeMode="cover"
            />
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            {/* Button */}
            {item.buttonText && (
              <Pressable
                style={[styles.button, { width: buttonWidth }]}
                onPress={item.onButtonPress}
                accessibilityRole="button"
                accessibilityLabel={item.buttonText}
              >
                <Text style={styles.buttonText}>{item.buttonText}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const NotificationScreen: FC = () => {
  const layout = useResponsiveLayout();
  const [notifications] = useState<NotificationItem[]>(getNotificationData());

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Notifikasi" showBackButton={true} showNotificationButton={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: layout.horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.notificationList, { gap: layout.cardGap }]}>
          {notifications.map((item) => (
            <NotificationCard key={item.id} item={item} layout={layout} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl * 2,
  },
  notificationList: {
    flexDirection: 'column',
  },
  cardContainer: {
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 44,
    left: 10,
    zIndex: 10,
    width: 10,
    height: 10,
  },
  card: {
    borderRadius: 20,
    minHeight: 99,
    paddingHorizontal: 32,
    paddingVertical: 22,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  iconWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  icon: {
    borderRadius: 10,
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 9,
    color: colors.white,
    textAlign: 'center',
  },
});

export default NotificationScreen;

