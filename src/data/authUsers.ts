import type { ImageSourcePropType } from 'react-native';

import AvatarAldo from '../../assets/images/Ava3.png';
import AvatarFikri from '../../assets/images/Ava1.png';
import AvatarGita from '../../assets/images/Ava4.png';
import AvatarNataa from '../../assets/images/Ava2.png';

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	password: string;
	grade: string;
	badgeLabel: string;
	avatar: ImageSourcePropType;
	joinedAt: string;
};

const nowIso = new Date('2024-01-01T07:00:00.000Z').toISOString();

export const defaultAuthAvatar = AvatarNataa;

export const initialAuthUsers: AuthUser[] = [
	{
		id: 'RBD0925015',
		name: 'Nataa',
		email: 'test1@email.com',
		password: 'test',
		grade: '9 SMP',
		badgeLabel: 'Idaman UI',
		avatar: AvatarNataa,
		joinedAt: nowIso,
	},
	{
		id: 'RBD0925016',
		name: 'Gitaak',
		email: 'test2@email.com',
		password: 'test',
		grade: '9 SMP',
		badgeLabel: 'Juara 1',
		avatar: AvatarGita,
		joinedAt: nowIso,
	},
	{
		id: 'RBD0925017',
		name: 'Fikri',
		email: 'test3@email.com',
		password: 'test',
		grade: '9 SMP',
		badgeLabel: 'Top Challenger',
		avatar: AvatarFikri,
		joinedAt: nowIso,
	},
	{
		id: 'RBD0925018',
		name: 'Aldo',
		email: 'test4@email.com',
		password: 'test',
		grade: '9 SMP',
		badgeLabel: 'Quiz Master',
		avatar: AvatarAldo,
		joinedAt: nowIso,
	},
];
