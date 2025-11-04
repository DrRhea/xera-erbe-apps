import type { ImageSourcePropType } from 'react-native';

export type LearningCategory = {
  id: string;
  title: string;
};

const categoryIcon = require('../../assets/images/sekolah.png') as ImageSourcePropType;

export const learningCategories: LearningCategory[] = [
  { id: 'tka-snbt', title: 'TKA & SNBT' },
  { id: 'sma', title: 'SMA' },
  { id: 'kedinasan', title: 'Kedinasan' },
  { id: 'smp', title: 'SMP' },
  { id: 'mandiri-univ', title: 'Mandiri Univ' },
];

export const getLearningCategories = () => learningCategories;

export const getCategoryIcon = () => categoryIcon;
