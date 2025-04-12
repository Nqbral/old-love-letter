import { Instance } from '@app/game/instance/instance';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { GameState } from '@shared/common/GameState';
import { replacer } from '@shared/common/JsonHelper';
import { PlayerLobby } from '@shared/common/Player';
import { PLAYER_COLORS } from '@shared/common/PlayerColor';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server, Socket } from 'socket.io';
import { v4 } from 'uuid';

export class Lobby {
  public readonly id: string = v4();

  public updatedAt: Date = new Date();

  public clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public players: Map<Socket['id'], PlayerLobby> = new Map<
    Socket['id'],
    PlayerLobby
  >();

  public readonly instance: Instance = new Instance(this);

  public ownerName: string;

  constructor(
    private readonly server: Server,
    public readonly maxClients: number,
    public readonly owner: AuthenticatedSocket,
    public readonly lobbyName: string,
  ) {}

  public addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);

    client.join(this.id);
    client.data.lobby = this;

    this.dispatchLobbyState();
  }

  public addPlayerName(client: AuthenticatedSocket, playerName: string): void {
    let player = this.players.get(client.id);

    this.players.set(client.id, {
      id: client.id,
      playerName: playerName,
      color: PLAYER_COLORS[Array.from(this.players.keys()).length],
    });

    if (player != null) {
      this.players.set(client.id, player);
    }
    client.data.lobby = this;

    this.dispatchLobbyState();
  }

  public leaveLobby(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    this.players.delete(client.id);

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    if (client.id !== this.owner.id) {
      this.leaveLobby(client);
      return;
    }

    this.deleteLobby(client);
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
    this.instance.gameState = GameState.GameDeleted;

    this.server.to(this.id).emit(ServerEvents.LobbyDelete, {
      message: 'La partie a été supprimée.',
    });
  }

  public dispatchLobbyState(): void {
    this.updatedAt = new Date();
    const payload: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      lobbyName: this.lobbyName,
      gameState: this.instance.gameState,
      playersCount: this.clients.size,
      players: JSON.stringify(this.players, replacer),
      ownerName: this.ownerName,
      ownerId: this.owner.id,
      maxClients: this.maxClients,
    };

    this.dispatchToLobby(ServerEvents.LobbyState, payload);
  }

  public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }
}
