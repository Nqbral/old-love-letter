import { Socket } from "socket.io";
import { Cards } from "./Cards";

export type PlayerLobby = {
  id: Socket["id"];
  playerName: string;
  color: string;
};

export type PlayerGame = {
  id: Socket["id"];
  playerName: string;
  color: string;
  score: number;
  cards: Cards[];
  activeCards: Cards[];
};
