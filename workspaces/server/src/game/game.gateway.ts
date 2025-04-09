import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection {
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    // From here, you can verify if the user is authenticated correctly.
    // You can perform whatever operation (database call, token check, ...).
    // You can disconnect the client if it didn't match authentication criteria.
    // You can also perform other operations, such as initializing socket attached data
    // or whatever you would like upon connection.
  }

  /** Handle client events */
  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: Socket): WsResponse<{ message: string }> {
    // This is the NestJS way of returning data to the exact same client, notice the return type as well
    console.log('ping');
    return {
      event: ServerEvents.Pong,
      data: {
        message: 'pong',
      },
    };
  }
}
