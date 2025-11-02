import React, { FC, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import BackArrowIcon from '../../assets/icons/backarrow.svg';
import NotifIcon from '../../assets/icons/notifdot.svg';
import ErboLogo from '../../assets/images/logoutuhputih.png';
import { colors, fontFamilies, gradients, radii, spacing } from '../constants/theme';

export type AppHeaderProps = {
	title: string;
	onBackPress?: () => void;
	onNotificationPress?: () => void;
  contentHorizontalPadding?: number;
};

const AppHeader: FC<AppHeaderProps> = ({
  title,
  onBackPress,
  onNotificationPress,
  contentHorizontalPadding = spacing.xxl,
}) => {
	const insets = useSafeAreaInsets();
	const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();

	const handleBackPress = useCallback(() => {
		if (onBackPress) {
			onBackPress();
			return;
		}

		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	}, [navigation, onBackPress]);

	return (
		<View style={styles.wrapper}>
			<LinearGradient
				colors={[...gradients.header]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}
				style={[
					styles.gradient,
					{ paddingTop: insets.top + spacing.lg, paddingHorizontal: contentHorizontalPadding },
				]}
			>
				<View style={styles.content}>
					<View style={styles.leadingGroup}>
						<Pressable
							onPress={handleBackPress}
							hitSlop={12}
							accessibilityRole="button"
							accessibilityLabel="Go back"
							style={styles.backButton}
						>
							<BackArrowIcon width={20} height={20} />
						</Pressable>
						<Text style={styles.title}>{title}</Text>
					</View>

								<View style={styles.trailingGroup}>
									<Image source={ErboLogo} style={styles.logo} resizeMode="contain" />
									<Pressable
										accessibilityRole="button"
										accessibilityLabel="Open notifications"
										hitSlop={12}
										onPress={onNotificationPress}
										style={styles.notificationButton}
									>
										<NotifIcon style={styles.notificationIcon} />
									</Pressable>
								</View>
				</View>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		borderBottomLeftRadius: radii.xl,
		borderBottomRightRadius: radii.xl,
		overflow: 'hidden',
	},
	gradient: {
		paddingBottom: 20,
	},
	content: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	leadingGroup: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButton: {
		padding: 4,
		marginRight: spacing.md,
	},
	title: {
		fontSize: 22,
		color: colors.white,
		fontFamily: fontFamilies.bold,
	},
	trailingGroup: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logo: {
		width: 103,
		height: 28,
		marginRight: 16,
	},
	notificationButton: {
			width: 44,
			height: 44,
			justifyContent: 'center',
			alignItems: 'center',
	},
		notificationIcon: {
			width: 28,
			height: 28,
			transform: [{ translateY: 5 }],
		},
});

export default AppHeader;
