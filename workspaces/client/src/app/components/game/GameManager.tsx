'use client';

import GameLobby from '@components/game/GameLobby';
import GameLobbyError from '@components/game/GameLobbyError';
import GameLobbyJoin from '@components/game/GameLobbyJoin';
import useSocketManager from '@components/hooks/useSocketManager';
import { Listener } from '@components/websocket/types';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { GameState } from '@love-letter/shared/common/GameState';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';

export default function GameManager() {
  const router = useRouter();
  const { sm } = useSocketManager();
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    gameState: GameState.InLobby,
    playersCount: 0,
    players: [],
    scores: {},
    ownerName: '',
  });
  const [lobbyError, setLobbyError] = useState<
    ServerPayloads[ServerEvents.LobbyError]
  >({ error: '', message: '' });
  const [showJoinLobby, setShowJoinLobby] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const findSocketIdInPlayers = () => {
    const socketId = sm.getSocketId();

    let foundSocket = false;

    for (let i = 0; i < lobbyState.players.length; i++) {
      if (lobbyState.players[i][0] == socketId) {
        foundSocket = true;
      }
    }

    setShowJoinLobby(!foundSocket);
  };

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

    const onLobbyNotFound: Listener<ServerPayloads[ServerEvents.LobbyError]> = (
      data,
    ) => {
      setLobbyError(data);
    };

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      console.log(data);
      setLobbyState(data);
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({
      message,
    }) => {
      console.log(message);
    };

    sm.registerListener(ServerEvents.LobbyError, onLobbyNotFound);
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);

    return () => {
      sm.removeListener(ServerEvents.LobbyError, onLobbyNotFound);
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
    };
  }, []);

  useEffect(() => {
    findSocketIdInPlayers();
  }, [lobbyState]);

  if (lobbyError.error != '') {
    return <GameLobbyError error={lobbyError} />;
  }

  if (lobbyState.lobbyId != '') {
    if (showJoinLobby) {
      return <GameLobbyJoin lobbyState={lobbyState} />;
    }
    return <GameLobby lobbyState={lobbyState} />;
  }

  return (
    <Hearts
      height="80"
      width="80"
      color="oklch(87.9% 0.169 91.605)"
      ariaLabel="hearts-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
}
