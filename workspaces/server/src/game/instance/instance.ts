import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cards, CardsNumber, CardsValue } from '@shared/common/Cards';
import { GameState } from '@shared/common/GameState';
import { replacer } from '@shared/common/JsonHelper';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { isString } from 'class-validator';
import { Socket } from 'socket.io';

import { PlayBaronGameDto, PlayCardGameDto } from '../dtos';

export class Instance {
  public currentRound: number = 1;

  public scores: Record<Socket['id'], number> = {};

  public gameState: GameState = GameState.InLobby;

  public deck: Cards[] = [];

  public playerTurn: Socket['id'];

  public players: Map<Socket['id'], PlayerGame> = new Map<
    Socket['id'],
    PlayerGame
  >();

  public playersActiveCard: Map<Socket['id'], Cards[]> = new Map<
    Socket['id'],
    Cards[]
  >();

  public playersTurnOrder: Socket['id'][] = [];

  public discardedCard: Cards | undefined;

  public lastPlayedCard: Cards | undefined;

  public scoreToReach: number;

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

    this.initPlayers();
    this.initializeCards();
    this.initializeTurns();
    this.initScoreToReach();
    this.setRandomTurn();
    this.playerDrawCard();

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
    this.discardedCard = this.deck.pop();

    // Give each player one card
    this.players.forEach((playerGame, socketId) => {
      let card = this.deck.pop();
      let player = this.players.get(socketId);

      if (player != null && card != undefined) {
        player.cards = [card];
      }
    });
  }

  private initPlayers(): void {
    this.lobby.players.forEach((value, key) => {
      this.players.set(key, {
        id: value.id,
        color: value.color,
        playerName: value.playerName,
        score: 0,
        cards: [],
        activeCards: [],
        alive: true,
      });
    });
  }

  private initializeTurns(): void {
    this.playersTurnOrder = Array.from(this.players.keys()).sort(
      (a, b) => 0.5 - Math.random(),
    );
  }

  private initScoreToReach(): void {
    switch (this.players.size) {
      case 2:
        this.scoreToReach = 6;
        break;
      case 3:
        this.scoreToReach = 5;
        break;
      case 4:
        this.scoreToReach = 4;
        break;
      default:
        this.scoreToReach = 3;
        break;
    }
  }

  // Set the turn on one of the player randomly (at start game only)
  private setRandomTurn(): void {
    const arr = Array.from(this.lobby.players.keys());
    this.playerTurn = arr[Math.floor(Math.random() * arr.length)];
  }

  private playerDrawCard() {
    if (this.deck.length == 0) {
      return;
    }
    let player = this.players.get(this.playerTurn);
    if (player != null) {
      let card = this.deck.pop();
      if (card != undefined) {
        player.cards.push(card);
      }
    }
  }

  public playCard(client: AuthenticatedSocket, card: Cards, data): void {
    if (client.id != this.playerTurn) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'This is not the turn of the player',
      );
    }

    let player = this.players.get(client.id);

    if (player != null) {
      let indexPlayerCardPlayed = player.cards.findIndex((value) => {
        return value == card;
      });

      if (indexPlayerCardPlayed != -1) {
        if (card != Cards.Spy && card != Cards.Handmaid) {
          this.lastPlayedCard = card;
        }
        player.cards.splice(indexPlayerCardPlayed, 1);
        switch (card) {
          case Cards.Spy:
            this.playSpyCard(player);
            break;
          case Cards.Guard:
            this.playGuardCard(
              data.playerIdTarget,
              data.cardTarget,
              data.noEffect,
            );
            break;
          case Cards.Priest:
            this.playPriestCard(client.id, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Baron:
            this.playBaronCard(client.id, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Handmaid:
            this.playHandmaidCard(player);
            break;
          case Cards.Prince:
            this.playPrinceCard(client.id, data.playerIdTarget);
            break;
          case Cards.Chancellor:
            this.playChancellorCard();
            break;
          case Cards.King:
            this.playKingCard(client.id, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Countess:
            this.playCountessCard();
            break;
          case Cards.Princess:
            this.playPrincessCard();
            break;
        }

        return;
      }
    }

    throw new ServerException(
      SocketExceptions.LobbyError,
      'Error while playing card',
    );
  }

  public playSpyCard(player: PlayerGame) {
    player.activeCards.push(Cards.Spy);
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playGuardCard(
    playerIdTarget: string,
    cardTarget: Cards,
    noEffect: boolean,
  ) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (!noEffect) {
      if (playerTargeted != undefined) {
        if (playerTargeted.cards[0] == cardTarget) {
          this.killPlayer(playerIdTarget);
        }
      }
    }

    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playPriestCard(
    clientId: string,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (!noEffect) {
      if (playerTargeted != undefined) {
        const payload: ServerPayloads[ServerEvents.GamePriestPlayed] = {
          cardGuessed: playerTargeted.cards[0],
          playerGuessedName: playerTargeted.playerName,
          playerGuessedColor: playerTargeted.color,
        };
        this.lobby.dispatchToClient(
          clientId,
          ServerEvents.GamePriestPlayed,
          payload,
        );
      }
    }
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playBaronCard(
    clientId: string,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    let myPlayer = this.players.get(clientId);
    let playerTargeted = this.players.get(playerIdTarget);

    if (!noEffect) {
      if (myPlayer != undefined && playerTargeted != undefined) {
        let myPlayerValue = CardsValue[myPlayer.cards[0]];
        let playerTargetedValue = CardsValue[playerTargeted.cards[0]];

        if (myPlayerValue > playerTargetedValue) {
          this.killPlayer(playerIdTarget);
        }

        if (myPlayerValue < playerTargetedValue) {
          this.killPlayer(clientId);
        }

        if (myPlayerValue == playerTargetedValue) {
        }
      }
    }

    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playHandmaidCard(player: PlayerGame) {
    player.activeCards.push(Cards.Handmaid);
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playPrinceCard(clientId: string, playerIdTarget: string) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined) {
      if (playerTargeted.cards[0] == Cards.Princess) {
        this.killPlayer(playerIdTarget);
        this.nextTurn();
        this.playerDrawCard();
        this.dispatchGameState();

        return;
      }
      this.lastPlayedCard = playerTargeted.cards[0];
      playerTargeted.cards = [];

      if (this.deck.length == 0) {
        if (this.discardedCard != undefined) {
          playerTargeted.cards = [this.discardedCard];
        }

        this.discardedCard = undefined;
      } else {
        let drawCard = this.deck.pop();

        if (drawCard != undefined) {
          playerTargeted.cards = [drawCard];
        }
      }
    }
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playChancellorCard() {
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playKingCard(
    clientId: string,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    let myPlayer = this.players.get(clientId);
    let playerTargeted = this.players.get(playerIdTarget);

    if (!noEffect) {
      if (myPlayer != undefined && playerTargeted != undefined) {
        let myPlayerCard = myPlayer.cards;
        myPlayer.cards = playerTargeted.cards;
        playerTargeted.cards = myPlayerCard;
      }
    }

    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playCountessCard() {
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public playPrincessCard() {
    this.nextTurn();
    this.playerDrawCard();
    this.dispatchGameState();
  }

  public killPlayer(playerId: Socket['id']) {
    let player = this.players.get(playerId);

    if (player != undefined) {
      player.alive = false;
      this.lastPlayedCard = player.cards[0];
      player.activeCards = [];
      player.cards = [];
    }
  }

  public nextTurn() {
    let indexCurrentPlayer = this.playersTurnOrder.findIndex((value) => {
      return value == this.playerTurn;
    });

    if (indexCurrentPlayer != -1) {
      let nextPlayer = indexCurrentPlayer;
      let playerFound = false;
      while (!playerFound) {
        nextPlayer++;

        if (nextPlayer > this.playersTurnOrder.length) {
          nextPlayer = 0;
        }

        let player = this.players.get(this.playersTurnOrder[nextPlayer]);

        if (player != null && player.alive === true) {
          this.playerTurn = this.playersTurnOrder[nextPlayer];

          // Delete handmaid in active cards if needed
          if (player.activeCards.includes(Cards.Handmaid)) {
            player.activeCards.splice(
              player.activeCards.indexOf(Cards.Handmaid),
              1,
            );
          }
          playerFound = true;
        }
      }
    }
  }

  public dispatchGameState(): void {
    this.lobby.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.GameState] = {
      lobbyId: this.lobby.id,
      players: JSON.stringify(this.players, replacer),
      discardedCard: this.discardedCard,
      lastPlayedCard: this.lastPlayedCard,
      playerTurn: this.playerTurn,
      playersTurnOrder: this.playersTurnOrder,
      deck: this.deck,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
