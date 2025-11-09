import type { ImageSourcePropType } from 'react-native';

import Avatar1 from '../../assets/images/Ava1.png';
import Avatar2 from '../../assets/images/Ava2.png';
import Avatar3 from '../../assets/images/Ava3.png';
import Avatar4 from '../../assets/images/Ava4.png';
import Avatar5 from '../../assets/images/Ava5.png';
import Avatar6 from '../../assets/images/Ava6.png';
import RedBadgeIcon from '../../assets/icons/redbordersvg.svg';
import OrangeBadgeIcon from '../../assets/icons/orangeborder.svg';
import BlueBadgeIcon from '../../assets/icons/blueborder.svg';

export type LeaderboardEntry = {
  rank: number;
  name: string;
  grade: string;
  score: number;
  avatar: ImageSourcePropType;
  Badge: any | null;
  scoreColor: string;
  isCurrentUser?: boolean;
};

export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Gitaak',
    grade: '9 SMP',
    score: 981,
    avatar: Avatar4,
    Badge: RedBadgeIcon,
    scoreColor: '#EF0F0F',
  },
  {
    rank: 2,
    name: 'Fikri',
    grade: '9 SMP',
    score: 865,
    avatar: Avatar1,
    Badge: OrangeBadgeIcon,
    scoreColor: '#FD7600',
  },
  {
    rank: 3,
    name: 'Aldo',
    grade: '9 SMP',
    score: 812,
    avatar: Avatar3,
    Badge: BlueBadgeIcon,
    scoreColor: '#4169E1',
  },
  {
    rank: 4,
    name: 'Nataa',
    grade: '9 SMP',
    score: 756,
    avatar: Avatar2,
    Badge: null,
    scoreColor: '#00695C',
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: 'Sari',
    grade: '9 SMP',
    score: 698,
    avatar: Avatar5,
    Badge: null,
    scoreColor: '#00695C',
  },
  {
    rank: 6,
    name: 'Budi',
    grade: '9 SMP',
    score: 645,
    avatar: Avatar6,
    Badge: null,
    scoreColor: '#00695C',
  },
];

export const getLeaderboardData = () => leaderboardData;
