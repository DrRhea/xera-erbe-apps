import React, { FC, useMemo } from 'react';
import { LinearGradient, type LinearGradientProps } from 'expo-linear-gradient';
import { StyleProp, StyleSheet, Text, useWindowDimensions, View, ViewStyle } from 'react-native';
import Svg, { Path, type SvgProps } from 'react-native-svg';

import PromoIcon from '../../assets/icons/promo.svg';
import { colors, fontFamilies } from '../constants/theme';

const GUIDELINE_BASE_WIDTH = 375;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const scale = (size: number, width: number) => (width / GUIDELINE_BASE_WIDTH) * size;

const moderateScale = (size: number, width: number, factor = 0.5) =>
	size + (scale(size, width) - size) * factor;

type BannerLayout = {
	screenWidth: number;
	horizontalPadding: number;
	recommendationPaddingHorizontal: number;
	recommendationPaddingVertical: number;
};

type GradientColors = LinearGradientProps['colors'];

type PromotionBannerProps = {
	badgeText: string;
	discountText: string;
	suffixText?: string;
	promoCode: string;
	codeLabel?: string;
	gradientColors?: GradientColors;
	Icon?: FC<SvgProps>;
	iconSize?: number;
	codeIcon?: FC<SvgProps>;
	codeIconSize?: number;
	layout?: BannerLayout;
	containerStyle?: StyleProp<ViewStyle>;
	testID?: string;
	showWave?: boolean;
};

const MIN_HORIZONTAL_PADDING = 14;
const MIN_VERTICAL_PADDING = 18;
const MIN_HEIGHT = 150;
const MAX_HEIGHT = 196;

const DEFAULT_GRADIENT: GradientColors = ['#CFE8E6', '#86C8C6'];

const computeFallbackLayout = (width: number): BannerLayout => {
	const safeWidth = Math.max(width, 320);
	const horizontalPadding = clamp(moderateScale(22, safeWidth, 0.45), MIN_HORIZONTAL_PADDING, 26);
	const recommendationPaddingHorizontal = clamp(
		moderateScale(24, safeWidth, 0.5),
		MIN_HORIZONTAL_PADDING + 4,
		30,
	);
	const recommendationPaddingVertical = clamp(
		moderateScale(24, safeWidth, 0.5),
		MIN_VERTICAL_PADDING,
		30,
	);

	return {
		screenWidth: safeWidth,
		horizontalPadding,
		recommendationPaddingHorizontal,
		recommendationPaddingVertical,
	};
};

const BannerWave: FC = () => (
	<Svg viewBox="0 0 387 84" style={styles.wave}>
		<Path d="M0 42C52 68 130 86 200 70C270 54 320 64 387 84V84H0V42Z" fill={colors.white} />
	</Svg>
);

