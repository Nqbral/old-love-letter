export enum ServerEvents {
  // General
  Pong = "server.pong",

  // Lobby
  LobbyState = "server.lobby.state",
  LobbyDelete = "server.lobby.delete",

  // Game
  GameMessage = "server.game.message",

  // Exceptions
  LobbyError = "server.lobby.error",
}
