import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import {
  findLearningModules,
  getLearningIconComponent,
  learningIconComponents,
  learningIconKeys,
  type LearningIconKey,
  type LearningModule,
  normalizeSubjectId,
} from './learningContent';

export const iconComponents = learningIconComponents;

export type CategoryIconKey = LearningIconKey;

export const categoryIconKeys = learningIconKeys;

const iconKeySequence = categoryIconKeys;

export type CategoryItem = {
  id: string;
  label: string;
  iconKey: CategoryIconKey;
};

export type CategoryCollection = {
  title: string;
  items: CategoryItem[];
};

const baseCollections: Record<string, CategoryCollection> = {
  sma: {
    title: 'SMA',
    items: [
      { id: 'matematika', label: 'Matematika', iconKey: 'material1' },
      { id: 'kimia', label: 'Kimia', iconKey: 'material2' },
      { id: 'fisika', label: 'Fisika', iconKey: 'material3' },
      { id: 'biologi', label: 'Biologi', iconKey: 'material4' },
      { id: 'ekonomi', label: 'Ekonomi', iconKey: 'material5' },
      { id: 'geografi', label: 'Geografi', iconKey: 'material6' },
      { id: 'sosiologi', label: 'Sosiologi', iconKey: 'material7' },
      { id: 'bahasa-inggris', label: 'Bahasa Inggris', iconKey: 'vector' },
    ],
  },
  'tka-snbt': {
    title: 'TKA & SNBT',
    items: [
      { id: 'penalaran-umum', label: 'Penalaran Umum', iconKey: 'material1' },
      { id: 'penalaran-matematika', label: 'Penalaran Matematika', iconKey: 'material2' },
      { id: 'literasi-indonesia', label: 'Literasi Indonesia', iconKey: 'material3' },
      { id: 'literasi-inggris', label: 'Literasi Inggris', iconKey: 'material4' },
      { id: 'pengetahuan-kuantitatif', label: 'Pengetahuan Kuantitatif', iconKey: 'material5' },
      { id: 'pemahaman-umum', label: 'Pemahaman Umum', iconKey: 'material6' },
    ],
  },
  kedinasan: {
    title: 'Kedinasan',
    items: [
      { id: 'twk', label: 'TWK', iconKey: 'material1' },
      { id: 'tiu', label: 'TIU', iconKey: 'material2' },
      { id: 'tkp', label: 'TKP', iconKey: 'material3' },
      { id: 'skb', label: 'SKB', iconKey: 'material4' },
      { id: 'psikotes', label: 'Psikotes', iconKey: 'material5' },
      { id: 'wawancara', label: 'Wawancara', iconKey: 'material6' },
    ],
  },
  smp: {
    title: 'SMP',
    items: [
      { id: 'matematika-smp', label: 'Matematika', iconKey: 'material1' },
      { id: 'ipa-terpadu', label: 'IPA Terpadu', iconKey: 'material2' },
      { id: 'bahasa-indonesia-smp', label: 'Bahasa Indonesia', iconKey: 'material3' },
      { id: 'bahasa-inggris-smp', label: 'Bahasa Inggris', iconKey: 'material4' },
      { id: 'ips', label: 'IPS', iconKey: 'material5' },
      { id: 'ppkn', label: 'PPKn', iconKey: 'material6' },
      { id: 'tik', label: 'TIK', iconKey: 'material7' },
    ],
  },
  'mandiri-univ': {
    title: 'Mandiri Univ',
    items: [
      { id: 'tpa-numerik', label: 'TPA Numerik', iconKey: 'material1' },
      { id: 'tpa-verbal', label: 'TPA Verbal', iconKey: 'material2' },
      { id: 'tes-saintek', label: 'Tes Saintek', iconKey: 'material3' },
      { id: 'tes-soshum', label: 'Tes Soshum', iconKey: 'material4' },
      { id: 'bahasa-indonesia-ptn', label: 'Bahasa Indonesia', iconKey: 'material5' },
      { id: 'bahasa-inggris-ptn', label: 'Bahasa Inggris', iconKey: 'material6' },
      { id: 'potensi-akademik', label: 'Potensi Akademik', iconKey: 'material7' },
    ],
  },
};

