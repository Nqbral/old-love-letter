import { Socket } from "socket.io";

export type PlayerLobby = {
  id: Socket["id"];
  playerName: string;
  color: string;
};
