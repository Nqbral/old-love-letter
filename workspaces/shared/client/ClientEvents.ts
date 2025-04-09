export enum ClientEvents {
  // General
  Ping = "client.ping",

  // Lobby
  LobbyCreate = "client.lobby.create",
  LobbyJoin = "client.lobby.join",
  LobbyLeave = "client.lobby.leave",

  // Player
  PlayerRename = "client.player.remame",

  // Game
  GamePlayCard = "client.game.play_card",
}
