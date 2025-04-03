import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway {
  /** Handle client events */
  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: Socket): WsResponse<{ message: string }> {
    // This is the NestJS way of returning data to the exact same client, notice the return type as well
    return {
      event: ServerEvents.Pong,
      data: {
        message: 'pong',
      },
    };
  }
}
