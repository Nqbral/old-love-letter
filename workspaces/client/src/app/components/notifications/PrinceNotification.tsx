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
  playerTargeted: PlayerGame;
  lostCard: Cards;
  drawedCard: Cards | undefined;
  killedPlayer: boolean;
}>;

export default function PrinceNotification({ data }: Props) {
  const lostCard = articleCard(data.lostCard)?.get('card');
  const articleLostCard = articleCard(data.lostCard)?.get('articleCard');

  const drawedCard = articleCard(data.drawedCard)?.get('card');

  return (
    <div className={`${medievalsharp.className}`}>
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <h3 className="text-primary text-lg">Action de jeu</h3>
        <div className="w-full text-center text-sm text-white">
          {data.player.id == data.playerTargeted.id ? (
            <div className="text-center">Vous défaussez votre propre main.</div>
          ) : (
            <div className="text-center">
              <span className={data.player.color}>
                {data.player.playerName}
              </span>{' '}
              défausse votre main avec un{' '}
              <span className="font-bold">Prince</span>.
            </div>
          )}
          {data.killedPlayer ? (
            <div className="text-center">
              Vous aviez une <span className="font-bold">Princesse</span>. Vous
              êtes éliminé.
            </div>
          ) : (
            <div className="text-center">
              Vous aviez {articleLostCard}
              <span className="font-bold">{lostCard}</span> et vous piochez la
              carte <span className="text-bold">{drawedCard}</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
