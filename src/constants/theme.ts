// Centralized design tokens shared across the app.

export const colors = {
	background: '#F0F0F0',
	surface: '#FFFFFF',
	primary: '#015876',
	primaryDark: '#004559',
	accent: '#FF8725',
	textPrimary: '#202020',
	textSecondary: '#7C7C7C',
	darkText: '#202020',
	mutedText: '#7C7C7C',
	sectionTitle: '#004559',
	success: '#00BFAC',
	greenLight: '#00BFAC',
	navInactive: '#617283',
	white: '#FFFFFF',
} as const;

export const fontFamilies = {
	regular: 'Montserrat-Regular',
	medium: 'Montserrat-Medium',
	semiBold: 'Montserrat-SemiBold',
	bold: 'Montserrat-Bold',
	extraBold: 'Montserrat-ExtraBold',
	hero: 'PlaypenSans-ExtraBold',
} as const;

export const gradients = {
	header: ['#1C637B', 'rgba(158,224,191,0.62)'] as const,
	leaderboard: {
		1: ['#CCF3ED', '#7FC9BA'] as const,
		2: ['#B8E5DE', '#62BCAE'] as const,
		3: ['#B8E5DE', '#62BCAE'] as const,
	},
} as const;

export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 30,
} as const;

export const radii = {
	sm: 6,
	md: 12,
	lg: 24,
	xl: 30,
} as const;

export const theme = {
	colors,
	fontFamilies,
	gradients,
	spacing,
	radii,
} as const;

export type Theme = typeof theme;
