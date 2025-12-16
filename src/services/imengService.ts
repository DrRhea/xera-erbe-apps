import api from './api';

export interface ImengModule {
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

export interface ImengSession {
  attemptId: string;
  questions: Question[];
  answers: {
    questionId: string;
    optionId: string;
    isCorrect: boolean;
  }[];
}

export const imengService = {
  async getAllModules(): Promise<ImengModule[]> {
    const response = await api.get<ImengModule[]>('/imeng');
    return response.data;
  },

  async getModule(moduleId: string): Promise<ImengModule> {
    const response = await api.get<ImengModule>(`/imeng/${moduleId}`);
    return response.data;
  },

  async startSession(moduleId: string): Promise<ImengSession> {
    // Using generic banksoal endpoint as imeng doesn't have a specific one
    const response = await api.post<ImengSession>(`/banksoal/modules/${moduleId}/start`);
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
