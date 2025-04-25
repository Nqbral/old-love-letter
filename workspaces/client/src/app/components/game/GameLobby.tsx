import GreenButton from '@components/buttons/GreenButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import RedButton from '@components/buttons/RedButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import GamePlayerLobby from '@components/game/list_tiles/GamePlayerLobby';
import useSocketManager from '@components/hooks/useSocketManager';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { reviver } from '@love-letter/shared/common/JsonHelper';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobby({ lobbyState }: Props) {
  const { sm } = useSocketManager();
  const router = useRouter();
  const [errMsgName, setErrMsgName] = useState('');
  const isOwner = sm.getSocketId() === lobbyState?.ownerId;
  let playersParsed = new Map();

  if (lobbyState?.players != null) {
    playersParsed = JSON.parse(lobbyState.players, reviver);
  }

  const onStartGame = () => {
    if (playersParsed.size < 2) {
      setErrMsgName("Il n'y a pas assez de joueurs pour lancer la partie.");
      return;
    }

    if (playersParsed.size > 6) {
      setErrMsgName('Il y a trop de joueurs pour lancer la partie.');
      return;
    }
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
      <h1 className="text-primary text-4xl">Lobby "{lobbyState?.lobbyName}"</h1>
      <p className="italic">Nombre de joueurs minimum requis : 2</p>
      <p className="italic">Nombre de joueurs maximum : 6</p>
      <div className="flex w-100 flex-col items-center justify-center gap-2 border-1 border-slate-700 py-4">
        <h2 className="mb-2 text-lg">Liste des joueurs</h2>
        {Array.from(playersParsed).map((player, index) => {
          return (
            <GamePlayerLobby key={index} player={player[1]} index={index} />
          );
        })}
      </div>
      <p
        className={errMsgName ? 'text-red-600' : 'hidden'}
        aria-live="assertive"
      >
        {errMsgName}
      </p>
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
