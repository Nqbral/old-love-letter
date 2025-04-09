import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cron } from '@nestjs/schedule';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server } from 'socket.io';

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

  public createLobby(
    nbPlayers: number,
    owner: AuthenticatedSocket,
    namePlayer: string,
  ): Lobby {
    const lobby = new Lobby(this.server, nbPlayers, owner, namePlayer);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      this.server.to(client.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby not found',
        message: 'Aucune partie a été trouvée pour cette URL.',
      });
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    if (lobby.clients.size >= lobby.maxClients) {
      this.server.to(client.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby full',
        message: 'La partie est déjà pleine.',
      });
      throw new ServerException(
        SocketExceptions.LobbyError,
        'Lobby already full',
      );
    }

    lobby.addClient(client);
  }

  public renamePlayer(
    lobbyId: string,
    client: AuthenticatedSocket,
    playerName: string,
  ): void {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby) {
      this.server.to(client.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby not found',
        message: 'Aucune partie a été trouvée pour cette URL.',
      });
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    lobby.addPlayerName(client, playerName);
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
