export enum ClientEvents {
  // General
  Ping = "client.ping",

  // Lobby
  LobbyCreate = "client.lobby.create",
  LobbyJoin = "client.lobby.join",
  LobbyLeave = "client.lobby.leave",
  LobbyDelete = "client.lobby.delete",

  // Player
  PlayerRename = "client.player.remame",

  // Game
  StartGame = "client.game.start",
  GetGameState = "client.game.get.state",
  GamePlayCard = "client.game.play_card",
}
