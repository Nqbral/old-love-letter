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
  GamePlaySpy = "client.game.play_spy",
  GamePlayGuard = "client.game.play_guard",
  GamePlayPriest = "client.game.play_priest",
  GamePlayBaron = "client.game.play_baron",
  GamePlayHandmaid = "client.game.play_handmaid",
  GamePlayPrince = "client.game.play_prince",
  GamePlayChancellor = "client.game.play_chancellor",
  GamePlayChancellorPartTwo = "client.game.play_chancellor_part_two",
  GamePlayKing = "client.game.play_king",
  GamePlayCountess = "client.game.play_countess",
  GamePlayPrincess = "client.game.play_princess",
}
