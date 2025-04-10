import { GameState } from "../common/GameState";
import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    gameState: GameState;
    playersCount: number;
    players: [string, string][];
    ownerId: string;
    ownerName: string;
    maxClients: number;
  };

  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.LobbyError]: {
    error: string;
    message: string;
  };

  [ServerEvents.LobbyDelete]: {
    message: string;
  };

  [ServerEvents.Pong]: {};
};
