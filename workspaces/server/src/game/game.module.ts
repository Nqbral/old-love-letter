import { LobbyManager } from '@app/game/lobby/lobby.manager';
import { Module } from '@nestjs/common';

import { GameGateway } from './game.gateway';

@Module({
  providers: [
    // Gateways
    GameGateway,

    // Managers
    LobbyManager,
  ],
})
export class GameModule {}
