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
  player: PlayerGame;
}>;

export default function PriestNotification({ data }: Props) {
  return (
    <div className={`${medievalsharp.className}`}>
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h3 className="text-primary text-lg">Action de jeu</h3>
        <div className="text-center text-sm text-white">
          <span className={data.player.color}>{data.player.playerName}</span>{' '}
          regarde votre main avec un <span className="font-bold">Prêtre</span>.
        </div>
      </div>
    </div>
  );
}
