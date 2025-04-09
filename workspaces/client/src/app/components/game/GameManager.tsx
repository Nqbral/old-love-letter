import { Listener } from '@components/websocket/types';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { atom, useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import useSocketManager from '../hooks/useSocketManager';
import LobbyIntroduction from './LobbyIntroduction';
import LobbyManager from './LobbyManager';

const lobbyStateAtom = atom<ServerPayloads[ServerEvents.LobbyState] | null>(
  null,
);

export default function GameManager() {
  const router = useRouter();
  const { sm } = useSocketManager();
  const [lobbyState, setLobbyState] = useAtom(lobbyStateAtom);

  const searchParams = useSearchParams();

  useEffect(() => {
    const lobbyIdJoin = searchParams.get('lobby');

    if (lobbyIdJoin != '') {
      sm.emit({
        event: ClientEvents.LobbyJoin,
        data: {
          lobbyId: lobbyIdJoin,
        },
      });
    }
  }, [router]);

  useEffect(() => {
    sm.connect();

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      setLobbyState(data);
      router.push('/lobby?lobby=' + data.lobbyId);
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({
      message,
    }) => {
      console.log(message);
    };

    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);

    return () => {
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
    };
  }, []);

  if (lobbyState === null) {
    return <LobbyIntroduction />;
  }

  return <LobbyManager />;
}
