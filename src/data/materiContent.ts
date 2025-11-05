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

export type MateriModule = LearningModule;

const fallbackModules = (subjectId: string, subjectTitle: string): MateriModule[] =>
  Array.from({ length: 6 }).map((_, index) => ({
    id: `${subjectId}-materi-${index + 1}`,
    title: `${subjectTitle} Materi ${index + 1}`,
  }));

export const getMateriModules = (subjectId: string, subjectTitle: string): MateriModule[] => {
  const normalizedId = normalizeSubjectId(subjectId);
  const modules = findLearningModules(subjectId);

  if (modules) {
    return modules;
  }

  return fallbackModules(normalizedId, subjectTitle);
};

export const getMateriIconComponent = (iconKey: MateriIconKey): FC<SvgProps> =>
  getLearningIconComponent(iconKey);
