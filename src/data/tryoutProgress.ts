type CompletedSubtestMap = Record<string, Set<string>>;

type TryoutProgressState = {
  completedSubtests: CompletedSubtestMap;
};

const progressState: TryoutProgressState = {
  completedSubtests: {},
};

const getOrCreateSubtestSet = (tryoutId: string): Set<string> => {
  if (!progressState.completedSubtests[tryoutId]) {
    progressState.completedSubtests[tryoutId] = new Set();
  }
  return progressState.completedSubtests[tryoutId];
};

export const markTryoutSubtestCompleted = (tryoutId: string, subtestId: string) => {
  const set = getOrCreateSubtestSet(tryoutId);
  set.add(subtestId);
};

export const isTryoutSubtestCompleted = (tryoutId: string, subtestId: string): boolean => {
  const set = progressState.completedSubtests[tryoutId];
  return set ? set.has(subtestId) : false;
};

export const getCompletedSubtests = (tryoutId: string): string[] => {
  const set = progressState.completedSubtests[tryoutId];
  if (!set) {
    return [];
  }
  return Array.from(set.values());
};
