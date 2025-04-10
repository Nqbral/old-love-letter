import { Lobby } from '@app/game/lobby/lobby';
import { GameState } from '@shared/common/GameState';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Socket } from 'socket.io';

export class Instance {
  public currentRound: number = 1;

  public listPlayers: [] = [];

  public scores: Record<Socket['id'], number> = {};

  public gameState: GameState = GameState.InLobby;

  constructor(private readonly lobby: Lobby) {
    // this.initializeCards();
  }

  public triggerStart(): void {
    if (this.gameState == GameState.GameStart) {
      return;
    }

    this.gameState = GameState.GameStart;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        message: 'Game started !',
      },
    );
  }

  public triggerFinish(): void {
    if (this.gameState === GameState.GameFinished) {
      return;
    }

    this.gameState = GameState.GameFinished;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        message: 'Game finished !',
      },
    );
  }
}
