import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {
  @IsInt()
  @Min(2)
  @Max(6)
  numberPlayers: number;
}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;
}
