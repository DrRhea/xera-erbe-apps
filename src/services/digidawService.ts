import api from './api';

export interface DigidawQuestionSetSummary {
  id: string;
  title: string;
  code: string | null;
  type: string;
  questionCount: number;
}

export interface DigidawModule {
  id: string;
  moduleId: string;
  name: string;
  category: string;
  categoryId: string | null;
  subjectId: string | null;
  subjectName: string | null;
  metadata: Record<string, unknown> | null;
  questionSets: DigidawQuestionSetSummary[];
  createdAt: string;
  updatedAt: string;
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
  options: QuestionOption[];
}

export interface QuestionSet {
  id: string;
  title: string;
  questionLinks: {
    question: Question;
  }[];
}

export interface DigidawSession {
  attemptId: string;
  questions: Question[];
  answers: {
    questionId: string;
    optionId: string;
    isCorrect: boolean;
  }[];
}

export interface Category {
  id: string;
  name: string;
  code: string | null;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  iconKey: string | null;
}

export const digidawService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/catalog/categories');
    return response.data;
  },

  async getSubjects(categoryId: string): Promise<Subject[]> {
    const response = await api.get<Subject[]>(`/catalog/categories/${categoryId}/subjects`);
    return response.data;
  },

  async getAllModules(): Promise<DigidawModule[]> {
    const response = await api.get<DigidawModule[]>('/digidaw');
    return response.data;
  },

  async getModule(moduleId: string): Promise<DigidawModule> {
    const response = await api.get<DigidawModule>(`/digidaw/${moduleId}`);
    return response.data;
  },

  async getQuestionSet(questionSetId: string): Promise<QuestionSet> {
    const response = await api.get<QuestionSet>(`/question-bank/question-sets/${questionSetId}?withDetails=true`);
    return response.data;
  },

  async startSession(moduleId: string): Promise<DigidawSession> {
    const response = await api.post<DigidawSession>(`/digidaw/${moduleId}/start`);
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
