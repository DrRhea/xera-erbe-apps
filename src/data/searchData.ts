export type SearchItem = {
  id: string;
  title: string;
  date: string;
  free: boolean;
  statusLabel?: string;
  statusVariant?: string;
  routeName: string;
  routeParams: Record<string, any>;
};

export type SearchCategory = 'tryout' | 'materi' | 'digidaw' | 'snackbt' | 'poke' | 'imeng' | 'literasik';

export const searchData: Record<SearchCategory, SearchItem[]> = {
  tryout: [],
  materi: [],
  digidaw: [],
  snackbt: [],
  poke: [],
  imeng: [],
  literasik: [],
};
