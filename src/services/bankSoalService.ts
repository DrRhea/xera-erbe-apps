import api from './api';

export type BankSoalProgress = {
  daily: {
    current: number;
    target: number;
  };
  weekly: {
    current: number;
    target: number;
  };
};

export type Category = {
  id: string;
  name: string;
  code: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  iconKey?: string;
};

export type Module = {
  id: string;
  title: string;
  summary?: string;
};

export type QuestionOption = {
  id: string;
  label: string;
  body: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
};

export type PracticeSession = {
  attempt: {
    id: string;
  };
  questions: Question[];
};

export const bankSoalService = {
  async getMyProgress(): Promise<BankSoalProgress> {
    const response = await api.get<BankSoalProgress>('/banksoal/my-progress');
    return response.data;
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/catalog/categories');
    return response.data;
  },

  async getSubjects(categoryId: string): Promise<Subject[]> {
    const response = await api.get<Subject[]>(`/catalog/categories/${categoryId}/subjects`);
    return response.data;
  },

  async getModules(subjectId: string): Promise<Module[]> {
    const response = await api.get<Module[]>(`/catalog/subjects/${subjectId}/modules`);
    return response.data;
  },

  async startModuleSession(moduleId: string): Promise<PracticeSession> {
    const response = await api.post<PracticeSession>(`/banksoal/modules/${moduleId}/start`);
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
