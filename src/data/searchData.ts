export type SearchItem = {
  id: string;
  title: string;
  date: string;
  free: boolean;
  routeName: string;
  routeParams: Record<string, any>;
};

export type SearchCategory = 'tryout' | 'materi' | 'digidaw';

export const searchData: Record<SearchCategory, SearchItem[]> = {
  tryout: [
    {
      id: 'to-snbt-1',
      title: 'TO SNBT #1',
      date: '15 November 2024',
      free: true,
      routeName: 'TryoutDesc',
      routeParams: {
        tryoutId: 'to-snbt-1',
        title: 'TO SNBT #1',
        dateLabel: '15 November 2024',
        statusLabel: 'Gratis',
        statusVariant: 'free' as const,
      },
    },
    {
      id: 'to-snbt-2',
      title: 'TO SNBT #2',
      date: '22 November 2024',
      free: false,
      routeName: 'TryoutDesc',
      routeParams: {
        tryoutId: 'to-snbt-2',
        title: 'TO SNBT #2',
        dateLabel: '22 November 2024',
        statusLabel: 'Rp 25.000',
        statusVariant: 'paid' as const,
      },
    },
  ],

  materi: [
    {
      id: 'matematika',
      title: 'Matematika',
      date: 'Updated: 5 November 2025',
      free: true,
      routeName: 'MateriCategory',
      routeParams: {
        categoryId: 'matematika',
        categoryTitle: 'Matematika',
        subjectId: 'matematika',
      },
    },
    {
      id: 'bahasa-indonesia',
      title: 'Bahasa Indonesia',
      date: 'Updated: 3 November 2025',
      free: true,
      routeName: 'MateriCategory',
      routeParams: {
        categoryId: 'bahasa-indonesia',
        categoryTitle: 'Bahasa Indonesia',
        subjectId: 'bahasa-indonesia',
      },
    },
  ],

  digidaw: [
    {
      id: 'digidaw-basic',
      title: 'DIGIDAW Basic',
      date: 'Uploaded: 2 November 2025',
      free: true,
      routeName: 'Digidaw',
      routeParams: {
        digidawId: 'digidaw-basic',
        title: 'DIGIDAW Basic',
        level: 'basic',
      },
    },
    {
      id: 'digidaw-advanced',
      title: 'DIGIDAW Advanced',
      date: 'Uploaded: 1 November 2025',
      free: true,
      routeName: 'Digidaw',
      routeParams: {
        digidawId: 'digidaw-advanced',
        title: 'DIGIDAW Advanced',
        level: 'advanced',
      },
    },
  ],
};
