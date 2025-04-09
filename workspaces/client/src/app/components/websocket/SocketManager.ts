import { Listener } from './types';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerExceptionResponse } from '@love-letter/shared/server/types';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@mantine/notifications';

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

    console.log('on passe là');

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
        showNotification({
          message: 'Reconnected to server!',
          color: 'green',
          autoClose: 2000,
        });
        this.connectionLost = false;
        console.log('Reconnected to the server!');
      }
    });
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', async (reason: Socket.DisconnectReason) => {
      if (reason === 'io client disconnect') {
        showNotification({
          message: 'Disconnected successfully!',
          color: 'green',
          autoClose: 2000,
        });
        console.log('Disconnected successfully!');
      }

      if (reason === 'io server disconnect') {
        showNotification({
          message: 'You got disconnect by server',
          color: 'orange',
          autoClose: 3000,
        });
        console.log('You got disconnect by server');
      }

      if (
        reason === 'ping timeout' ||
        reason === 'transport close' ||
        reason === 'transport error'
      ) {
        showNotification({
          message: 'Connection lost to the server',
          color: 'orange',
          autoClose: 3000,
        });
        console.log('Connection lost to the server');
        this.connectionLost = true;
      }
    });
  }

  private onException(): void {
    this.socket.on('exception', (data: ServerExceptionResponse) => {
      if (typeof data.exception === 'undefined') {
        showNotification({
          message: 'Unexpected error from server',
          color: 'red',
        });

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

      showNotification({
        message: body,
        color: 'red',
      });
    });
  }
}
