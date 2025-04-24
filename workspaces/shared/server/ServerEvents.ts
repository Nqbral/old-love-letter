export enum ServerEvents {
  // General
  Pong = "server.pong",

  // Lobby
  LobbyState = "server.lobby.state",
  LobbyDelete = "server.lobby.delete",

  // Game
  GameMessage = "server.game.message",
  GameMessageGuardNotGuessed = "server.game.message.guard.not_guessed",
  GameMessageGuardKill = "server.game.message.guard.kill",
  GameMessagePriest = "server.game.message.priest",
  GameMessageBaronSelf = "server.game.message.baron_self",
  GameMessageBaronTarget = "server.game.message.baron_target",
  GameMessagePrince = "server.game.message.prince",
  GameMessageKingSelf = "server.game.message.king_self",
  GameMessageKingTarget = "server.game.message.king_target",
  GameState = "server.game.state",
  GamePriestPlayed = "server.game.priest.played",
  GameChancellorPlayed = "server.game.chancellor.played",

  // Exceptions
  LobbyError = "server.lobby.error",
}
