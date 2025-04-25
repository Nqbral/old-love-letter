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
  card: Cards;
  killed: boolean;
}>;

export default function GuardNotification({ data }: Props) {
  const cardGuessed = articleCard(data.card)?.get('card');
  const articleCardGuessed = articleCard(data.card)?.get('articleCard');

  return (
    <div className={`${medievalsharp.className}`}>
      <div className="flex w-full flex-col items-center gap-4">
        <h3 className="text-primary text-lg">Action de jeu</h3>
        <div className="text-center text-sm text-white">
          <span className={data.player.color}>{data.player.playerName}</span>{' '}
          vous attaque avec un <span className="font-bold">Garde</span> et pense
          que vous avez {articleCardGuessed}
          <span className="font-bold">{cardGuessed}</span> dans votre main.
          <br />
          {data.killed ? (
            <div className="text-center text-white">
              C&apos;est le cas, vous êtes éliminé.
            </div>
          ) : (
            <div className="text-center text-white">
              Ce n&apos;est pas le cas, rien ne se passe.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
