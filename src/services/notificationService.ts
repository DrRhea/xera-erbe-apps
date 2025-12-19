import api from './api';

export type Notification = {
  id: string;
  title: string;
  body: string;
  imagePath?: string;
  ctaLabel?: string;
  ctaPayload?: any;
  isRead: boolean;
  createdAt: string;
};

export const notificationService = {
  async getNotifications(userId?: string): Promise<Notification[]> {
    const params: any = {};
    if (userId) params.userId = userId;
    
    const response = await api.get<Notification[]>('/content/notifications', { params });
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/content/notifications/${id}/read`, { isRead: true });
  },
  
  async getUnreadCount(userId?: string): Promise<number> {
      const params: any = { isRead: false };
      if (userId) params.userId = userId;
      const response = await api.get<Notification[]>('/content/notifications', { params });
      return response.data.length;
  }
};
