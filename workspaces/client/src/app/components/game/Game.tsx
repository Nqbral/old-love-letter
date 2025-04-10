import Deck from '@components/game/gamedisplay/Deck';
import OtherPlayer from '@components/game/gamedisplay/OtherPlayer';
import Player from '@components/game/gamedisplay/Player';
import useSocketManager from '@components/hooks/useSocketManager';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState] | null;
};

export default function Game({ gameState }: Props) {
  return (
    <div className="flex w-full flex-row items-center justify-between px-30">
      <Player />
      <Deck />
      <OtherPlayer />
    </div>
  );
}
