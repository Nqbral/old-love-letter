import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { Lobby } from '@app/game/lobby/lobby';
import { AuthenticatedSocket } from '@app/game/types';
import { Cron } from '@nestjs/schedule';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server } from 'socket.io';

import { ServerException } from '../../../server.exceptions';

export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public initializeSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(): Lobby {
    const lobby = new Lobby(this.server, 3);

    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby already full',
      );
    }

    lobby.addClient(client);
  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
          ServerEvents.GameMessage,
          {
            message: 'Game timed out',
          },
        );

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}
