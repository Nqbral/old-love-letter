import { Cards } from "../common/Cards";
import { GameState } from "../common/GameState";
import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  // Lobby
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    gameState: GameState;
    playersCount: number;
    players: [string, string][];
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

  [ServerEvents.GameState]: {
    lobbyId: string;
    players: [string, string][];
    playersCard: [string, Cards[]][];
    discardedCard: string;
    lastPlayedCard: string;
    playerTurn: string;
  };
};
