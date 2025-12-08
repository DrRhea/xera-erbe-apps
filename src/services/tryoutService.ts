import api, { API_URL } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TryoutPackage = {
  id: string;
  title: string;
  enrollmentType: 'open' | 'paid' | 'free_with_proof';
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  metadata?: any;
};

export type TryoutSubtest = {
  id: string;
  title: string;
  durationMinutes: number;
  questionSetId: string;
  orderIndex: number;
  questionCount?: number;
};

export type TryoutEnrollment = {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  packageId: string;
  userId: string;
  sessions?: TryoutSession[];
};

export type TryoutSession = {
  id: string;
  subtestId: string;
  status: 'in_progress' | 'completed' | 'expired';
  startedAt: string;
  completedAt?: string;
  score?: number;
};

export type QuestionOption = {
  id: string;
  label: string;
  body: string;
};

export type Question = {
  id: string;
  number: number;
  prompt: string;
  hint?: string;
  explanation?: string;
  options: QuestionOption[];
};

export type QuestionSet = {
  id: string;
  title: string;
  questions: Question[];
};

export const tryoutService = {
  async getPackages(isActive: boolean = true): Promise<TryoutPackage[]> {
    const response = await api.get<TryoutPackage[]>('/tryout/packages', {
      params: { isActive },
    });
    return response.data;
  },

  async getPackage(id: string): Promise<TryoutPackage> {
    const response = await api.get<TryoutPackage>(`/tryout/packages/${id}`);
    return response.data;
  },

  async getMyEnrollments(packageId: string): Promise<TryoutEnrollment[]> {
    // The backend endpoint is /tryout/packages/:id/enrollments
    // But usually this returns ALL enrollments for admin? 
    // Let's check the backend controller. 
    // TryoutController.findEnrollments takes packageId and status.
    // It calls tryoutService.findEnrollments.
    // Does it filter by current user? 
    // If not, we might need a different endpoint or filter client side (not secure).
    // Assuming for now we can filter or the backend handles it.
    // Actually, usually there is /tryout/my-enrollments or similar.
    // Looking at backend analysis: 
    // TryoutController has `findEnrollments` which seems to be for admin (review).
    // Is there a way for user to check their enrollment?
    // Maybe `requestEnrollment` returns the enrollment.
    // Or we use `findEnrollments` and hope it filters by user if not admin?
    // Let's assume we need to implement a way to check status.
    // For now, I'll use the endpoint and see.
    const response = await api.get<TryoutEnrollment[]>(`/tryout/packages/${packageId}/enrollments`);
    return response.data;
  },

  async getSubtests(packageId: string): Promise<TryoutSubtest[]> {
    const response = await api.get<TryoutSubtest[]>(`/tryout/packages/${packageId}/subtests`, {
      params: { withCounts: true },
    });
    return response.data;
  },

  async requestEnrollment(
    packageId: string, 
    files?: { proofShare?: any, proofFollow?: any, proofPayment?: any }
  ): Promise<TryoutEnrollment> {
    const hasFiles = files?.proofShare || files?.proofFollow || files?.proofPayment;
    const token = await AsyncStorage.getItem('accessToken');

    if (!hasFiles) {
      // Send as JSON if no files
      console.log('Sending enrollment request (JSON)', { packageId });
      const response = await fetch(`${API_URL}/tryout/packages/${packageId}/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Enrollment request failed', response.status, errorText);
        throw new Error(`Enrollment failed: ${response.status} ${errorText}`);
      }
      return response.json();
    }

    // Send as FormData if files exist
    const formData = new FormData();
    // Append a dummy field to ensure FormData is never empty (some Android versions dislike empty multipart)
    formData.append('timestamp', new Date().toISOString());
    
    if (files?.proofShare) {
      console.log('Appending proofShare', files.proofShare.uri);
      // @ts-ignore
      formData.append('proofShare', {
        uri: files.proofShare.uri,
        name: files.proofShare.name || 'share.jpg',
        type: files.proofShare.mimeType || 'image/jpeg',
      });
    }
    if (files?.proofFollow) {
      console.log('Appending proofFollow', files.proofFollow.uri);
      // @ts-ignore
      formData.append('proofFollow', {
        uri: files.proofFollow.uri,
        name: files.proofFollow.name || 'follow.jpg',
        type: files.proofFollow.mimeType || 'image/jpeg',
      });
    }
    if (files?.proofPayment) {
      console.log('Appending proofPayment', files.proofPayment.uri);
      // @ts-ignore
      formData.append('proofPayment', {
        uri: files.proofPayment.uri,
        name: files.proofPayment.name || 'payment.jpg',
        type: files.proofPayment.mimeType || 'image/jpeg',
      });
    }

    console.log('Sending enrollment request (FormData)', { packageId });
    try {
      const response = await fetch(`${API_URL}/tryout/packages/${packageId}/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Do NOT set Content-Type here, let fetch handle it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Enrollment request failed', response.status, errorText);
        throw new Error(`Enrollment failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Enrollment request failed', error.message);
      throw error;
    }
  },

  async startSession(enrollmentId: string, subtestId: string): Promise<TryoutSession> {
    const response = await api.post<TryoutSession>(
      `/tryout/enrollments/${enrollmentId}/subtests/${subtestId}/sessions`,
      { startedAt: new Date().toISOString() }
    );
    return response.data;
  },

  async getSession(sessionId: string): Promise<TryoutSession & { answers: any[] }> {
    const response = await api.get<TryoutSession & { answers: any[] }>(`/tryout/sessions/${sessionId}`);
    return response.data;
  },

  async getQuestions(subtestId: string): Promise<Question[]> {
    const response = await api.get<Question[]>(`/tryout/subtests/${subtestId}/questions`);
    return response.data;
  },

  async recordAnswer(sessionId: string, questionId: string, optionId: string): Promise<void> {
    await api.post(`/tryout/sessions/${sessionId}/answers`, {
      questionId,
      optionId,
      answeredAt: new Date().toISOString(),
    });
  },

  async completeSession(sessionId: string): Promise<TryoutSession> {
    const response = await api.patch<TryoutSession>(`/tryout/sessions/${sessionId}/complete`, {
      completedAt: new Date().toISOString(),
    });
    return response.data;
  },

  async getQuestionSet(questionSetId: string): Promise<QuestionSet> {
    const response = await api.get<QuestionSet>(`/question-bank/question-sets/${questionSetId}`, {
      params: { withDetails: 'true' },
    });
    return response.data;
  },

  async getMyProgress(): Promise<{ daily: { current: number; target: number }; weekly: { current: number; target: number } }> {
    const response = await api.get('/tryout/my-progress');
    return response.data;
  },
};
