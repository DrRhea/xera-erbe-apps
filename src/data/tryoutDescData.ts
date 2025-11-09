export type TryoutSubSection = {
  title: string;
  description?: string;
  items?: string[];
};

export type TryoutSection = {
  title: string;
  description?: string;
  items?: string[];
  subSections?: TryoutSubSection[];
};

export type TryoutDescription = {
  headerTitle: string;
  subTitle: string;
  sections: TryoutSection[];
};

export const baseSections: TryoutSection[] = [
  {
    title: '1. Struktur dan Durasi Ujian',
    subSections: [
      {
        title: 'a. Sesi Pemanasan',
        items: ['25 soal literasi (20 menit)', 'Pembahasan ringkas setelah sesi berakhir'],
      },
      {
        title: 'b. Sesi Inti',
        items: ['50 soal kemampuan penalaran (45 menit)', 'Skor otomatis tersaji setelah submit'],
      },
      {
        title: 'c. Sesi Akhir',
        items: ['25 soal evaluasi (25 menit)', 'Leaderboard diperbarui otomatis'],
      },
    ],
  },
  {
    title: '2. Ketentuan Umum',
    items: [
      'Gunakan perangkat stabil dan koneksi internet yang baik.',
      'Timer akan berjalan otomatis saat sesi dimulai.',
      'Jawaban dapat ditinjau ulang sebelum mengakhiri sesi.',
    ],
  },
  {
    title: '3. Setelah Try Out',
    items: [
      'Skor akhir dan analisis performa tersedia instan.',
      'Leaderboard dan progress harian diperbarui.',
      'Pembahasan lengkap dapat diakses pada menu Bank Soal.',
    ],
  },
];

export const tryoutDescriptions: Record<string, TryoutDescription> = {
  'to-snbt-3': {
    headerTitle: 'TO SNBT #3',
    subTitle: 'Subtes TO SNBT #3',
    sections: [
      {
        title: '1. TPS Skolastik',
        subSections: [
          {
            title: 'a. PU (Penalaran Umum)',
            items: [
              'Penalaran Induktif 10 soal (10 menit)',
              'Penalaran Deduktif 10 soal (10 menit)',
              'Penalaran Kuantitatif 10 soal (10 menit)',
            ],
          },
          {
            title: 'b. PPU (Pengetahuan dan Pemahaman Umum)',
            items: ['Total 20 soal (15 menit)'],
          },
          {
            title: 'c. PBM (Pemahaman Bacaan dan Menulis)',
            items: ['Total 25 soal (22 menit)'],
          },
          {
            title: 'd. PK (Pengetahuan Kuantitatif)',
            items: ['Total 20 soal (20 menit)'],
          },
        ],
      },
      {
        title: '2. Tes Literasi & Penalaran Matematis',
        subSections: [
          {
            title: 'a. PM (Penalaran Matematika)',
            items: ['Total 20 soal (20 menit)'],
          },
          {
            title: 'b. LBI (Literasi Bahasa Indonesia)',
            items: ['Total 30 soal (20 menit)'],
          },
          {
            title: 'c. LBE (Literasi Bahasa Inggris)',
            items: ['Total 20 soal (20 menit)'],
          },
        ],
      },
    ],
  },
};

export const createGenericDescription = (title: string): TryoutDescription => ({
  headerTitle: title,
  subTitle: `Subtes ${title}`,
  sections: baseSections,
});
