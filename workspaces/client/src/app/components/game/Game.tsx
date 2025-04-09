import Lobby from '@components/game/GameLobby';
import { GameState } from '@love-letter/shared/common/GameState';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function Game({ lobbyState }: Props) {
  return <p>En game</p>;
}
