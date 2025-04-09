import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobby({ lobbyState }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-primary text-4xl">
        Lobby de {lobbyState?.ownerName}
      </h1>
      <div className="flex w-100 flex-col items-center justify-center gap-4 border-1 border-slate-700 py-4">
        <h2>Liste des joueurs</h2>
        {lobbyState?.players.map((player) => {
          return <div key={player[0]}>{player[1]}</div>;
        })}
      </div>
      <p className="text-primary-hover">Veuillez ne pas rafraîchir la page !</p>
    </div>
  );
}
