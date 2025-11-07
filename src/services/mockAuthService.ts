import { defaultAuthAvatar, initialAuthUsers, type AuthUser } from '../data/authUsers';

export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterResult =
	| { success: true; user: AuthUser }
	| { success: false; error: string };

export type LoginResult =
	| { success: true; user: AuthUser }
	| { success: false; error: string };

let authUsers: AuthUser[] = [...initialAuthUsers];

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const generateUserId = () => {
	const base = 'RBD';
	const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
	return `${base}${randomSuffix}`;
};

export const getMockUsers = () => authUsers.slice();

export const resetMockUsers = () => {
	authUsers = [...initialAuthUsers];
};

export const registerMockUser = ({ name, email, password }: RegisterPayload): RegisterResult => {
	const trimmedName = name.trim();
	const normalizedEmail = normalizeEmail(email);

	if (!trimmedName || !normalizedEmail || !password.trim()) {
		return { success: false, error: 'Mohon lengkapi semua data.' };
	}

	if (password.trim().length < 6) {
		return { success: false, error: 'Password minimal 6 karakter.' };
	}

	const existingUser = authUsers.find((user) => normalizeEmail(user.email) === normalizedEmail);

	if (existingUser) {
		return { success: false, error: 'Email sudah terdaftar. Silakan masuk.' };
	}

	const newUser: AuthUser = {
		id: generateUserId(),
		name: trimmedName,
		email: normalizedEmail,
		password: password.trim(),
		grade: '9 SMP',
		badgeLabel: 'Pejuang Baru',
		avatar: defaultAuthAvatar,
		joinedAt: new Date().toISOString(),
	};

	authUsers = [...authUsers, newUser];

	return { success: true, user: newUser };
};

export const loginMockUser = ({ email, password }: LoginPayload): LoginResult => {
	const normalizedEmail = normalizeEmail(email);
	const normalizedPassword = password.trim();

	const user = authUsers.find(
		(candidate) => normalizeEmail(candidate.email) === normalizedEmail && candidate.password === normalizedPassword,
	);

	if (!user) {
		return { success: false, error: 'Email atau password salah.' };
	}

	return { success: true, user };
};
