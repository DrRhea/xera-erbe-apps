import type { ImageSourcePropType } from 'react-native';

import LiterasikCover1 from '../../assets/images/literasik.png';
import LiterasikCover2 from '../../assets/images/literasik.png';
import LiterasikCover3 from '../../assets/images/literasik.png';

export type LiterasikArticle = {
	id: string;
	title: string;
	excerpt: string;
	category: string;
	publishedAt: string;
	image: ImageSourcePropType;
};

export const literasikArticles: LiterasikArticle[] = [
	{
		id: 'lit-english-upgrade',
		title: '5 Hal Penting Buat Improve Bahasa Inggris Kamu!',
		excerpt:
			'Pernah ga sih kamu coba konsisten belajar tapi ngerasa kemampuan kamu stuck di situ-situ aja? Cobain lima cara praktis ini biar progresmu makin kerasa setiap hari.',
		category: 'Tips Belajar',
		publishedAt: '2024-08-19T02:00:00.000Z',
		image: LiterasikCover1,
	},
	{
		id: 'lit-productive-day',
		title: 'Morning Routine Anti Mager untuk Pejuang PTN',
		excerpt:
			'Bangun lebih awal itu susah? Kita bantu breakdown rutinitas simpel biar kamu bisa mulai hari dengan fokus dan energi maksimal.',
		category: 'Produktivitas',
		publishedAt: '2024-08-12T02:00:00.000Z',
		image: LiterasikCover2,
	},
	{
		id: 'lit-study-flow',
		title: 'Bikin Jadwal Belajar yang Nggak Bikin Burnout',
		excerpt:
			'Biar nggak kelelahan jelang try out, yuk atur jadwal belajar yang fleksibel tapi tetap konsisten. Ini formula yang bisa langsung kamu adaptasi.',
		category: 'Planning',
		publishedAt: '2024-08-05T02:00:00.000Z',
		image: LiterasikCover3,
	},
];
