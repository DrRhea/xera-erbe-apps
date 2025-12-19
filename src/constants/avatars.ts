import { ImageSourcePropType } from 'react-native';
import { API_URL } from '../services/api';

export const AVATARS: Record<string, any> = {
  'Ava1.png': require('../../assets/images/Ava1.png'),
  'Ava2.png': require('../../assets/images/Ava2.png'),
  'Ava3.png': require('../../assets/images/Ava3.png'),
  'Ava4.png': require('../../assets/images/Ava4.png'),
  'Ava5.png': require('../../assets/images/Ava5.png'),
  'Ava6.png': require('../../assets/images/Ava6.png'),
};

export const AVATAR_KEYS = Object.keys(AVATARS);

export const resolveAvatar = (avatar: ImageSourcePropType | string | null | undefined, defaultAvatar: ImageSourcePropType = AVATARS['Ava1.png']) => {
  if (!avatar) return defaultAvatar;
  if (typeof avatar === 'string') {
    if (AVATARS[avatar]) return AVATARS[avatar];
    if (avatar.startsWith('http')) return { uri: avatar };
    return { uri: `${API_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}` };
  }
  return avatar;
};
