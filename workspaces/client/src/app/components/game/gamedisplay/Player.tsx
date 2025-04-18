import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlayerGame } from '@love-letter/shared/common/Player';

import PlayerCards from './PlayerCards';

type Props = {
  myPlayer: PlayerGame;
};

export default function Player({ myPlayer }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-2">
        <div>{myPlayer.score}</div>
        <FontAwesomeIcon icon={faCoins} color="oklch(92.4% 0.12 95.746)" />
        <div className={myPlayer.color}>{myPlayer.playerName}</div>
      </div>
      <div className="flex flex-row gap-2">
        <PlayerCards cards={myPlayer.cards} />
      </div>
      <div className="">Carte(s) active(s)</div>
      <div className="flex flex-row gap-2">
        <div className="h-32 w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
      </div>
    </div>
  );
}
