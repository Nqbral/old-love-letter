import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class LobbyCreateDto {}

export class LobbyJoinDto {
  @IsString()
  lobbyId: string;
}
