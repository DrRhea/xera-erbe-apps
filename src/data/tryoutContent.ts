export type TryoutSubtest = {
	id: string;
	title: string;
	durationMinutes: number;
	questionCount?: number;
};

export type TryoutDefinition = {
	id: string;
	title: string;
	subtests: TryoutSubtest[];
};

export const DEFAULT_SUBTEST_DURATION_MINUTES = 30;

const tryoutDefinitions: Record<string, TryoutDefinition> = {
	'to-tka-smp-5': {
		id: 'to-tka-smp-5',
		title: 'TO TKA SMP #5',
		subtests: [
			{ id: 'math', title: 'TKA Matematika', durationMinutes: 30 },
			{ id: 'literasi', title: 'TKA Literasi Indonesia', durationMinutes: 30 },
		],
	},
	'to-tka-sma-6': {
		id: 'to-tka-sma-6',
		title: 'TO TKA SMA #6',
		subtests: [
			{ id: 'math', title: 'TKA Matematika', durationMinutes: 35 },
			{ id: 'science', title: 'TKA Sains Terapan', durationMinutes: 35 },
		],
	},
	'to-snbt-2': {
		id: 'to-snbt-2',
		title: 'TO SNBT #2',
		subtests: [
			{ id: 'penalaran', title: 'Penalaran Umum', durationMinutes: 30 },
			{ id: 'kognitif', title: 'Kemampuan Kognitif', durationMinutes: 30 },
		],
	},
	'to-11-sma-2': {
		id: 'to-11-sma-2',
		title: 'TO 11 SMA #2',
		subtests: [
			{ id: 'literasi', title: 'Literasi Membaca', durationMinutes: 25 },
			{ id: 'numerasi', title: 'Literasi Numerasi', durationMinutes: 25 },
		],
	},
};

export const getTryoutDefinition = (tryoutId: string): TryoutDefinition | undefined =>
	tryoutDefinitions[tryoutId];

export const resolveTryoutDefinition = (
	tryoutId: string,
	fallbackTitle: string
): TryoutDefinition => {
	const definition = getTryoutDefinition(tryoutId);
	if (definition) {
		return definition;
	}
	return {
		id: tryoutId,
		title: fallbackTitle,
		subtests: [],
	};
};

export const getTryoutSubtest = (
	tryoutId: string,
	subtestId: string
): TryoutSubtest | undefined => {
	const definition = getTryoutDefinition(tryoutId);
	return definition?.subtests.find((subtest: TryoutSubtest) => subtest.id === subtestId);
};

export const resolveTryoutSubtest = (
	tryoutId: string,
	subtestId: string,
	fallbackTitle: string,
	fallbackDurationMinutes: number = DEFAULT_SUBTEST_DURATION_MINUTES
): TryoutSubtest => {
	const subtest = getTryoutSubtest(tryoutId, subtestId);
	if (subtest) {
		return subtest;
	}
	return {
		id: subtestId,
		title: fallbackTitle,
		durationMinutes: fallbackDurationMinutes,
	};
};

export const tryoutIds = Object.keys(tryoutDefinitions);
