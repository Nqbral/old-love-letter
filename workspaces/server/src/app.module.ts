import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    GameModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
