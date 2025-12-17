import api from './api';
import { MateriModule } from '../data/materiContent';

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

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/catalog/categories');
  return response.data;
};

export const getSubjects = async (categoryId: string): Promise<Subject[]> => {
  const response = await api.get<Subject[]>(`/catalog/categories/${categoryId}/subjects`);
  return response.data;
};

export const getMateriModules = async (subjectId?: string): Promise<MateriModule[]> => {
  const params = subjectId ? { subjectId } : {};
  const response = await api.get<MateriModule[]>('/materi', { params });
  return response.data;
};

export const getMateriModule = async (id: string): Promise<MateriModule> => {
  const response = await api.get<MateriModule>(`/materi/${id}`);
  return response.data;
};
