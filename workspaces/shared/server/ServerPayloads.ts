import { Cards } from "../common/Cards";
import { GameState } from "../common/GameState";
import { PlayerLobby } from "../common/Player";
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
    maxClients: number;
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

  [ServerEvents.GamePriestPlayed]: {
    cardGuessed: Cards;
    playerGuessedName: string;
    playerGuessedColor: string;
  };

  [ServerEvents.GameState]: {
    lobbyId: string;
    players: string;
    discardedCard: Cards | undefined;
    lastPlayedCard: Cards | undefined;
    playerTurn: string;
    playersTurnOrder: string[];
    deck: Cards[];
  };
};
