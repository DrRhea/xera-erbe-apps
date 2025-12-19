import api from './api';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  totalScore: string;
  averageAccuracy: string;
  totalTryouts: number;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarPath: string | null;
    grade: string | null;
    badgeLabel: string | null;
  };
  rank?: number;
}

export interface LeaderboardSummary {
  leaderboard: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

export const getLeaderboardSummary = async (limit = 10): Promise<LeaderboardSummary> => {
  const response = await api.get<LeaderboardSummary>('/leaderboard/summary', { params: { limit } });
  return response.data;
};
