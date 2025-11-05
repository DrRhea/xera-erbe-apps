import React, { FC, memo } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

import SearchIcon from '../../assets/icons/search.svg';
import { colors, fontFamilies } from '../constants/theme';

type SearchBarProps = {
	placeholder: string;
	style?: StyleProp<ViewStyle>;
	onPress?: () => void;
	value?: string;
	onChangeText?: (text: string) => void;
};

const SearchBar: FC<SearchBarProps> = ({ placeholder, style, onPress, value, onChangeText }) => {
	if (onChangeText) {
		return (
			<View style={[styles.container, style]}>
				<SearchIcon width={18} height={18} />
				<TextInput
					style={styles.input}
					placeholder={placeholder}
					placeholderTextColor="rgba(0,0,0,0.8)"
					value={value}
					onChangeText={onChangeText}
				/>
			</View>
		);
	}

	return (
		<View style={[styles.container, style]}>
			<Text style={styles.placeholder}>{placeholder}</Text>
			<SearchIcon width={18} height={18} />
		</View>
	);
};

export default memo(SearchBar);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.85)',
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 10,
		shadowColor: colors.primaryDark,
		shadowOpacity: 0.1,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
	},
	placeholder: {
		flex: 1,
		fontSize: 13,
		color: 'rgba(0,0,0,0.8)',
		fontFamily: fontFamilies.medium,
	},
	input: {
		flex: 1,
		fontSize: 13,
		color: 'rgba(0,0,0,0.8)',
		fontFamily: fontFamilies.medium,
	},
});
