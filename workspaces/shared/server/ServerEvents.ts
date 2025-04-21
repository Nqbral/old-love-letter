export enum ServerEvents {
  // General
  Pong = "server.pong",

  // Lobby
  LobbyState = "server.lobby.state",
  LobbyDelete = "server.lobby.delete",

  // Game
  GameMessage = "server.game.message",
  GameState = "server.game.state",
  GamePriestPlayed = "server.game.priest.played",

  // Exceptions
  LobbyError = "server.lobby.error",
}
