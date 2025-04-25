import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cards, CardsNumber, CardsValue } from '@shared/common/Cards';
import { EventDescription, ResultEvent } from '@shared/common/EventDescription';
import { GameState } from '@shared/common/GameState';
import { replacer } from '@shared/common/JsonHelper';
import { PlayerGame } from '@shared/common/Player';
import { RoundRecap } from '@shared/common/RoundRecap';
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

  public eventDescription: EventDescription | undefined;

  public roundRecap: RoundRecap | undefined;

  public ownerId: Socket['id'];

  constructor(private readonly lobby: Lobby) {
    this.ownerId = lobby.owner.id;
  }

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

    if (Array.from(this.lobby.players.values()).length < 2) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'There is not enough players',
      );
    }

    if (Array.from(this.lobby.players.values()).length > 6) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'There is too much players',
      );
    }

    this.gameState = GameState.GameStart;
    this.roundRecap = undefined;

    this.initPlayers();
    this.initializeCards();
    this.initializeTurns();
    this.initScoreToReach();
    this.setRandomTurn();
    this.playerDrawCard();

    this.lobby.dispatchLobbyState();
    this.dispatchGameState();
  }

  private initializeCards(): void {
    const cards = Object.values(Cards).filter((c) => isString(c)) as Cards[];
    this.deck = [];
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
    this.players.forEach((playerGame) => {
      let card = this.deck.pop();

      if (card != undefined) {
        playerGame.cards = [card];
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

      const payloadMessage: ServerPayloads[ServerEvents.GameMessageDrawCard] = {
        card: card,
      };

      this.lobby.dispatchToClient(
        player.id,
        ServerEvents.GameMessageDrawCard,
        payloadMessage,
      );
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
          if (player.cards.indexOf(card) != -1) {
            player.cards.splice(player.cards.indexOf(card), 1);
          }

          if (this.checkEndRound()) {
            this.endRound();
            return;
          }
          this.nextTurn();
          this.playerDrawCard();
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

          const payloadMessage: ServerPayloads[ServerEvents.GameMessageGuardKill] =
            {
              player: player,
              cardGuessed: cardTarget,
            };

          this.lobby.dispatchToClient(
            playerTargeted.id,
            ServerEvents.GameMessageGuardKill,
            payloadMessage,
          );
          return;
        }

        this.eventDescription = EventDescription.fromGuard(
          player,
          playerTargeted,
          ResultEvent.GuardNotGuessed,
          cardTarget,
        );

        const payloadMessage: ServerPayloads[ServerEvents.GameMessageGuardNotGuessed] =
          {
            player: player,
            cardGuessed: cardTarget,
          };

        this.lobby.dispatchToClient(
          playerTargeted.id,
          ServerEvents.GameMessageGuardNotGuessed,
          payloadMessage,
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

        const payloadMessage: ServerPayloads[ServerEvents.GameMessagePriest] = {
          player: player,
          card: playerTargeted.cards[0],
        };

        this.lobby.dispatchToClient(
          playerTargeted.id,
          ServerEvents.GameMessagePriest,
          payloadMessage,
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
          const payloadMessageSelf: ServerPayloads[ServerEvents.GameMessageBaronSelf] =
            {
              playerTargeted: playerTargeted,
              cardPlayer: player.cards[indexOtherCards],
              cardPlayerTargeted: playerTargeted.cards[0],
              result: ResultEvent.VictoryBaron,
            };

          const payloadMessageTarget: ServerPayloads[ServerEvents.GameMessageBaronTarget] =
            {
              player: player,
              cardPlayer: player.cards[indexOtherCards],
              cardPlayerTargeted: playerTargeted.cards[0],
              result: ResultEvent.LooseBaron,
            };

          this.secondPlayedCard = playerTargeted.cards[0];
          this.eventDescription = EventDescription.fromBaron(
            player,
            playerTargeted,
            ResultEvent.VictoryBaron,
            playerTargeted.cards[0],
          );

          this.lobby.dispatchToClient(
            player.id,
            ServerEvents.GameMessageBaronSelf,
            payloadMessageSelf,
          );

          this.lobby.dispatchToClient(
            playerTargeted.id,
            ServerEvents.GameMessageBaronTarget,
            payloadMessageTarget,
          );
          this.killPlayer(playerIdTarget);
          return;
        }

        if (myPlayerValue < playerTargetedValue) {
          const payloadMessageSelf: ServerPayloads[ServerEvents.GameMessageBaronSelf] =
            {
              playerTargeted: playerTargeted,
              cardPlayer: player.cards[indexOtherCards],
              cardPlayerTargeted: playerTargeted.cards[0],
              result: ResultEvent.LooseBaron,
            };

          const payloadMessageTarget: ServerPayloads[ServerEvents.GameMessageBaronTarget] =
            {
              player: player,
              cardPlayer: player.cards[indexOtherCards],
              cardPlayerTargeted: playerTargeted.cards[0],
              result: ResultEvent.VictoryBaron,
            };

          this.secondPlayedCard = player.cards[indexOtherCards];
          this.eventDescription = EventDescription.fromBaron(
            player,
            playerTargeted,
            ResultEvent.LooseBaron,
            player.cards[indexOtherCards],
          );

          this.lobby.dispatchToClient(
            player.id,
            ServerEvents.GameMessageBaronSelf,
            payloadMessageSelf,
          );

          this.lobby.dispatchToClient(
            playerTargeted.id,
            ServerEvents.GameMessageBaronTarget,
            payloadMessageTarget,
          );
          this.killPlayer(player.id);
          return;
        }

        const payloadMessageSelf: ServerPayloads[ServerEvents.GameMessageBaronSelf] =
          {
            playerTargeted: playerTargeted,
            cardPlayer: player.cards[indexOtherCards],
            cardPlayerTargeted: playerTargeted.cards[0],
            result: ResultEvent.DrawBaron,
          };

        const payloadMessageTarget: ServerPayloads[ServerEvents.GameMessageBaronTarget] =
          {
            player: player,
            cardPlayer: player.cards[indexOtherCards],
            cardPlayerTargeted: playerTargeted.cards[0],
            result: ResultEvent.DrawBaron,
          };

        this.eventDescription = EventDescription.fromBaron(
          player,
          playerTargeted,
          ResultEvent.DrawBaron,
          undefined,
        );

        this.lobby.dispatchToClient(
          player.id,
          ServerEvents.GameMessageBaronSelf,
          payloadMessageSelf,
        );

        this.lobby.dispatchToClient(
          playerTargeted.id,
          ServerEvents.GameMessageBaronTarget,
          payloadMessageTarget,
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
        this.secondPlayedCard = Cards.Princess;
        this.eventDescription = EventDescription.fromPrince(
          player,
          playerTargeted,
          undefined,
          Cards.Princess,
        );

        const payloadMessage: ServerPayloads[ServerEvents.GameMessagePrince] = {
          player: player,
          playerTargeted: playerTargeted,
          lostCard: Cards.Princess,
          drawedCard: undefined,
          killedPlayer: true,
        };

        this.lobby.dispatchToClient(
          playerTargeted.id,
          ServerEvents.GameMessagePrince,
          payloadMessage,
        );

        this.killPlayer(playerIdTarget);

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
      let drawedCard;

      if (this.deck.length == 0) {
        if (this.discardedCard != undefined) {
          drawedCard = this.discardedCard;
          playerTargeted.cards = [drawedCard];
        }

        this.discardedCard = undefined;
      } else {
        drawedCard = this.deck.pop();

        if (drawedCard != undefined) {
          playerTargeted.cards = [drawedCard];
        }
      }

      const payloadMessage: ServerPayloads[ServerEvents.GameMessagePrince] = {
        player: player,
        playerTargeted: playerTargeted,
        lostCard: this.secondPlayedCard,
        drawedCard: drawedCard,
        killedPlayer: false,
      };

      this.lobby.dispatchToClient(
        playerTargeted.id,
        ServerEvents.GameMessagePrince,
        payloadMessage,
      );
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

    if (player.cards.indexOf(Cards.Chancellor) != -1) {
      player.cards.splice(player.cards.indexOf(Cards.Chancellor), 1);
    }

    if (this.checkEndRound()) {
      this.endRound();
      return;
    }

    this.nextTurn();
    this.playerDrawCard();
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

        const payloadMessageSelf: ServerPayloads[ServerEvents.GameMessageKingSelf] =
          {
            playerTargeted: playerTargeted,
            cardPlayer: myPlayerCard[0],
            cardPlayerTargeted: playerTargeted.cards[0],
          };

        const payloadMessageTarget: ServerPayloads[ServerEvents.GameMessageKingTarget] =
          {
            player: player,
            cardPlayer: myPlayerCard[0],
            cardPlayerTargeted: playerTargeted.cards[0],
          };

        player.cards = playerTargeted.cards;
        playerTargeted.cards = myPlayerCard;

        this.lobby.dispatchToClient(
          player.id,
          ServerEvents.GameMessageKingSelf,
          payloadMessageSelf,
        );

        this.lobby.dispatchToClient(
          playerTargeted.id,
          ServerEvents.GameMessageKingTarget,
          payloadMessageTarget,
        );

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
    let indexPrincessPlayer = player.cards.indexOf(Cards.Princess);
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

  public launchNextRound(client: AuthenticatedSocket): void {
    if (client.id != this.lobby.owner.id) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Only the owner of the lobby can start the game',
      );
    }

    this.initializeCards();

    if (this.roundRecap != undefined) {
      this.playerTurn = this.roundRecap.getPlayerFromWinner().id;
    }

    Array.from(this.players.values()).forEach((player) => {
      player.alive = true;
      player.activeCards = [];
    });

    this.playerDrawCard();
    this.lastPlayedCard = undefined;
    this.secondPlayedCard = undefined;
    this.eventDescription = undefined;
    this.gameState = GameState.GameStart;
    this.roundRecap = undefined;

    this.dispatchGameState();
  }

  public relaunchGame(client: AuthenticatedSocket): void {
    if (client.id != this.lobby.owner.id) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Only the owner of the lobby can start the game',
      );
    }

    this.initPlayers();
    this.initializeCards();
    this.initializeTurns();
    this.setRandomTurn();
    this.playerDrawCard();

    this.lastPlayedCard = undefined;
    this.secondPlayedCard = undefined;
    this.gameState = GameState.GameStart;
    this.eventDescription = undefined;

    this.dispatchGameState();
  }

  public checkEndRound(): boolean {
    let playersAlive = Array.from(this.players.values()).filter((player) => {
      return player.alive;
    });

    return playersAlive.length < 2 || this.deck.length == 0;
  }

  public endRound(): void {
    let roundRecap = new RoundRecap(
      Array.from(this.players.values()),
      this.scoreToReach,
      this.eventDescription,
    );

    roundRecap.calculateScoreByValue();
    roundRecap.calculateScoreBySpy();

    this.gameState = GameState.GameRoundFinished;

    if (roundRecap.checkEndGame()) {
      this.gameState = GameState.GameFinished;
    }

    this.roundRecap = roundRecap;

    this.dispatchGameState();
  }

  public dispatchGameState(): void {
    this.lobby.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.GameState] = {
      lobbyId: this.lobby.id,
      players: JSON.stringify(this.players, replacer),
      discardedCard: this.discardedCard,
      lastPlayedCard: this.lastPlayedCard,
      secondPlayedCard: this.secondPlayedCard,
      playerTurn: this.playerTurn,
      playersTurnOrder: this.playersTurnOrder,
      deck: this.deck,
      eventDescription: this.eventDescription,
      roundRecap: this.roundRecap,
      gameState: this.gameState,
      ownerId: this.ownerId,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, payload);
  }
}
