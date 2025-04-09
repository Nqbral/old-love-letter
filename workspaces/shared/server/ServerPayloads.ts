import { GameState } from "../common/GameState";
import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    gameState: GameState;
    playersCount: number;
    players: [string, string][];
    scores: Record<string, number>;
    ownerName: string;
  };

  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.LobbyError]: {
    error: string;
    message: string;
  };

  [ServerEvents.Pong]: {};
};
