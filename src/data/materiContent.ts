import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import MaterialIcon1 from '../../assets/icons/material1.svg';
import MaterialIcon2 from '../../assets/icons/material2.svg';
import MaterialIcon3 from '../../assets/icons/material3.svg';
import MaterialIcon4 from '../../assets/icons/material4.svg';
import MaterialIcon5 from '../../assets/icons/material5.svg';
import MaterialIcon6 from '../../assets/icons/material6.svg';
import MaterialIcon7 from '../../assets/icons/material7.svg';
import VectorIcon from '../../assets/icons/vector.svg';

export const materiIconComponents = {
  material1: MaterialIcon1,
  material2: MaterialIcon2,
  material3: MaterialIcon3,
  material4: MaterialIcon4,
  material5: MaterialIcon5,
  material6: MaterialIcon6,
  material7: MaterialIcon7,
  vector: VectorIcon,
} as const;

export type MateriIconKey = keyof typeof materiIconComponents;

export type MateriModule = {
  id: string;
  title: string;
  summary?: string;
};

const materiModulesBySubject: Record<string, MateriModule[]> = {
  matematika: [
    { id: 'eksponen-akar', title: 'Eksponen Akar' },
    { id: 'trigonometri-10', title: 'Trigonometri 10 SMA' },
    { id: 'fungsi-kuadrat', title: 'Fungsi Kuadrat' },
    { id: 'persamaan-lingkaran', title: 'Persamaan Lingkaran' },
    { id: 'fungsi-komposisi-invers', title: 'Fungsi Komp & Invers' },
    { id: 'transformasi-geo', title: 'Transformasi Geo' },
    { id: 'statistika-10', title: 'Statistika 10 SMA' },
  ],
  kimia: [
    { id: 'stoikiometri', title: 'Stoikiometri' },
    { id: 'asam-basa', title: 'Asam Basa' },
    { id: 'larutan-elektrolit', title: 'Larutan Elektrolit' },
    { id: 'termokimia', title: 'Termokimia' },
    { id: 'reaksi-redoks', title: 'Reaksi Redoks' },
    { id: 'kinetika-kimia', title: 'Kinetika Kimia' },
  ],
  fisika: [
    { id: 'kinematika', title: 'Kinematika' },
    { id: 'dinamika', title: 'Dinamika' },
    { id: 'gelombang', title: 'Gelombang' },
    { id: 'listrik-dinamis', title: 'Listrik Dinamis' },
    { id: 'optika', title: 'Optika Geometri' },
    { id: 'termodinamika', title: 'Termodinamika' },
  ],
  biologi: [
    { id: 'sel-dan-jaringan', title: 'Sel dan Jaringan' },
    { id: 'sistem-organ', title: 'Sistem Organ' },
    { id: 'genetika', title: 'Genetika' },
    { id: 'ekosistem', title: 'Ekosistem' },
    { id: 'evolusi', title: 'Evolusi' },
    { id: 'bioteknologi', title: 'Bioteknologi' },
  ],
  ekonomi: [
    { id: 'permintaan-penawaran', title: 'Permintaan & Penawaran' },
    { id: 'uang-perbankan', title: 'Uang & Perbankan' },
    { id: 'akuntansi-dasar', title: 'Akuntansi Dasar' },
    { id: 'kebijakan-fiskal', title: 'Kebijakan Fiskal' },
    { id: 'mikroekonomi', title: 'Mikroekonomi' },
    { id: 'makroekonomi', title: 'Makroekonomi' },
  ],
  geografi: [
    { id: 'peta-sig', title: 'Peta & SIG' },
    { id: 'litosfer', title: 'Dinamika Litosfer' },
    { id: 'atmosfer-hidrosfer', title: 'Atmosfer & Hidrosfer' },
    { id: 'interaksi-ruang', title: 'Interaksi Antarruang' },
    { id: 'mitigasi-bencana', title: 'Mitigasi Bencana' },
    { id: 'sumber-daya-alam', title: 'Sumber Daya Alam' },
  ],
  sosiologi: [
    { id: 'nilai-norma', title: 'Nilai & Norma' },
    { id: 'kelompok-sosial', title: 'Kelompok Sosial' },
    { id: 'sosialisasi', title: 'Sosialisasi' },
    { id: 'perubahan-sosial', title: 'Perubahan Sosial' },
    { id: 'stratifikasi', title: 'Stratifikasi' },
    { id: 'konflik-sosial', title: 'Konflik Sosial' },
  ],
  'bahasa-inggris': [
    { id: 'reading-comprehension', title: 'Reading Comprehension' },
    { id: 'grammar-usage', title: 'Grammar Usage' },
    { id: 'vocabulary-building', title: 'Vocabulary Building' },
    { id: 'listening-practice', title: 'Listening Practice' },
    { id: 'writing-task', title: 'Writing Task' },
    { id: 'expression-idioms', title: 'Expression & Idioms' },
  ],
};

const fallbackModules = (subjectId: string, subjectTitle: string): MateriModule[] =>
  Array.from({ length: 6 }).map((_, index) => ({
    id: `${subjectId}-materi-${index + 1}`,
    title: `${subjectTitle} Materi ${index + 1}`,
  }));

const normalizeId = (value: string) => value.toLowerCase();

export const getMateriModules = (subjectId: string, subjectTitle: string): MateriModule[] => {
  const normalizedId = normalizeId(subjectId);
  if (materiModulesBySubject[normalizedId]) {
    return materiModulesBySubject[normalizedId];
  }
  return fallbackModules(normalizedId, subjectTitle);
};

export const getMateriIconComponent = (iconKey: MateriIconKey): FC<SvgProps> =>
  materiIconComponents[iconKey];
