export type ActiveTryout = {
  id: string;
  title: string;
};

export type UpcomingTryout = {
  id: string;
  title: string;
  dateLabel: string;
  statusLabel: string;
  statusVariant: 'free' | 'paid';
};

export const activeTryouts: ActiveTryout[] = [
  { id: 'to-tka-smp-5', title: 'TO TKA SMP #5' },
  { id: 'to-tka-sma-6', title: 'TO TKA SMA #6' },
  { id: 'to-snbt-2', title: 'TO SNBT #2' },
  { id: 'to-11-sma-2', title: 'TO 11 SMA #2' },
];

export const upcomingTryouts: UpcomingTryout[] = [
  {
    id: 'to-tka-smp-6',
    title: 'Tryout TKA SMP #6',
    dateLabel: '18 November 2025',
    statusLabel: 'Free',
    statusVariant: 'free',
  },
  {
    id: 'to-snbt-3',
    title: 'TO SNBT #3',
    dateLabel: '18 November 2025',
    statusLabel: 'Free',
    statusVariant: 'free',
  },
  {
    id: 'to-snbt-4',
    title: 'TO SNBT #4',
    dateLabel: '25 November 2025',
    statusLabel: 'Rp 10.000,-',
    statusVariant: 'paid',
  },
];
