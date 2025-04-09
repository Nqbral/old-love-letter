import { Instance } from '@app/game/instance/instance';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

export class Lobby {
  public readonly id: string = v4();

  public readonly createdAt: Date = new Date();

  public clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public players: Map<string, string> = new Map<string, string>();

  public readonly instance: Instance = new Instance(this);

  public ownerName: string;

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
    public readonly owner: AuthenticatedSocket,
    ownername: string,
  ) {
    this.ownerName = ownername;
    this.players.set(owner.id, ownername);
  }

  public addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;

    this.dispatchLobbyState();
  }

  public addPlayerName(client: AuthenticatedSocket, playerName: string): void {
    this.players.set(client.id, playerName);
    client.data.lobby = this;

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);

    // Alert the remaining player that client left lobby
    this.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        message: 'Opponent left lobby',
      },
    );

    this.dispatchLobbyState();
  }

  public deleteLobby(client: AuthenticatedSocket) {
    if (client.id != this.owner.id) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Only the owner of the lobby can delete it',
      );
    }

    this.clients.clear();
    this.players.clear();
    client.data.lobby = null;

    this.instance.triggerFinish();

    this.dispatchLobbyState();
  }

  public dispatchLobbyState(): void {
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      gameState: this.instance.gameState,
      playersCount: this.clients.size,
      scores: this.instance.scores,
      players: Array.from(this.players.entries()),
      ownerName: this.ownerName,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