const fallbackCollection = (categoryId: string, categoryTitle: string): CategoryCollection => {
  const normalized = normalizeSubjectId(categoryId);

  return {
    title: categoryTitle,
    items: Array.from({ length: 6 }).map((_, index) => ({
      id: `${normalized}-${index + 1}`,
      label: `${categoryTitle} ${index + 1}`,
      iconKey: iconKeySequence[index % iconKeySequence.length],
    })),
  };
};

export const getCategoryCollection = (categoryId: string, categoryTitle: string): CategoryCollection => {
  const normalizedId = normalizeSubjectId(categoryId);

  if (baseCollections[normalizedId]) {
    return baseCollections[normalizedId];
  }

  return fallbackCollection(normalizedId, categoryTitle);
};

export type CategoryModule = LearningModule;

const fallbackModules = (subjectId: string, subjectTitle: string): CategoryModule[] =>
  Array.from({ length: 6 }).map((_, index) => ({
    id: `${subjectId}-modul-${index + 1}`,
    title: `${subjectTitle} Modul ${index + 1}`,
  }));

export const getCategoryModules = (subjectId: string, subjectTitle: string): CategoryModule[] => {
  const normalizedId = normalizeSubjectId(subjectId);
  const modules = findLearningModules(subjectId);

  if (modules) {
    return modules;
  }

  return fallbackModules(normalizedId, subjectTitle);
};

export type IconComponentType = (typeof iconComponents)[CategoryIconKey];

export const getIconComponent = (iconKey: CategoryIconKey): FC<SvgProps> =>
  getLearningIconComponent(iconKey);

export type DigidawQuestionOption = {
  id: string;
  label: string;
  text: string;
};

export type DigidawQuestion = {
  id: string;
  number: number;
  prompt: string;
  options: DigidawQuestionOption[];
  correctOptionId: string;
  hint: string;
  explanation: string;
};

type QuestionSeed = {
  prompt: string;
  options: Array<{
    label: string;
    text: string;
    isCorrect?: boolean;
  }>;
  hint: string;
  explanation: string;
};

const optionLabels = ['A', 'B', 'C', 'D', 'E'] as const;

