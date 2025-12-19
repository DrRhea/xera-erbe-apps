import HomeIcon from '../../assets/icons/home-2.svg';
import GraphIcon from '../../assets/icons/graph.svg';
import TagIcon from '../../assets/icons/tag.svg';
import UserIcon from '../../assets/icons/user.svg';
import { BottomNavigationItem } from '../components/BottomNavigation';

export const NAV_ITEMS: BottomNavigationItem[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon, routeName: 'Home' },
  { key: 'analysis', label: 'Analysis', Icon: GraphIcon, routeName: 'Report' },
  { key: 'leaderboard', label: 'Leaderboard', Icon: TagIcon, routeName: 'Leaderboard' },
  { key: 'profile', label: 'Profile', Icon: UserIcon, routeName: 'Profile' },
];
