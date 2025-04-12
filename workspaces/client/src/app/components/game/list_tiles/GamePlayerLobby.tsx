import { PlayerLobby } from '@love-letter/shared/common/Player';

type Props = {
  player: PlayerLobby;
  index: number;
};

export default function GamePlayerLobby({ player, index }: Props) {
  return (
    <div>
      {index + 1}. <span className={player.color}>{player.playerName}</span>
    </div>
  );
}
