import type { ImageSourcePropType } from 'react-native';

export type TryoutQuestionOption = {
  id: string;
  label: string;
  text?: string;
};

export type TryoutQuestion = {
  id: string;
  number: number;
  subject: string;
  prompt: string;
  options: TryoutQuestionOption[];
  image?: ImageSourcePropType;
};

type RawQuestionOption = {
  id: string;
  label: string;
  text?: string;
};

type RawQuestion = {
  id?: string;
  number?: number;
  prompt: string;
  options?: RawQuestionOption[];
  image?: ImageSourcePropType;
};

type TryoutQuestionEntry = {
  subject?: string;
  questions: RawQuestion[];
};

type TryoutQuestionBank = Record<string, Record<string, TryoutQuestionEntry>>;

const defaultOptions: RawQuestionOption[] = [
  { id: 'opt-a', label: 'A', text: 'Pilihan A' },
  { id: 'opt-b', label: 'B', text: 'Pilihan B' },
  { id: 'opt-c', label: 'C', text: 'Pilihan C' },
  { id: 'opt-d', label: 'D', text: 'Pilihan D' },
  { id: 'opt-e', label: 'E', text: 'Pilihan E' },
];

const defaultSeeds: Record<
  string,
  {
    prompt: string;
    options?: RawQuestionOption[];
    count?: number;
  }
> = {
  math: {
    prompt: 'Diketahui sebuah persegi memiliki luas 256 cm². Tentukan keliling persegi tersebut.',
  },
  literasi: {
    prompt:
      'Bacalah paragraf singkat tentang perubahan iklim berikut lalu tentukan ide pokok paragraf tersebut.',
    options: [
      { id: 'opt-a', label: 'A', text: 'Dampak perubahan iklim terhadap cuaca ekstrem.' },
      { id: 'opt-b', label: 'B', text: 'Peran manusia dalam mitigasi perubahan iklim.' },
      { id: 'opt-c', label: 'C', text: 'Pengaruh perubahan iklim terhadap kesehatan.' },
      { id: 'opt-d', label: 'D', text: 'Perubahan iklim dan transportasi publik.' },
      { id: 'opt-e', label: 'E', text: 'Kemajuan teknologi energi terbarukan.' },
    ],
  },
  science: {
    prompt: 'Sebuah benda bermassa 2 kg ditarik dengan gaya konstan 10 N. Tentukan percepatan benda tersebut.',
  },
  penalaran: {
    prompt: 'Jika pola bilangan 2, 6, 12, 20, ... berlanjut, berapakah suku ke-6 dari pola tersebut?',
  },
  kognitif: {
    prompt: 'Seseorang membeli barang seharga Rp150.000 dengan diskon 20%. Berapa harga yang harus dibayar?',
  },
  numerasi: {
    prompt: 'Dalam sebuah kelas terdapat 28 siswa. Jika 3/4 dari siswa menyukai matematika, berapa banyak siswa yang menyukainya?',
    options: [
      { id: 'opt-a', label: 'A', text: '18 siswa' },
      { id: 'opt-b', label: 'B', text: '20 siswa' },
      { id: 'opt-c', label: 'C', text: '21 siswa' },
      { id: 'opt-d', label: 'D', text: '24 siswa' },
      { id: 'opt-e', label: 'E', text: '26 siswa' },
    ],
  },
};

