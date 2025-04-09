import { ServerEvents } from "./ServerEvents";

export type ServerPayloads = {
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    hasStarted: boolean;
    hasFinished: boolean;
    playersCount: number;
    isSuspended: boolean;
    scores: Record<string, number>;
  };

  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.Pong]: {};
};
