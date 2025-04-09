import { IsInt, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
  @IsInt()
  @Min(2)
  @Max(6)
  nbPlayers: 6;

  @IsString()
  namePlayer: string;
}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;

  @IsString()
  namePlayer: string;
}
