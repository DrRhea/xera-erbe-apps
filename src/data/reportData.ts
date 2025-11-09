export type ReportTableRow = {
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
};

export const sampleReportData: ReportTableRow[] = [
  {
    subject: 'Penalaran Matematika',
    score: 47,
    totalQuestions: 116,
    percentage: 85.5,
  },
  {
    subject: 'Literasi Bahasa Indonesia',
    score: 72,
    totalQuestions: 185,
    percentage: 65.9,
  },
  {
    subject: 'Literasi Bahasa Inggris',
    score: 60,
    totalQuestions: 120,
    percentage: 50.0,
  },
  {
    subject: 'Bahasa Inggris',
    score: 55,
    totalQuestions: 115,
    percentage: 30.8,
  },
];
