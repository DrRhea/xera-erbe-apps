import { useFonts } from 'expo-font';

import { fontFamilies } from '../constants/theme';

const fontMap = {
	[fontFamilies.regular]: require('../../assets/fonts/montserrat/Montserrat-Regular.ttf'),
	[fontFamilies.medium]: require('../../assets/fonts/montserrat/Montserrat-Medium.ttf'),
	[fontFamilies.semiBold]: require('../../assets/fonts/montserrat/Montserrat-SemiBold.ttf'),
	[fontFamilies.bold]: require('../../assets/fonts/montserrat/Montserrat-Bold.ttf'),
	[fontFamilies.extraBold]: require('../../assets/fonts/montserrat/Montserrat-ExtraBold.ttf'),
	[fontFamilies.hero]: require('../../assets/fonts/playpensans/PlaypenSans-ExtraBold.ttf'),
} as const;

export const useAppFonts = () => useFonts(fontMap);

export type AppFontKeys = keyof typeof fontMap;