const tryoutQuestionBank: TryoutQuestionBank = {
  'to-tka-smp-5': {
    math: {
      questions: [
        {
          prompt: 'Hasil dari 3/4 × 2/5 adalah ...',
          options: [
            { id: 'opt-a', label: 'A', text: '3/10' },
            { id: 'opt-b', label: 'B', text: '6/20' },
            { id: 'opt-c', label: 'C', text: '6/9' },
            { id: 'opt-d', label: 'D', text: '15/8' },
            { id: 'opt-e', label: 'E', text: '9/20' },
          ],
        },
        {
          prompt: 'Nilai x pada persamaan 2x + 6 = 18 adalah ...',
        },
      ],
    },
    literasi: {
      questions: [
        {
          prompt:
            'Cermati paragraf berikut: "Ketergantungan pada plastik sekali pakai semakin meningkat..." Apa gagasan utama paragraf tersebut?',
        },
        {
          prompt: 'Apa sinonim yang tepat untuk kata "spektakuler" dalam kalimat "Pertunjukan itu benar-benar spektakuler"?',
        },
      ],
    },
  },
  'to-tka-sma-6': {
    math: {
      questions: [
        {
          prompt: 'Jika f(x) = 2x^2 - 3x + 5, berapakah f(3)?',
        },
        {
          prompt: 'Sebuah limas memiliki alas berbentuk persegi dengan sisi 6 cm dan tinggi 8 cm. Hitung volumenya.',
        },
      ],
    },
    science: {
      questions: [
        {
          prompt: 'Gelombang bunyi dengan frekuensi 1.000 Hz merambat dalam udara dengan cepat rambat 340 m/s. Panjang gelombangnya adalah ...',
        },
        {
          prompt: 'Sebutkan urutan planet dalam tata surya dari yang terdekat dengan matahari.',
        },
      ],
    },
  },
  'to-snbt-2': {
    penalaran: {
      questions: [
        {
          prompt: 'Jika setiap segitiga pada pola menambah 2 sisi baru, berapa banyak sisi pada iterasi ke-4?',
        },
        {
          prompt: 'Lengkapi pola angka berikut: 5, 8, 13, 20, ...',
        },
      ],
    },
    kognitif: {
      questions: [
        {
          prompt: 'Jika kamu menabung Rp2.000.000 dengan bunga sederhana 6% per tahun, berapa total tabungan setelah 3 tahun?',
        },
        {
          prompt: 'Seorang siswa membaca buku 45 halaman per hari. Berapa hari yang dibutuhkan untuk menyelesaikan buku 270 halaman?',
        },
      ],
    },
  },
  'to-11-sma-2': {
    literasi: {
      questions: [
        {
          prompt: 'Sebutkan kalimat utama yang tepat untuk paragraf tentang manfaat membaca bagi remaja.',
        },
        {
          prompt: 'Apa makna kata "imaji" dalam konteks puisi?',
        },
      ],
    },
    numerasi: {
      questions: [
        {
          prompt: 'Sebuah survei menunjukkan 40% siswa menyukai matematika. Jika terdapat 120 siswa, berapa siswa yang menyukai matematika?',
        },
        {
          prompt: 'Dari sebuah diagram lingkaran, sektor A mewakili 20% dari keseluruhan data. Jika total data 250, tentukan nilai sektor A.',
        },
      ],
    },
  },
};

const buildQuestionFromSeed = (
  subtestId: string,
  subjectTitle: string,
  seedPrompt: string,
  optionsSource: RawQuestionOption[],
  total: number
): TryoutQuestion[] => {
  return Array.from({ length: total }).map((_, index) => {
    const sequence = index + 1;
    const questionId = `${subtestId}-${sequence}`;
    return {
      id: questionId,
      number: sequence,
      subject: subjectTitle,
      prompt: index === 0 ? seedPrompt : `${seedPrompt} - variasi ${sequence}`,
        options: optionsSource.map((option, optionIndex) => {
          const optionKey = option.id || `opt-${optionIndex + 1}`;
          return {
            ...option,
            id: `${optionKey}-${questionId}-${optionIndex + 1}`,
          };
        }),
    };
  });
};

const normalizeRawQuestions = (
  rawQuestions: RawQuestion[] | undefined,
  subtestId: string,
  subjectTitle: string
): TryoutQuestion[] => {
  if (!rawQuestions || rawQuestions.length === 0) {
    return [];
  }

  return rawQuestions.map((rawQuestion, index) => {
    const sequence = rawQuestion.number ?? index + 1;
    const questionId = rawQuestion.id ?? `${subtestId}-${sequence}`;
    const optionsSource = rawQuestion.options ?? defaultOptions;

    return {
      id: questionId,
      number: sequence,
      subject: subjectTitle,
      prompt: rawQuestion.prompt,
      image: rawQuestion.image,
        options: optionsSource.map((option, optionIndex) => {
          const optionKey = option.id || `opt-${optionIndex + 1}`;
          return {
            ...option,
            id: `${optionKey}-${questionId}-${optionIndex + 1}`,
          };
        }),
    };
  });
};

export const getTryoutQuestions = (
  tryoutId: string,
  subtestId: string,
  subjectTitle: string
): TryoutQuestion[] => {
  const entry = tryoutQuestionBank[tryoutId]?.[subtestId];

  if (entry) {
    const normalizedSubject = entry.subject ?? subjectTitle;
    const normalizedQuestions = normalizeRawQuestions(entry.questions, subtestId, normalizedSubject);
    if (normalizedQuestions.length > 0) {
      return normalizedQuestions;
    }
  }

  const seed = defaultSeeds[subtestId] ?? {
    prompt: 'Pilih jawaban terbaik berdasarkan informasi yang diberikan pada soal berikut.',
  };
  const optionsSource = seed.options ?? defaultOptions;
  const total = seed.count ?? 20;

  return buildQuestionFromSeed(subtestId, subjectTitle, seed.prompt, optionsSource, total);
};
