import DigidawImage from '../../assets/images/digidaw.png';

export type NotificationItem = {
  id: string;
  title: string;
  image: any; // bisa string URI atau require() asset
  buttonText?: string;
  isUnread?: boolean;
  onButtonPress?: () => void;
};

// Mock data removed to ensure we use API data
export const notificationData: NotificationItem[] = [];

export const getNotificationData = () => notificationData;
