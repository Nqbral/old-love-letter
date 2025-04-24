import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cards, CardsNumber, CardsValue } from '@shared/common/Cards';
import { EventDescription, ResultEvent } from '@shared/common/EventDescription';
import { GameState } from '@shared/common/GameState';
import { replacer } from '@shared/common/JsonHelper';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { isString } from 'class-validator';
import { Socket } from 'socket.io';

import { PlayChancellorPartTwoDto } from '../dtos';

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

  public secondPlayedCard: Cards | undefined;

  public scoreToReach: number;

  public eventDescription: EventDescription;

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
        SocketExceptions.GameError,
        'This is not the turn of the player',
      );
    }

    let player = this.players.get(client.id);

    if (player != null) {
      let indexPlayerCardPlayed = player.cards.indexOf(card);

      if (indexPlayerCardPlayed != -1) {
        this.secondPlayedCard = undefined;

        switch (card) {
          case Cards.Spy:
            this.playSpyCard(player);
            break;
          case Cards.Guard:
            this.playGuardCard(
              player,
              data.playerIdTarget,
              data.cardTarget,
              data.noEffect,
            );
            break;
          case Cards.Priest:
            this.playPriestCard(player, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Baron:
            this.playBaronCard(player, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Handmaid:
            this.playHandmaidCard(player);
            break;
          case Cards.Prince:
            this.playPrinceCard(player, data.playerIdTarget);
            break;
          case Cards.Chancellor:
            this.playChancellorCard(player, indexPlayerCardPlayed);
            break;
          case Cards.King:
            this.playKingCard(player, data.playerIdTarget, data.noEffect);
            break;
          case Cards.Countess:
            this.eventDescription = EventDescription.fromCountess(player);
            break;
          case Cards.Princess:
            this.playPrincessCard(player);
            break;
        }

        if (card != Cards.Spy && card != Cards.Handmaid) {
          this.lastPlayedCard = card;
        }

        if (card != Cards.Chancellor) {
          this.nextTurn();
          this.playerDrawCard();
          if (player.cards.indexOf(card) != -1) {
            player.cards.splice(player.cards.indexOf(card), 1);
          }
        }

        this.dispatchGameState();

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

    this.eventDescription = EventDescription.fromSpy(player);
  }

  public playGuardCard(
    player: PlayerGame,
    playerIdTarget: string,
    cardTarget: Cards,
    noEffect: boolean,
  ) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined) {
      this.checkPlayerIsProtected(playerTargeted);
    }

    if (!noEffect) {
      if (playerTargeted != undefined) {
        if (playerTargeted.cards[0] == cardTarget) {
          this.killPlayer(playerIdTarget);
          this.secondPlayedCard = cardTarget;

          this.eventDescription = EventDescription.fromGuard(
            player,
            playerTargeted,
            ResultEvent.KillPlayer,
            cardTarget,
          );
          return;
        }

        this.eventDescription = EventDescription.fromGuard(
          player,
          playerTargeted,
          ResultEvent.GuardNotGuessed,
          cardTarget,
        );

        return;
      }
    }

    this.eventDescription = EventDescription.fromGuard(
      player,
      undefined,
      ResultEvent.NoEffect,
      undefined,
    );
  }

  public playPriestCard(
    player: PlayerGame,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined) {
      this.checkPlayerIsProtected(playerTargeted);
    }

    if (!noEffect) {
      if (playerTargeted != undefined) {
        const payload: ServerPayloads[ServerEvents.GamePriestPlayed] = {
          cardGuessed: playerTargeted.cards[0],
          playerGuessedName: playerTargeted.playerName,
          playerGuessedColor: playerTargeted.color,
        };
        this.lobby.dispatchToClient(
          player.id,
          ServerEvents.GamePriestPlayed,
          payload,
        );

        this.eventDescription = EventDescription.fromPriest(
          player,
          playerTargeted,
          undefined,
        );
        return;
      }
    }

    this.eventDescription = EventDescription.fromPriest(
      player,
      undefined,
      ResultEvent.NoEffect,
    );
  }

  public playBaronCard(
    player: PlayerGame,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined) {
      this.checkPlayerIsProtected(playerTargeted);
    }

    if (!noEffect) {
      if (player != undefined && playerTargeted != undefined) {
        let indexBaronPlayer = player.cards.indexOf(Cards.Baron);
        let indexOtherCards = 0;

        if (indexBaronPlayer == 0) {
          indexOtherCards = 1;
        }
        let myPlayerValue = CardsValue[player.cards[indexOtherCards]];
        let playerTargetedValue = CardsValue[playerTargeted.cards[0]];

        if (myPlayerValue > playerTargetedValue) {
          this.secondPlayedCard = playerTargeted.cards[0];
          this.eventDescription = EventDescription.fromBaron(
            player,
            playerTargeted,
            ResultEvent.VictoryBaron,
            playerTargeted.cards[0],
          );
          this.killPlayer(playerIdTarget);
          return;
        }

        if (myPlayerValue < playerTargetedValue) {
          this.secondPlayedCard = player.cards[indexOtherCards];
          this.eventDescription = EventDescription.fromBaron(
            player,
            playerTargeted,
            ResultEvent.LooseBaron,
            player.cards[indexOtherCards],
          );
          this.killPlayer(player.id);
          return;
        }

        this.eventDescription = EventDescription.fromBaron(
          player,
          playerTargeted,
          ResultEvent.DrawBaron,
          undefined,
        );

        return;
      }
    }

    this.eventDescription = EventDescription.fromBaron(
      player,
      playerTargeted,
      ResultEvent.NoEffect,
      undefined,
    );
  }

  public playHandmaidCard(player: PlayerGame) {
    player.activeCards.push(Cards.Handmaid);
    this.eventDescription = EventDescription.fromHandmaid(player);
  }

  public playPrinceCard(player: PlayerGame, playerIdTarget: string) {
    if (this.checkPlayerHasCard(player, Cards.Countess)) {
      throw new ServerException(
        SocketExceptions.GameError,
        "Can't play a prince while having a countess in the hand",
      );
    }

    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined && playerTargeted.id != player.id) {
      this.checkPlayerIsProtected(playerTargeted);
    }

    if (playerTargeted != undefined) {
      if (this.checkPlayerHasCard(playerTargeted, Cards.Princess)) {
        this.killPlayer(playerIdTarget);
        this.secondPlayedCard = Cards.Princess;
        this.eventDescription = EventDescription.fromPrince(
          player,
          playerTargeted,
          undefined,
          Cards.Princess,
        );

        return;
      }

      this.secondPlayedCard = playerTargeted.cards[0];

      if (
        player.id == playerTargeted.id &&
        player.cards.indexOf(Cards.Prince) == 0
      ) {
        this.secondPlayedCard = player.cards[1];
      }

      this.eventDescription = EventDescription.fromPrince(
        player,
        playerTargeted,
        this.secondPlayedCard,
        undefined,
      );

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
  }

  public playChancellorCard(player: PlayerGame, indexPlayerCardPlayed: number) {
    if (this.deck.length == 1) {
      let drawCard = this.deck.pop();

      if (drawCard != undefined && player != undefined) {
        player.cards.push(drawCard);
      }

      if (indexPlayerCardPlayed != -1) {
        player.cards.splice(indexPlayerCardPlayed, 1);
      }

      this.eventDescription = EventDescription.fromChancellor(player, 1);

      const payload: ServerPayloads[ServerEvents.GameChancellorPlayed] = {
        nbCardsToDiscard: 1,
        cards: player.cards,
      };

      this.lobby.dispatchToClient(
        player.id,
        ServerEvents.GameChancellorPlayed,
        payload,
      );

      return;
    }

    if (this.deck.length >= 2) {
      let drawCardOne = this.deck.pop();
      let drawCardTwo = this.deck.pop();

      if (drawCardOne != undefined && drawCardTwo != undefined) {
        player.cards.push(drawCardOne);
        player.cards.push(drawCardTwo);
      }

      if (indexPlayerCardPlayed != -1) {
        player.cards.splice(indexPlayerCardPlayed, 1);
      }

      const payload: ServerPayloads[ServerEvents.GameChancellorPlayed] = {
        nbCardsToDiscard: 2,
        cards: player.cards,
      };

      this.lobby.dispatchToClient(
        player.id,
        ServerEvents.GameChancellorPlayed,
        payload,
      );

      this.eventDescription = EventDescription.fromChancellor(player, 2);

      return;
    }

    this.eventDescription = EventDescription.fromChancellor(player, 0);

    this.nextTurn();
    this.playerDrawCard();
    if (player.cards.indexOf(Cards.Chancellor) != -1) {
      player.cards.splice(player.cards.indexOf(Cards.Chancellor), 1);
    }
  }

  public playChancellorPartTwo(
    clientId: string,
    data: PlayChancellorPartTwoDto,
  ) {
    let myPlayer = this.players.get(clientId);

    if (myPlayer != undefined) {
      data.indexCardsDiscarded.forEach((indexCardToDiscard) => {
        let card = myPlayer.cards[indexCardToDiscard];
        this.deck.unshift(card);
      });

      data.cardsDiscarded.forEach((cardDiscarded) => {
        myPlayer.cards.splice(myPlayer.cards.indexOf(cardDiscarded), 1);
      });

      this.eventDescription = EventDescription.fromChancellorPartTwo(
        myPlayer,
        data.indexCardsDiscarded.length,
      );

      this.nextTurn();
      this.playerDrawCard();
      this.dispatchGameState();
    }
  }

  public playKingCard(
    player: PlayerGame,
    playerIdTarget: string,
    noEffect: boolean,
  ) {
    if (this.checkPlayerHasCard(player, Cards.Countess)) {
      throw new ServerException(
        SocketExceptions.GameError,
        "Can't play a king while having a countess in the hand",
      );
    }

    let playerTargeted = this.players.get(playerIdTarget);

    if (playerTargeted != undefined) {
      this.checkPlayerIsProtected(playerTargeted);
    }

    if (!noEffect) {
      if (player != undefined && playerTargeted != undefined) {
        let myPlayerCard = player.cards.filter((card) => {
          return card != Cards.King;
        });

        player.cards = playerTargeted.cards;
        playerTargeted.cards = myPlayerCard;

        this.eventDescription = EventDescription.fromKing(
          player,
          playerTargeted,
          undefined,
        );
        return;
      }
    }

    this.eventDescription = EventDescription.fromKing(
      player,
      undefined,
      ResultEvent.NoEffect,
    );
  }

  public playPrincessCard(player: PlayerGame) {
    let indexPrincessPlayer = player.cards.indexOf(Cards.Baron);
    let indexOtherCards = 0;

    if (indexPrincessPlayer == 0) {
      indexOtherCards = 1;
    }

    this.secondPlayedCard = player.cards[indexOtherCards];

    this.killPlayer(player.id);

    this.eventDescription = EventDescription.fromPrincess(player);
  }

  public checkPlayerHasCard(player: PlayerGame, card: Cards): boolean {
    return player.cards.includes(card);
  }

  public checkPlayerHasActiveCard(player: PlayerGame, card: Cards): boolean {
    return player.activeCards.includes(card);
  }

  public checkPlayerIsProtected(player: PlayerGame): void {
    if (this.checkPlayerHasActiveCard(player, Cards.Handmaid)) {
      throw new ServerException(
        SocketExceptions.GameError,
        'The player targeted is protected by Handmaid.',
      );
    }
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
      eventDescription: this.eventDescription,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
