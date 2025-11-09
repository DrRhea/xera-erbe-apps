import DigidawImage from '../../assets/images/digidaw.png';

export type NotificationItem = {
  id: string;
  title: string;
  image: any; // bisa string URI atau require() asset
  buttonText?: string;
  isUnread?: boolean;
  onButtonPress?: () => void;
};

export const notificationData: NotificationItem[] = [
  {
    id: '1',
    title: 'Discount 50% TO SNBT November',
    image: 'http://localhost:3845/assets/9734481c6d70331df091d226a8cf907a22a4c0e3.png',
    buttonText: 'Claim',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Selesaikan Progress Harianmu!',
    image: DigidawImage,
    buttonText: "Let's DIGIDAW",
    isUnread: false,
  },
  {
    id: '3',
    title: 'Progress Mingguanmu Selesai!',
    image: DigidawImage,
    isUnread: false,
  },
];

// Getter biar gampang diganti ke API nanti
export const getNotificationData = () => notificationData;
