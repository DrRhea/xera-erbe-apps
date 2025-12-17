import api from './api';
import { MateriModule } from '../data/materiContent';

export const getMateriModules = async (subjectId?: string): Promise<MateriModule[]> => {
  const params = subjectId ? { subjectId } : {};
  const response = await api.get<MateriModule[]>('/materi', { params });
  return response.data;
};

export const getMateriModule = async (id: string): Promise<MateriModule> => {
  const response = await api.get<MateriModule>(`/materi/${id}`);
  return response.data;
};
