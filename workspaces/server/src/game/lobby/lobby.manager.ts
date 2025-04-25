import { LOBBY_MAX_LIFETIME } from '@app/game/constants';
import { Lobby } from '@app/game/lobby/lobby';
import { ServerException } from '@app/game/server.exception';
import { AuthenticatedSocket } from '@app/game/types';
import { Cron } from '@nestjs/schedule';
import { Cards } from '@shared/common/Cards';
import { GameState } from '@shared/common/GameState';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { SocketExceptions } from '@shared/server/SocketExceptions';
import { Server } from 'socket.io';

import {
  PlayBaronGameDto,
  PlayCardGameDto,
  PlayChancellorPartTwoDto,
} from '../dtos';

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

  public createLobby(owner: AuthenticatedSocket, lobbyName: string): Lobby {
    const lobby = new Lobby(this.server, owner, lobbyName);

    this.lobbies.set(lobby.id, lobby);

    return lobby;
  }

  protected getLobby(lobbyId: string, client: AuthenticatedSocket): Lobby {
    const lobby = this.lobbies.get(lobbyId);

    if (!lobby || lobby.instance.gameState === GameState.GameDeleted) {
      this.server.to(client.id).emit(ServerEvents.LobbyError, {
        error: 'Lobby not found',
        message: 'Aucune partie a été trouvée pour cette URL.',
      });
      throw new ServerException(SocketExceptions.LobbyError, 'Lobby not found');
    }

    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.getLobby(lobbyId, client);

    if (lobby.clients.size >= 6) {
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

  public leaveLobby(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.leaveLobby(client);
  }

  public deleteLobby(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.deleteLobby(client, false);
    this.lobbies.delete(lobbyId);
  }

  public renamePlayer(
    lobbyId: string,
    client: AuthenticatedSocket,
    playerName: string,
  ): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.addPlayerName(client, playerName);
  }

  public startGame(lobbyId: string, client: AuthenticatedSocket): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.instance.triggerStart(client);
  }

  public playCard(
    lobbyId: string,
    card: Cards,
    client: AuthenticatedSocket,
    data,
  ): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.instance.playCard(client, card, data);
  }

  public playChancellorPartTwo(
    lobbyId: string,
    client: AuthenticatedSocket,
    data: PlayChancellorPartTwoDto,
  ): void {
    const lobby = this.getLobby(lobbyId, client);

    lobby.instance.playChancellorPartTwo(client.id, data);
  }

  // Periodically clean up lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleaner(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyUpdatedAt = lobby.updatedAt.getTime();
      const lobbyLifetime = now - lobbyUpdatedAt;

      if (lobby.instance.gameState === GameState.GameDeleted) {
        this.lobbies.delete(lobby.id);
        return;
      }

      if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
          ServerEvents.GameMessage,
          {
            message: 'Game timed out',
          },
        );

        lobby.instance.gameState = GameState.GameDeleted;

        lobby.deleteLobby(undefined, true);
      }
    }
  }
}
