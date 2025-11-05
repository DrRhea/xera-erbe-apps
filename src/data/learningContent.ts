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

export const learningIconComponents = {
  material1: MaterialIcon1,
  material2: MaterialIcon2,
  material3: MaterialIcon3,
  material4: MaterialIcon4,
  material5: MaterialIcon5,
  material6: MaterialIcon6,
  material7: MaterialIcon7,
  vector: VectorIcon,
} as const;

export type LearningIconKey = keyof typeof learningIconComponents;

export const learningIconKeys = Object.keys(learningIconComponents) as LearningIconKey[];

export type LearningModule = {
  id: string;
  title: string;
  summary?: string;
};

export const learningModulesBySubject: Record<string, LearningModule[]> = {
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
  'penalaran-umum': [
    { id: 'analogi-verbal', title: 'Analogi Verbal' },
    { id: 'silogisme', title: 'Silogisme' },
    { id: 'penalaran-analitik', title: 'Penalaran Analitik' },
    { id: 'logika-diagram', title: 'Logika Diagram' },
    { id: 'penalaran-kuantitatif-snbt', title: 'Penalaran Kuantitatif' },
    { id: 'penalaran-mekanika', title: 'Penalaran Mekanika' },
  ],
  'penalaran-matematika': [
    { id: 'persamaan-linear', title: 'Persamaan Linear' },
    { id: 'bangun-ruang', title: 'Bangun Ruang' },
    { id: 'peluang', title: 'Peluang' },
    { id: 'deret-barisan', title: 'Deret & Barisan' },
    { id: 'integral-dasar', title: 'Integral Dasar' },
    { id: 'statistika-snbt', title: 'Statistika' },
  ],
  'literasi-indonesia': [
    { id: 'pemahaman-bacaan', title: 'Pemahaman Bacaan' },
    { id: 'analisis-teks', title: 'Analisis Teks' },
    { id: 'bahasa-baku', title: 'Bahasa Baku' },
    { id: 'kalimat-efektif', title: 'Kalimat Efektif' },
    { id: 'ejaan-puebi', title: 'Ejaan PUEBI' },
    { id: 'interpretasi-grafik', title: 'Interpretasi Grafik' },
  ],
  'literasi-inggris': [
    { id: 'short-passage', title: 'Short Passage' },
    { id: 'skimming-scanning', title: 'Skimming & Scanning' },
    { id: 'vocabulary-context', title: 'Vocabulary in Context' },
    { id: 'grammar-in-use', title: 'Grammar in Use' },
    { id: 'inference-questions', title: 'Inference Questions' },
    { id: 'paraphrasing', title: 'Paraphrasing' },
  ],
  'pengetahuan-kuantitatif': [
    { id: 'aritmetika', title: 'Aritmetika' },
    { id: 'aljabar', title: 'Aljabar' },
    { id: 'geometri', title: 'Geometri' },
    { id: 'data-interpretation', title: 'Data Interpretation' },
    { id: 'persamaan-kuadrat', title: 'Persamaan Kuadrat' },
    { id: 'operasi-matriks', title: 'Operasi Matriks' },
  ],
  'pemahaman-umum': [
    { id: 'wawasan-kebangsaan', title: 'Wawasan Kebangsaan' },
    { id: 'isu-aktual', title: 'Isu Aktual' },
    { id: 'kebijakan-publik', title: 'Kebijakan Publik' },
    { id: 'figur-inspiratif', title: 'Figur Inspiratif' },
    { id: 'gerakan-sosial', title: 'Gerakan Sosial' },
    { id: 'inovasi-teknologi', title: 'Inovasi Teknologi' },
  ],
  twk: [
    { id: 'pancasila', title: 'Pancasila' },
    { id: 'uud-1945', title: 'UUD 1945' },
    { id: 'nkri', title: 'NKRI' },
    { id: 'bhinneka', title: 'Bhinneka Tunggal Ika' },
    { id: 'sejarah-nasional', title: 'Sejarah Nasional' },
    { id: 'wawasan-nusantara', title: 'Wawasan Nusantara' },
  ],
  tiu: [
    { id: 'analogi-kata', title: 'Analogi Kata' },
    { id: 'aritmetika-dasar', title: 'Aritmetika Dasar' },
    { id: 'deret-angka', title: 'Deret Angka' },
    { id: 'figural', title: 'Kemampuan Figural' },
    { id: 'logika-verbal', title: 'Logika Verbal' },
    { id: 'logika-numerik', title: 'Logika Numerik' },
  ],
  tkp: [
    { id: 'pelayanan-publik', title: 'Pelayanan Publik' },
    { id: 'jejaring-kerja', title: 'Jejaring Kerja' },
    { id: 'sosial-budaya', title: 'Sosial Budaya' },
    { id: 'profesionalisme', title: 'Profesionalisme' },
    { id: 'karakter-pribadi', title: 'Karakter Pribadi' },
    { id: 'teknologi-informasi', title: 'Teknologi Informasi' },
  ],
  skb: [
    { id: 'hukum-administrasi', title: 'Hukum Administrasi' },
    { id: 'manajemen-sdm', title: 'Manajemen SDM' },
    { id: 'keuangan-negara', title: 'Keuangan Negara' },
    { id: 'administrasi-publik', title: 'Administrasi Publik' },
    { id: 'pelayanan-prima', title: 'Pelayanan Prima' },
    { id: 'analisis-kebijakan', title: 'Analisis Kebijakan' },
  ],
  psikotes: [
    { id: 'kecermatan', title: 'Kecermatan' },
    { id: 'memori', title: 'Memori' },
    { id: 'kraepelin', title: 'Kraepelin' },
    { id: 'epps', title: 'EPPS' },
    { id: 'wartegg', title: 'WARTEGG' },
    { id: 'disc', title: 'DISC' },
  ],
  wawancara: [
    { id: 'motivasi', title: 'Motivasi' },
    { id: 'komitmen', title: 'Komitmen' },
    { id: 'kompetensi', title: 'Kompetensi' },
    { id: 'integritas', title: 'Integritas' },
    { id: 'pelayanan', title: 'Pelayanan' },
    { id: 'etika', title: 'Etika' },
  ],
  'matematika-smp': [
    { id: 'bilangan-bulat', title: 'Bilangan Bulat' },
    { id: 'pecahan', title: 'Pecahan' },
    { id: 'persamaan-linear-smp', title: 'Persamaan Linear' },
    { id: 'bangun-datar', title: 'Bangun Datar' },
    { id: 'bangun-ruang-smp', title: 'Bangun Ruang' },
    { id: 'statistika-dasar', title: 'Statistika Dasar' },
  ],
  'ipa-terpadu': [
    { id: 'tata-surya', title: 'Sistem Tata Surya' },
    { id: 'energi', title: 'Energi & Perubahannya' },
    { id: 'zat-wujud', title: 'Zat dan Wujudnya' },
    { id: 'gaya-gerak', title: 'Gaya dan Gerak' },
    { id: 'sistem-organ', title: 'Sistem Organ Tubuh' },
    { id: 'ekosistem-smp', title: 'Ekosistem' },
  ],
  'bahasa-indonesia-smp': [
    { id: 'teks-narasi', title: 'Teks Narasi' },
    { id: 'teks-eksposisi', title: 'Teks Eksposisi' },
    { id: 'teks-deskripsi', title: 'Teks Deskripsi' },
    { id: 'kalimat-efektif-smp', title: 'Kalimat Efektif' },
    { id: 'menyunting-teks', title: 'Menyunting Teks' },
    { id: 'kaidah-kebahasaan', title: 'Kaidah Kebahasaan' },
  ],
  'bahasa-inggris-smp': [
    { id: 'greetings', title: 'Greeting & Introduction' },
    { id: 'descriptive-text', title: 'Descriptive Text' },
    { id: 'procedure-text', title: 'Procedure Text' },
    { id: 'narrative-text', title: 'Narrative Text' },
    { id: 'grammar-basic', title: 'Grammar Basic' },
    { id: 'vocabulary-practice', title: 'Vocabulary Practice' },
  ],
  ips: [
    { id: 'sejarah-penjajahan', title: 'Sejarah Penjajahan' },
    { id: 'kegiatan-ekonomi', title: 'Kegiatan Ekonomi' },
    { id: 'interaksi-sosial', title: 'Interaksi Sosial' },
    { id: 'geografi-indonesia', title: 'Geografi Indonesia' },
    { id: 'pemerintahan', title: 'Pemerintahan' },
    { id: 'globalisasi', title: 'Globalisasi' },
  ],
  ppkn: [
    { id: 'pancasila-smp', title: 'Pancasila' },
    { id: 'hak-kewajiban', title: 'Hak & Kewajiban' },
    { id: 'norma', title: 'Norma' },
    { id: 'uud-1945-smp', title: 'UUD 1945' },
    { id: 'otonomi-daerah', title: 'Otonomi Daerah' },
    { id: 'keberagaman', title: 'Keberagaman' },
  ],
  tik: [
    { id: 'hardware', title: 'Pengenalan Hardware' },
    { id: 'software', title: 'Software Aplikasi' },
    { id: 'internet-keamanan', title: 'Internet & Keamanan' },
    { id: 'pengolah-kata', title: 'Pengolah Kata' },
    { id: 'pengolah-angka', title: 'Pengolah Angka' },
    { id: 'desain-sederhana', title: 'Desain Sederhana' },
  ],
  'tpa-numerik': [
    { id: 'deret-angka-tpa', title: 'Deret Angka' },
    { id: 'matematika-dasar-tpa', title: 'Matematika Dasar' },
    { id: 'logika-numerik-tpa', title: 'Logika Numerik' },
    { id: 'perbandingan', title: 'Perbandingan' },
    { id: 'aritmetika-sosial', title: 'Aritmetika Sosial' },
    { id: 'geometri-dasar', title: 'Geometri Dasar' },
  ],
  'tpa-verbal': [
    { id: 'sinonim-antonim', title: 'Sinonim & Antonim' },
    { id: 'analogi-kata-tpa', title: 'Analogi Kata' },
    { id: 'padanan-kata', title: 'Padanan Kata' },
    { id: 'pemahaman-bacaan-tpa', title: 'Pemahaman Bacaan' },
    { id: 'penalaran-verbal', title: 'Penalaran Verbal' },
    { id: 'kata-baku', title: 'Kata Baku' },
  ],
  'tes-saintek': [
    { id: 'matematika-ipa', title: 'Matematika IPA' },
    { id: 'fisika-dasar', title: 'Fisika Dasar' },
    { id: 'kimia-dasar', title: 'Kimia Dasar' },
    { id: 'biologi-dasar', title: 'Biologi Dasar' },
    { id: 'statistika-saintek', title: 'Statistika' },
    { id: 'logika-saintek', title: 'Logika Saintek' },
  ],
  'tes-soshum': [
    { id: 'sejarah-indonesia', title: 'Sejarah Indonesia' },
    { id: 'ekonomi-dasar', title: 'Ekonomi Dasar' },
    { id: 'sosiologi-dasar', title: 'Sosiologi Dasar' },
    { id: 'geografi-dasar', title: 'Geografi Dasar' },
    { id: 'antropologi', title: 'Antropologi' },
    { id: 'logika-sosial', title: 'Logika Sosial' },
  ],
  'bahasa-indonesia-ptn': [
    { id: 'pemahaman-teks', title: 'Pemahaman Teks' },
    { id: 'struktur-kalimat', title: 'Struktur Kalimat' },
    { id: 'ejaan-tanda-baca', title: 'Ejaan & Tanda Baca' },
    { id: 'ringkasan-teks', title: 'Ringkasan Teks' },
    { id: 'kaidah-bahasa', title: 'Kaidah Bahasa' },
    { id: 'penalaran-bahasa', title: 'Penalaran Bahasa' },
  ],
  'bahasa-inggris-ptn': [
    { id: 'reading-passage', title: 'Reading Passage' },
    { id: 'structure-written', title: 'Structure & Written Expression' },
    { id: 'vocabulary-advanced', title: 'Vocabulary Advanced' },
    { id: 'error-recognition', title: 'Error Recognition' },
    { id: 'listening-ptn', title: 'Listening Practice' },
    { id: 'conversation-skill', title: 'Conversation Skill' },
  ],
  'potensi-akademik': [
    { id: 'figural-test', title: 'Figural Test' },
    { id: 'numerik-test', title: 'Numerik Test' },
    { id: 'verbal-test', title: 'Verbal Test' },
    { id: 'logika-induktif', title: 'Logika Induktif' },
    { id: 'kuantitatif-dasar', title: 'Kuantitatif Dasar' },
    { id: 'analisis-data', title: 'Analisis Data' },
  ],
};

export const normalizeSubjectId = (value: string) => value.toLowerCase();

export const findLearningModules = (subjectId: string): LearningModule[] | undefined => {
  const normalizedId = normalizeSubjectId(subjectId);
  return learningModulesBySubject[normalizedId];
};

export const getLearningIconComponent = (iconKey: LearningIconKey): FC<SvgProps> =>
  learningIconComponents[iconKey];
