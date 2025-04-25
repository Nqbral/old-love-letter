import { Cards } from "../common/Cards";
import { EventDescription, ResultEvent } from "../common/EventDescription";
import { GameState } from "../common/GameState";
import { PlayerGame, PlayerLobby } from "../common/Player";
import { RoundRecap } from "../common/RoundRecap";
import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  // Lobby
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    lobbyName: string;
    gameState: GameState;
    playersCount: number;
    players: string;
    ownerId: string;
    ownerName: string;
  };

  [ServerEvents.LobbyError]: {
    error: string;
    message: string;
  };

  [ServerEvents.LobbyDelete]: {
    message: string;
  };

  [ServerEvents.Pong]: {};

  // Game
  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.GameMessageDrawCard]: {
    card: Cards | undefined;
  };

  [ServerEvents.GameMessageGuardNotGuessed]: {
    player: PlayerGame;
    cardGuessed: Cards;
  };

  [ServerEvents.GameMessageGuardKill]: {
    player: PlayerGame;
    cardGuessed: Cards;
  };

  [ServerEvents.GameMessagePriest]: {
    player: PlayerGame;
    card: Cards;
  };

  [ServerEvents.GameMessageBaronSelf]: {
    playerTargeted: PlayerGame;
    cardPlayer: Cards;
    cardPlayerTargeted: Cards;
    result: ResultEvent;
  };

  [ServerEvents.GameMessageBaronTarget]: {
    player: PlayerGame;
    cardPlayer: Cards;
    cardPlayerTargeted: Cards;
    result: ResultEvent;
  };

  [ServerEvents.GameMessagePrince]: {
    player: PlayerGame;
    playerTargeted: PlayerGame;
    lostCard: Cards;
    drawedCard: Cards | undefined;
    killedPlayer: boolean;
  };

  [ServerEvents.GameMessageKingSelf]: {
    playerTargeted: PlayerGame;
    cardPlayer: Cards;
    cardPlayerTargeted: Cards;
  };

  [ServerEvents.GameMessageKingTarget]: {
    player: PlayerGame;
    cardPlayer: Cards;
    cardPlayerTargeted: Cards;
  };

  [ServerEvents.GamePriestPlayed]: {
    cardGuessed: Cards;
    playerGuessedName: string;
    playerGuessedColor: string;
  };

  [ServerEvents.GameChancellorPlayed]: {
    nbCardsToDiscard: number;
    cards: Cards[];
  };

  [ServerEvents.GameState]: {
    lobbyId: string;
    players: string;
    discardedCard: Cards | undefined;
    lastPlayedCard: Cards | undefined;
    secondPlayedCard: Cards | undefined;
    playerTurn: string;
    playersTurnOrder: string[];
    deck: Cards[];
    eventDescription: EventDescription | undefined;
    roundRecap: RoundRecap | undefined;
    gameState: GameState;
  };
};
