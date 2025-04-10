import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cards, CardsNumber } from '@shared/common/Cards';
import { GameState } from '@shared/common/GameState';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { isString } from 'class-validator';
import { Socket } from 'socket.io';

export class Instance {
  public currentRound: number = 1;

  public scores: Record<Socket['id'], number> = {};

  public gameState: GameState = GameState.InLobby;

  public deck: Cards[] = [];

  public playerTurn: Socket['id'];

  public playersCard: Map<Socket['id'], Cards[]> = new Map<
    Socket['id'],
    Cards[]
  >();

  public discardedCard: Cards;

  public lastPlayedCard: Cards;

  constructor(private readonly lobby: Lobby) {}

  public triggerStart(client: AuthenticatedSocket): void {
    if (this.gameState == GameState.GameStart) {
      return;
    }

    if (client.id != this.lobby.owner.id) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Only the owner of the lobby can start the game',
      );
    }

    if (
      this.lobby.maxClients > Array.from(this.lobby.players.values()).length
    ) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'The lobby is not full',
      );
    }

    this.gameState = GameState.GameStart;

    this.initializeCards();
    this.setRandomTurn();

    this.lobby.dispatchLobbyState();
    this.dispatchGameState();
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

  private initializeCards(): void {
    const cards = Object.values(Cards).filter((c) => isString(c)) as Cards[];
    for (const card of cards) {
      for (let i = 0; i < CardsNumber[card]; i++) {
        this.deck.push(card);
      }
    }

    // Shuffle array randomly
    this.deck = this.deck.sort((a, b) => 0.5 - Math.random());
    // Discard one card
    this.deck.pop();

    this.lobby.players.forEach((playerName, socketId) => {
      let card = this.deck.pop();

      if (card !== undefined) {
        this.playersCard.set(socketId, [card]);
      }
    });
  }

  private setRandomTurn(): void {
    const arr = Array.from(this.lobby.players.keys());
    this.playerTurn = arr[Math.floor(Math.random() * arr.length)];
  }

  public dispatchGameState(): void {
    this.lobby.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.GameState] = {
      lobbyId: this.lobby.id,
      players: Array.from(this.lobby.players.entries()),
      playersCard: Array.from(this.playersCard.entries()),
      discardedCard: this.discardedCard,
      lastPlayedCard: this.lastPlayedCard,
      playerTurn: 'test',
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