const PromotionBanner: FC<PromotionBannerProps> = ({
	badgeText,
	discountText,
	suffixText = 'off',
	promoCode,
	codeLabel = 'KODE\nPROMO',
		gradientColors = DEFAULT_GRADIENT,
	Icon = PromoIcon,
	iconSize = 62,
		codeIcon: CodeIconComponent = Icon,
	codeIconSize = 26,
	layout,
	containerStyle,
	testID,
	showWave = true,
}) => {
	const { width } = useWindowDimensions();

	const metrics = useMemo(() => layout ?? computeFallbackLayout(width), [layout, width]);

	const badgeHorizontal = Math.max(metrics.horizontalPadding * 0.75, 14);
	const badgeVertical = Math.max(metrics.horizontalPadding * 0.45, 10);
	const codeLabelHorizontal = Math.max(metrics.horizontalPadding * 0.6, 12);
	const codeLabelVertical = Math.max(metrics.horizontalPadding * 0.35, 6);
	const codeBadgeHorizontal = Math.max(metrics.horizontalPadding, 20);
	const codeBadgeVertical = Math.max(metrics.horizontalPadding * 0.35, 8);
	const minHeight = clamp(metrics.screenWidth * 0.36, MIN_HEIGHT, MAX_HEIGHT);

	return (
		<View style={[styles.container, containerStyle]} testID={testID}>
			<LinearGradient
			colors={gradientColors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={[
					styles.gradient,
					{
						paddingHorizontal: metrics.recommendationPaddingHorizontal,
						paddingVertical: metrics.recommendationPaddingVertical,
						minHeight,
					},
				]}
			>
				{showWave ? <BannerWave /> : null}
				<View style={styles.topRow}>
					<View
						style={[
							styles.badge,
							{ paddingHorizontal: badgeHorizontal, paddingVertical: badgeVertical },
						]}
					>
						<Text style={styles.badgeText}>{badgeText}</Text>
					</View>
					<View style={styles.iconWrapper}>
						<Icon width={iconSize} height={iconSize} />
					</View>
					<View style={styles.discountGroup}>
						<Text style={styles.discount}>{discountText}</Text>
						{suffixText ? <Text style={styles.discountSuffix}>{suffixText}</Text> : null}
					</View>
				</View>
				<View style={styles.codeWrapper}>
					<View
						style={[
							styles.codeLabel,
							{ paddingHorizontal: codeLabelHorizontal, paddingVertical: codeLabelVertical },
						]}
					>
						<CodeIconComponent width={codeIconSize} height={codeIconSize} />
						<Text style={styles.codeLabelText}>{codeLabel}</Text>
					</View>
					<View
						style={[
							styles.codeBadge,
							{ paddingHorizontal: codeBadgeHorizontal, paddingVertical: codeBadgeVertical },
						]}
					>
						<Text style={styles.codeText}>{promoCode}</Text>
					</View>
				</View>
			</LinearGradient>
		</View>
	);
};

export default PromotionBanner;

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	gradient: {
		borderRadius: 20,
		overflow: 'hidden',
		minHeight: 157,
		paddingHorizontal: 24,
		paddingVertical: 24,
		position: 'relative',
	},
	wave: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		width: '100%',
		height: 84,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		zIndex: 1,
	},
	badge: {
		backgroundColor: colors.primary,
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 12,
		zIndex: 1,
	},
	badgeText: {
		color: colors.white,
		fontFamily: fontFamilies.extraBold,
		fontSize: 18,
		lineHeight: 22,
		letterSpacing: 0.4,
		textAlign: 'center',
	},
	iconWrapper: {
		paddingHorizontal: 12,
		zIndex: 1,
	},
	discountGroup: {
		alignItems: 'flex-end',
		zIndex: 1,
	},
	discount: {
		fontSize: 50,
		color: colors.accent,
		fontFamily: fontFamilies.extraBold,
		textShadowColor: colors.white,
		textShadowOffset: { width: 3, height: 3 },
		textShadowRadius: 1,
	},
	discountSuffix: {
		marginTop: -6,
		fontSize: 15,
		color: colors.white,
		fontFamily: fontFamilies.bold,
		textShadowColor: colors.primary,
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 0,
	},
	codeWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 20,
		zIndex: 1,
	},
	codeLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 30,
		borderWidth: 1,
		borderColor: colors.primary,
		backgroundColor: colors.white,
		paddingHorizontal: 14,
		paddingVertical: 6,
		marginRight: 12,
	},
	codeLabelText: {
		marginLeft: 8,
		fontSize: 9,
		lineHeight: 11,
		color: colors.primary,
		fontFamily: fontFamilies.bold,
		textAlign: 'center',
	},
	codeBadge: {
		backgroundColor: colors.primary,
		borderRadius: 30,
		paddingHorizontal: 24,
		paddingVertical: 8,
	},
	codeText: {
		fontSize: 13,
		color: colors.white,
		fontFamily: fontFamilies.bold,
		letterSpacing: 0.4,
	},
});
