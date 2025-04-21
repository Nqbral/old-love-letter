import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlayerGame } from '@love-letter/shared/common/Player';
import Handmaid from '@public/handmaid.png';
import Spy from '@public/spy.png';
import { Cards } from '@shared/common/Cards';
import Image from 'next/image';

import PlayerCards from './PlayerCards';

type Props = {
  myPlayer: PlayerGame;
};

export default function Player({ myPlayer }: Props) {
  let classesPlayer = myPlayer.color;

  if (!myPlayer.alive) {
    classesPlayer += ' line-through';
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row items-center gap-2">
        <div>{myPlayer.score}</div>
        <FontAwesomeIcon icon={faCoins} color="oklch(92.4% 0.12 95.746)" />
        <div className={classesPlayer}>{myPlayer.playerName}</div>
      </div>
      <div className="flex flex-row gap-2">
        <PlayerCards cards={myPlayer.cards} />
      </div>
      <div className="">Carte(s) active(s)</div>
      <div className="flex flex-row gap-2">
        {myPlayer.activeCards.length == 0 ? (
          <div className="h-32 w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
        ) : (
          myPlayer.activeCards.map((card, index) => {
            if (card == Cards.Spy) {
              return (
                <Image
                  key={'activeCards-' + myPlayer.id + '-' + index}
                  className="w-24"
                  src={Spy}
                  alt="spy"
                />
              );
            }

            return (
              <Image
                key={'activeCards-' + myPlayer.id + '-' + index}
                className="w-24"
                src={Handmaid}
                alt="handmaid"
              />
            );
          })
        )}
      </div>
    </div>
  );
}
