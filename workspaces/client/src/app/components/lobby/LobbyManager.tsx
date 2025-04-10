import useSocketManager from '@components/hooks/useSocketManager';
import LobbyCreation from '@components/lobby/LobbyCreation';
import LobbyIntroduction from '@components/lobby/LobbyIntroduction';
import PreviousNavBar from '@components/navbar/PreviousNavBar';
import { Listener } from '@components/websocket/types';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export enum LobbyManagerState {
  LobbyIntroduction = 'lobby.introduction',
  LobbyCreation = 'lobby.creation',
}

export default function LobbyManager() {
  const router = useRouter();
  const { sm } = useSocketManager();

  const [stateLobbyManager, setStateLobbyManager] = useState(
    LobbyManagerState.LobbyIntroduction,
  );

  const setLobbyManagerState = (lobbyManagerState: LobbyManagerState) => {
    setStateLobbyManager(lobbyManagerState);
  };

  useEffect(() => {
    sm.connect();

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      router.push('/game?lobby=' + data.lobbyId);
    };

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center py-12">
      <PreviousNavBar linkTo="/" />
      {stateLobbyManager === LobbyManagerState.LobbyIntroduction && (
        <LobbyIntroduction setLobbyManagerState={setLobbyManagerState} />
      )}
      {stateLobbyManager === LobbyManagerState.LobbyCreation && (
        <LobbyCreation setLobbyManagerState={setLobbyManagerState} />
      )}
    </div>
  );
}
