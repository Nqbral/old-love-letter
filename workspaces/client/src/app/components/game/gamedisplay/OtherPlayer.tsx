import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PlayerGame } from '@love-letter/shared/common/Player';
import BackCard from '@public/backcard.png';
import Image from 'next/image';

type Props = {
  player: PlayerGame;
};

export default function OtherPlayer({ player }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-32 w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
      <div className="flex flex-row gap-2">
        <div>{player.score}</div>
        <FontAwesomeIcon icon={faCoins} color="oklch(92.4% 0.12 95.746)" />
        <div className={player.color}>{player.playerName}</div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {player.cards.map((card, index) => {
          return (
            <Image
              key={index}
              className="w-24"
              src={BackCard}
              alt="player_card"
            />
          );
        })}
      </div>
    </div>
  );
}
