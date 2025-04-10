import { IsInt, IsString, Max, Min } from 'class-validator';

//Lobby
export class LobbyCreateDto {
  @IsInt()
  @Min(2)
  @Max(6)
  nbPlayers: number;

  @IsString()
  playerName: string;
}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;
}

export class LobbyRenamePlayerDto {
  @IsString()
  lobbyId: string;

  @IsString()
  playerName: string;
}

export class LobbyDeleteDto {
  @IsString()
  lobbyId: string;
}

//Game
export class StartGameDto {
  @IsString()
  lobbyId: string;
}
