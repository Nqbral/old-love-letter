import { PLAYER_COLORS } from 'app/constants';

type Props = {
  playerName: string;
  index: number;
};

export default function GamePlayerLobby({ playerName, index }: Props) {
  return (
    <div>
      {index + 1}. <span className={PLAYER_COLORS[index]}>{playerName}</span>
    </div>
  );
}
