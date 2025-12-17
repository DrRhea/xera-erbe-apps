import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import {
  learningIconComponents,
  type LearningIconKey,
  type LearningModule,
  findLearningModules,
  getLearningIconComponent,
  normalizeSubjectId,
} from './learningContent';

export const materiIconComponents = learningIconComponents;

export type MateriIconKey = LearningIconKey;

export type MateriLinkType = 'pdf' | 'youtube' | 'google-drive' | 'website';

export interface MateriModule {
  id: string;
  moduleId: string;
  title: string;
  summary: string | null;
  code: string | null;
  status: 'active' | 'inactive';
  link: string | null;
  linkType: MateriLinkType;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export const getMateriIconComponent = (iconKey: MateriIconKey): FC<SvgProps> =>
  getLearningIconComponent(iconKey);
3