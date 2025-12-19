import api from './api';

export type ReportTableRow = {
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
};

export type ReportStats = {
  ranking: number;
  totalQuestions: number;
  score: number;
  acr: number;
  offlineClass: number;
  moshiMoshi: number;
};

export type LatestTryout = {
  id: string;
  title: string;
  dateLabel: string;
  score: number;
  enrollmentStatus: string;
};

export type MonthlyReport = {
  month: number;
  year: number;
  stats: ReportStats;
  table: ReportTableRow[];
  latestTryouts: LatestTryout[];
};

export const reportService = {
  async getMonthlyReport(month?: number, year?: number): Promise<MonthlyReport> {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());
    
    const response = await api.get<MonthlyReport>(`/report/monthly?${params.toString()}`);
    return response.data;
  },
};
