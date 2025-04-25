'use client';

import GameLobby from '@components/game/GameLobby';
import GameLobbyError from '@components/game/GameLobbyError';
import GameLobbyJoin from '@components/game/GameLobbyJoin';
import useSocketManager from '@components/hooks/useSocketManager';
import { Listener } from '@components/websocket/types';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { GameState } from '@love-letter/shared/common/GameState';
import { reviver } from '@love-letter/shared/common/JsonHelper';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';

import Game from './Game';
import GameLobbyDelete from './GameLobbyDelete';

export default function GameManager() {
  const router = useRouter();
  const { sm } = useSocketManager();
  const clientId = sm.getSocketId();
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    lobbyName: '',
    gameState: GameState.InLobby,
    playersCount: 0,
    players: '',
    ownerName: '',
    ownerId: '',
    maxClients: 2,
  });
  const [gameState, setGameState] = useState<
    ServerPayloads[ServerEvents.GameState]
  >({
    lobbyId: '',
    players: '',
    discardedCard: undefined,
    lastPlayedCard: undefined,
    secondPlayedCard: undefined,
    playerTurn: '',
    playersTurnOrder: [],
    deck: [],
    eventDescription: undefined,
    roundRecap: undefined,
    gameState: GameState.InLobby,
  });
  const [lobbyError, setLobbyError] = useState<
    ServerPayloads[ServerEvents.LobbyError]
  >({ error: '', message: '' });
  const [lobbyDelete, setLobbyDelete] = useState<
    ServerPayloads[ServerEvents.LobbyDelete]
  >({ message: '' });
  const [showJoinLobby, setShowJoinLobby] = useState<boolean>(false);

  const searchParams = useSearchParams();

  const isPlayerNamed = () => {
    const socketId = sm.getSocketId();
    if (lobbyState.players == '') {
      return;
    }
    const playersParsed = JSON.parse(lobbyState.players, reviver);

    if (socketId != null) {
      const player = playersParsed.get(socketId);
      if (player == null || player['playerName'] == '') {
        setShowJoinLobby(true);
        return;
      }
    }

    setShowJoinLobby(false);
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

    const onLobbyDelete: Listener<ServerPayloads[ServerEvents.LobbyDelete]> = (
      data,
    ) => {
      setLobbyDelete(data);
    };

    const onLobbyState: Listener<ServerPayloads[ServerEvents.LobbyState]> = (
      data,
    ) => {
      setLobbyState(data);
    };

    const onGameState: Listener<ServerPayloads[ServerEvents.GameState]> = (
      data,
    ) => {
      setGameState(data);
    };

    const onGameMessage: Listener<ServerPayloads[ServerEvents.GameMessage]> = ({
      message,
    }) => {
      console.log(message);
    };

    sm.registerListener(ServerEvents.LobbyError, onLobbyNotFound);
    sm.registerListener(ServerEvents.LobbyDelete, onLobbyDelete);
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameState, onGameState);
    sm.registerListener(ServerEvents.GameMessage, onGameMessage);

    return () => {
      sm.removeListener(ServerEvents.LobbyError, onLobbyNotFound);
      sm.removeListener(ServerEvents.LobbyDelete, onLobbyDelete);
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameState, onGameState);
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
    };
  }, []);

  useEffect(() => {
    isPlayerNamed();
  }, [lobbyState]);

  if (lobbyError.error != '') {
    return <GameLobbyError error={lobbyError} />;
  }

  if (
    lobbyDelete.message != '' ||
    lobbyState.gameState == GameState.GameDeleted
  ) {
    return <GameLobbyDelete data={lobbyDelete} />;
  }

  if (lobbyState.lobbyId != '') {
    if (showJoinLobby) {
      return <GameLobbyJoin lobbyState={lobbyState} />;
    }
    if (lobbyState.gameState == GameState.InLobby) {
      return <GameLobby lobbyState={lobbyState} />;
    }

    return (
      <Game
        gameState={gameState}
        clientId={clientId}
        lobbyName={lobbyState.lobbyName}
      />
    );
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
