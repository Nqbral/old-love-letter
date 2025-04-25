import { PlayerGame } from '@shared/common/Player';

type Props = {
  player: PlayerGame | undefined;
};

export default function PlayerTurn({ player }: Props) {
  if (player != undefined) {
    return (
      <div>
        C&apos;est au tour de{' '}
        <span className={player.color}>{player.playerName}</span>.
      </div>
    );
  }

  return <></>;
}
