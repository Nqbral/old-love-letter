import GreenButton from '@components/buttons/GreenButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import RedButton from '@components/buttons/RedButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import GamePlayerLobby from '@components/game/list_tiles/GamePlayerLobby';
import useSocketManager from '@components/hooks/useSocketManager';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useRouter } from 'next/navigation';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobby({ lobbyState }: Props) {
  const { sm } = useSocketManager();
  const router = useRouter();
  const isOwner = sm.getSocketId() === lobbyState?.ownerId;

  const onStartGame = () => {
    sm.emit({
      event: ClientEvents.StartGame,
      data: {
        lobbyId: lobbyState?.lobbyId,
      },
    });
  };

  const onDeleteLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyDelete,
      data: {
        lobbyId: lobbyState?.lobbyId,
      },
    });
  };

  const onLeaveLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyLeave,
      data: {
        lobbyId: lobbyState?.lobbyId,
      },
    });

    router.push('/lobby');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-primary text-4xl">
        Lobby de {lobbyState?.ownerName}
      </h1>
      <p className="italic">
        Nombre de joueurs requis : {lobbyState?.maxClients}
      </p>
      <div className="flex w-100 flex-col items-center justify-center gap-2 border-1 border-slate-700 py-4">
        <h2 className="mb-2 text-lg">Liste des joueurs</h2>
        {lobbyState?.players.map((player, index) => {
          return (
            <GamePlayerLobby key={index} playerName={player[1]} index={index} />
          );
        })}
      </div>
      <div className="mt-2 flex flex-row gap-12">
        {isOwner && (
          <PrimaryButton
            buttonText="Lancer la partie"
            onClick={onStartGame}
            disabled={false}
          />
        )}
        <GreenButton
          buttonText="Copier lien"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
          }}
          disabled={false}
        />
        {isOwner && (
          <RedButton
            buttonText="Supprimer le lobby"
            onClick={onDeleteLobby}
            disabled={false}
          />
        )}
        {!isOwner && (
          <SecondaryButton
            buttonText="Quitter"
            onClick={onLeaveLobby}
            disabled={false}
          />
        )}
      </div>
      <p className="text-primary-hover">Veuillez ne pas rafraîchir la page !</p>
    </div>
  );
}
