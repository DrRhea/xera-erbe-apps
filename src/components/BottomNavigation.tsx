import React, { FC, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { SvgProps } from 'react-native-svg';

import { colors as themeColors, fontFamilies } from '../constants/theme';

export type BottomNavigationItem = {
  key: string;
  label: string;
  Icon: FC<SvgProps>;
  routeName?: string;
};

export type BottomNavigationProps = {
  items: BottomNavigationItem[];
  activeKey: string;
  onSelect?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
};

const BottomNavigation: FC<BottomNavigationProps> = ({
  items,
  activeKey,
  onSelect,
  style,
  activeColor = themeColors.primary,
  inactiveColor = themeColors.navInactive,
  backgroundColor = themeColors.surface,
}) => {
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const handlePress = useCallback(
    (item: BottomNavigationItem) => {
      onSelect?.(item.key);
      const targetRoute = item.routeName ?? item.key;
      if (!targetRoute) {
        return;
      }

      const state = navigation.getState();
      if (!state.routeNames || state.routeNames.includes(targetRoute)) {
        navigation.navigate(targetRoute as never);
      }
    },
    [navigation, onSelect]
  );

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {items.map((item) => {
        const { key, label, Icon } = item;
        const isActive = key === activeKey;
        const tintColor = isActive ? activeColor : inactiveColor;

        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => handlePress(item)}
            style={[styles.item, isActive && { borderTopColor: activeColor }]}
          >
            <Icon width={24} height={24} color={tintColor} fill={tintColor} />
            <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingHorizontal: 30,
    height: 63,
  },
  item: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fontFamilies.bold,
  },
});

export default BottomNavigation;
