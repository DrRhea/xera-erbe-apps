import api from './api';

export interface SnackbtModule {
  id: string;
  title: string;
  summary: string | null;
  metadata: {
    code: string;
    status: string;
    totalQuestions: number;
    orderIndex: number;
  };
}

export interface QuestionOption {
  id: string;
  label: string;
  body: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  prompt: string;
  hint: string;
  explanation: string;
  promptImagePath?: string;
  hintImagePath?: string;
  explanationImagePath?: string;
  options: QuestionOption[];
}

export interface SnackbtSession {
  attemptId: string;
  questions: Question[];
  answers: {
    questionId: string;
    optionId: string;
    isCorrect: boolean;
  }[];
}

export const snackbtService = {
  async getAllModules(): Promise<SnackbtModule[]> {
    const response = await api.get<SnackbtModule[]>('/snackbt');
    return response.data;
  },

  async getModule(moduleId: string): Promise<SnackbtModule> {
    const response = await api.get<SnackbtModule>(`/snackbt/${moduleId}`);
    return response.data;
  },

  async startSession(moduleId: string): Promise<SnackbtSession> {
    const response = await api.post<SnackbtSession>(`/snackbt/${moduleId}/start`);
    return response.data;
  },

  async recordAnswer(attemptId: string, questionId: string, optionId: string): Promise<void> {
    await api.post(`/banksoal/attempts/${attemptId}/answers`, {
      questionId,
      optionId,
      answeredAt: new Date().toISOString(),
    });
  },
};
