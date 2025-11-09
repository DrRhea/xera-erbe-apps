export type TryoutItem = {
  id: string;
  title: string;
  dateLabel: string;
  statusLabel: string;
  statusVariant: 'free' | 'paid';
};

export const upcomingTryouts: TryoutItem[] = [
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

export const getUpcomingTryouts = () => upcomingTryouts;
