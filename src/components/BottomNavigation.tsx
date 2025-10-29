import React, { FC } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';

export type BottomNavigationItem = {
  key: string;
  label: string;
  Icon: FC<SvgProps>;
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
  activeColor = '#015876',
  inactiveColor = '#617283',
  backgroundColor = '#FFFFFF',
}) => (
  <View style={[styles.container, { backgroundColor }, style]}>
    {items.map(({ key, label, Icon }) => {
      const isActive = key === activeKey;

      return (
        <Pressable
          key={key}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
          onPress={() => onSelect?.(key)}
          style={[styles.item, isActive && { borderTopColor: activeColor }]}
        >
          <Icon width={24} height={24} />
          <Text style={[styles.label, { color: isActive ? activeColor : inactiveColor }]}>{label}</Text>
        </Pressable>
      );
    })}
  </View>
);

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
    fontFamily: 'Montserrat-Bold',
  },
});

export default BottomNavigation;
