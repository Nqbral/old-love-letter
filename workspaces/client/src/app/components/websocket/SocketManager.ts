import { Listener } from './types';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerExceptionResponse } from '@love-letter/shared/server/types';
import { io, Socket } from 'socket.io-client';

type EmitOptions<T> = {
  event: ClientEvents;
  data?: T;
};

export default class SocketManager {
  public readonly socket: Socket;

  private connectionLost: boolean = false;

  constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_WS_API_URL as string, {
      autoConnect: false,
      path: '/wsapi',
      transports: ['websocket'],
      withCredentials: true,
    });

    this.onConnect();
    this.onDisconnect();
    this.onException();
  }

  emit<T>(options: EmitOptions<T>): this {
    this.socket.emit(options.event, options.data);

    return this;
  }

  getSocketId(): string | undefined {
    if (!this.socket.connected) {
      return undefined;
    }

    return this.socket.id;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.on(event, listener);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.off(event, listener);

    return this;
  }

  private onConnect(): void {
    this.socket.on('connect', () => {
      if (this.connectionLost) {
        console.log('Reconnected to server!');
      }
    });
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', async (reason: Socket.DisconnectReason) => {
      if (reason === 'io client disconnect') {
        console.log('Disconnected succesfully!');
      }

      if (reason === 'io server disconnect') {
        console.log('You got disconnect by server');
      }

      if (
        reason === 'ping timeout' ||
        reason === 'transport close' ||
        reason === 'transport error'
      ) {
        console.log('Connection lost to the server');
        this.connectionLost = true;
      }
    });
  }

  private onException(): void {
    this.socket.on('exception', (data: ServerExceptionResponse) => {
      if (typeof data.exception === 'undefined') {
        console.log('Unexpected error from server');

        return;
      }

      let body = `Error: ${data.exception}`;

      if (data.message) {
        if (typeof data.message === 'string') {
          body += ` | Message: "${data.message}"`;
        } else if (typeof data.message === 'object') {
          body += ` | Message: "${JSON.stringify(data.message)}"`;
        }
      }

      console.log(body);
    });
  }
}