const moduleQuestionSeeds: Record<string, QuestionSeed[]> = {
  'eksponen-akar': [
    {
      prompt:
        'Jika \(x^{2/3} = 27\), tentukan nilai \(x\).',
      options: [
        { label: 'A', text: '9' },
        { label: 'B', text: '27' },
        { label: 'C', text: '81', isCorrect: true },
        { label: 'D', text: '243' },
        { label: 'E', text: '729' },
      ],
      hint: 'Ingat sifat pangkat pecahan \(a^{m/n} = \sqrt[n]{a^m}\).',
      explanation:
        'Persamaan \(x^{2/3} = 27\) dapat ditulis sebagai \((\sqrt[3]{x})^2 = 27\). Ambil akar kuadrat sehingga \(\sqrt[3]{x} = \sqrt{27} = 3\sqrt{3}\) dan kubuskan kembali: \(x = (3\sqrt{3})^3 = 81\).',
    },
    {
      prompt:
        'Sederhanakan bentuk \(5^{3/2}\).',
      options: [
        { label: 'A', text: '5\sqrt{5}', isCorrect: true },
        { label: 'B', text: '5\sqrt{3}' },
        { label: 'C', text: '\\sqrt{25}' },
        { label: 'D', text: '15' },
        { label: 'E', text: '25\sqrt{5}' },
      ],
      hint: 'Pangkat pecahan \(a^{m/n}\) dapat ditulis sebagai \(\sqrt[n]{a^m}\).',
      explanation:
        'Karena \(5^{3/2} = \sqrt{5^3} = \sqrt{125} = 5\sqrt{5}\).',
    },
    {
      prompt:
        'Jika \(\sqrt[4]{16^{3x}} = 8\), tentukan nilai \(x\).',
      options: [
        { label: 'A', text: '1/2' },
        { label: 'B', text: '3/4' },
        { label: 'C', text: '1', isCorrect: true },
        { label: 'D', text: '3/2' },
        { label: 'E', text: '2' },
      ],
      hint: 'Ubah ke bentuk pangkat yang sama sebelum menyamakan eksponen.',
      explanation:
        'Karena \(16 = 2^4\), maka \(16^{3x} = (2^4)^{3x} = 2^{12x}\). Bentuk kiri menjadi \(\sqrt[4]{2^{12x}} = 2^{3x}\). Karena hasilnya 8 = 2^3, maka 3x = 3 dan x = 1.',
    },
  ],
  'trigonometri-10': [
    {
      prompt: 'Jika sin A = 3/5 dan sudut A di kuadran I, tentukan cos A.',
      options: [
        { label: 'A', text: '4/5', isCorrect: true },
        { label: 'B', text: '3/5' },
        { label: 'C', text: '5/3' },
        { label: 'D', text: '5/4' },
        { label: 'E', text: '16/25' },
      ],
      hint: 'Gunakan identitas sin^2 A + cos^2 A = 1.',
      explanation: 'cos A = \(\sqrt{1 - (3/5)^2}\) = 4/5 karena kuadran I bernilai positif.',
    },
    {
      prompt: 'Tentukan nilai tan 45° + tan 30°.',
      options: [
        { label: 'A', text: '1 + \sqrt{3}/3', isCorrect: true },
        { label: 'B', text: '1 + \sqrt{3}' },
        { label: 'C', text: '1 - \sqrt{3}/3' },
        { label: 'D', text: '1' },
        { label: 'E', text: '\\sqrt{3}' },
      ],
      hint: 'Gunakan nilai khusus tan pada sudut istimewa.',
      explanation: 'tan 45° = 1 dan tan 30° = \(\sqrt{3}/3\), sehingga hasilnya 1 + \(\sqrt{3}/3\).',
    },
  ],
  'fungsi-kuadrat': [
    {
      prompt: 'Diberikan fungsi f(x) = x^2 - 4x + 3, tentukan titik puncaknya.',
      options: [
        { label: 'A', text: '(1, -1)' },
        { label: 'B', text: '(2, -1)', isCorrect: true },
        { label: 'C', text: '(2, 1)' },
        { label: 'D', text: '(3, -2)' },
        { label: 'E', text: '(4, 3)' },
      ],
      hint: 'Gunakan rumus puncak parabola ( -b/2a , f(-b/2a) ).',
      explanation: 'x = -(-4)/(2·1) = 2. Substitusi menghasilkan f(2) = -1, jadi titik puncak (2, -1).',
    },
  ],
};

const buildFallbackSeeds = (moduleId: string, moduleTitle: string, total = 5): QuestionSeed[] => {
  return Array.from({ length: total }).map((_, index) => {
    const correctIndex = index % optionLabels.length;

    return {
      prompt: `Soal ${index + 1} tentang ${moduleTitle}: pilih jawaban yang paling tepat.`,
      options: optionLabels.map((label, labelIndex) => ({
        label,
        text: `${moduleTitle} opsi ${label}`,
        isCorrect: labelIndex === correctIndex,
      })),
      hint: `Ingat kembali konsep utama ${moduleTitle} sebelum menjawab.`,
      explanation: `Pembahasan ${moduleTitle} #${index + 1}: opsi ${optionLabels[correctIndex]} merupakan pilihan benar sesuai konsep pokok.`,
    };
  });
};

const normalizeModuleId = (moduleId: string) => moduleId.toLowerCase();

export const getModuleQuestions = (moduleId: string, moduleTitle: string): DigidawQuestion[] => {
  const normalizedId = normalizeModuleId(moduleId);
  const seeds = moduleQuestionSeeds[normalizedId] ?? buildFallbackSeeds(normalizedId, moduleTitle);

  return seeds.map((seed, index) => {
    const options = seed.options.map((option) => ({
      id: `${normalizedId}-q${index + 1}-${option.label.toLowerCase()}`,
      label: option.label,
      text: option.text,
    }));

    const explicitCorrect = seed.options.find((option) => option.isCorrect)?.label ?? optionLabels[0];
    const correctIndex = options.findIndex((option) => option.label === explicitCorrect);
    const correctOptionId = options[Math.max(correctIndex, 0)].id;

    return {
      id: `${normalizedId}-question-${index + 1}`,
      number: index + 1,
      prompt: seed.prompt,
      options,
      correctOptionId,
      hint: seed.hint,
      explanation: seed.explanation,
    };
  });
};
