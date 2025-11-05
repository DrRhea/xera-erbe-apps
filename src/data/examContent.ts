import type { ImageSourcePropType } from 'react-native';

export type ExamId = 'snackbt' | 'poke' | 'imeng';

export type ExamSubjectDefinition = {
  id: string;
  title: string;
};

export type ExamPalette = {
  listIconBackground: string;
  summaryBackground: string;
  questionIndicatorBackground: string;
  questionBodyBackground: string;
  explanationBackground: string;
  optionSelectedBackground: string;
  optionCorrectBackground: string;
  optionIncorrectBackground: string;
  optionLabelDefault: string;
  optionLabelOnEmphasis: string;
  hintButtonBackground: string;
};

export type ExamDefinition = {
  id: ExamId;
  headerTitle: string;
  sectionTitle: string;
  searchPlaceholder: string;
  listIcon: ImageSourcePropType;
  badgeImage: ImageSourcePropType;
  subjects: ExamSubjectDefinition[];
  progression: 'twoStep' | 'singleStep';
  palette?: Partial<ExamPalette>;
};

const snackbtBadge = require('../../assets/images/snackbt.png');
const pokeBadge = require('../../assets/images/poke.png');
const imengBadge = require('../../assets/images/imeng.png');

const snackbtDefinition: ExamDefinition = {
  id: 'snackbt',
  headerTitle: 'SNack-BT',
  sectionTitle: 'Subtes SNBT',
  searchPlaceholder: 'Mau belajar apa nih?',
  listIcon: snackbtBadge,
  badgeImage: snackbtBadge,
  subjects: [
    { id: 'penalaran-umum', title: 'PU (Penalaran Umum)' },
    { id: 'pengetahuan-pemahaman-umum', title: 'PPU (Pengetahuan & Pemahaman Umum)' },
    { id: 'pemahaman-bacaan-menulis', title: 'PBM (Pemahaman Bacaan & Menulis)' },
    { id: 'pengetahuan-kuantitatif', title: 'PK (Pengetahuan Kuantitatif)' },
    { id: 'literasi-indonesia', title: 'LBI (Literasi Bahasa Indonesia)' },
    { id: 'literasi-inggris', title: 'LBE (Literasi Bahasa Inggris)' },
    { id: 'penalaran-matematika', title: 'PM (Penalaran Matematika)' },
  ],
  progression: 'twoStep',
  palette: {
    listIconBackground: '#FFE9C9',
    summaryBackground: '#1C637B',
    questionBodyBackground: '#DDEFF1',
    explanationBackground: '#DDEFF1',
    hintButtonBackground: '#2F8AAE',
  },
};

const pokeDefinition: ExamDefinition = {
  id: 'poke',
  headerTitle: 'PoKe',
  sectionTitle: 'Subtes Kedinasan',
  searchPlaceholder: 'Mau belajar apa nih?',
  listIcon: pokeBadge,
  badgeImage: pokeBadge,
  subjects: [
    { id: 'twk', title: 'TWK (Tes Wawasan Kebangsaan)' },
    { id: 'tiu', title: 'TIU (Tes Intelegensia Umum)' },
    { id: 'tkp', title: 'TKP (Tes Karakteristik Pribadi)' },
    { id: 'skb', title: 'SKB (Seleksi Kompetensi Bidang)' },
    { id: 'psikotes', title: 'Psikotes' },
    { id: 'wawancara', title: 'Wawancara' },
  ],
  progression: 'twoStep',
  palette: {
    listIconBackground: '#D4F5E4',
    summaryBackground: '#1E6753',
    questionBodyBackground: '#D9F3EC',
    explanationBackground: '#D9F3EC',
    hintButtonBackground: '#2BA279',
  },
};

const imengDefinition: ExamDefinition = {
  id: 'imeng',
  headerTitle: 'ImEng',
  sectionTitle: "ImEng's Level",
  searchPlaceholder: 'Mau belajar apa nih?',
  listIcon: imengBadge,
  badgeImage: imengBadge,
  subjects: [
    { id: 'imeng-basic-1', title: 'ImEng Basic-1' },
    { id: 'imeng-basic-2', title: 'ImEng Basic-2' },
    { id: 'imeng-basic-3', title: 'ImEng Basic-3' },
    { id: 'imeng-intermediate-1', title: 'ImEng Intermediate-1' },
    { id: 'imeng-intermediate-2', title: 'ImEng Intermediate-2' },
    { id: 'imeng-intermediate-3', title: 'ImEng Intermediate-3' },
    { id: 'imeng-intermediate-4', title: 'ImEng Intermediate-4' },
  ],
  progression: 'singleStep',
  palette: {
    listIconBackground: '#F8D5E6',
    summaryBackground: '#731C63',
    questionBodyBackground: '#F1D7EE',
    explanationBackground: '#F1D7EE',
    hintButtonBackground: '#A33FB2',
  },
};

const examDefinitions: Record<ExamId, ExamDefinition> = {
  snackbt: snackbtDefinition,
  poke: pokeDefinition,
  imeng: imengDefinition,
};

export const getExamDefinition = (examId: ExamId): ExamDefinition => examDefinitions[examId];

export const examIds = Object.keys(examDefinitions) as ExamId[];
