'use client';

import { Cards } from '@shared/common/Cards';
import { PlayerGame } from '@shared/common/Player';
import { articleCard } from 'app/helper/ArticleCard';
import { MedievalSharp } from 'next/font/google';
import { ToastContentProps } from 'react-toastify';

const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medievalsharp',
  weight: ['400'],
});

type Props = ToastContentProps<{
  card: Cards | undefined;
}>;

export default function DrawCardNotification({ data }: Props) {
  let card = articleCard(data.card)?.get('card');

  return (
    <div className={`${medievalsharp.className} w-full`}>
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h3 className="text-primary text-lg">Pioche</h3>
        <div className="w-full text-center text-sm text-white">
          Vous piochez la carte <span className="font-bold">{card}</span>.
        </div>
      </div>
    </div>
  );
}
