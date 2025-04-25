import PrimaryButton from '@components/buttons/PrimaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import ModalTemplate from '@components/modal/ModalTemplate';
import { faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClientEvents } from '@shared/client/ClientEvents';
import { GameState } from '@shared/common/GameState';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

import EventDescriptionDisplay from '../EventDescriptionDisplay';
import LastPlayedCard from '../deck/LastPlayedCard';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function ModalRecapRound({ gameState }: Props) {
  const { sm } = useSocketManager();
  const isOwner = sm.getSocketId() === gameState?.ownerId;

  const launchNextRound = () => {
    sm.emit({
      event: ClientEvents.GameLaunchNextRound,
      data: {
        lobbyId: gameState.lobbyId,
      },
    });
  };

  const relaunchGame = () => {
    sm.emit({
      event: ClientEvents.GameRelaunchGame,
      data: {
        lobbyId: gameState.lobbyId,
      },
    });
  };

  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">
          Récapitulatif de manche
        </h2>
        <div className="flex flex-col gap-4">
          <h3 className="font-bold underline">Cartes des joueurs en lice</h3>
          <div className="flex flex-row items-center justify-center gap-2">
            {gameState.roundRecap?.playersAlive.map((player) => {
              return (
                <div
                  className="flex flex-col gap-2"
                  key={'recap-round-player-card-' + player.id}
                >
                  <div className={player.color}>{player.playerName}</div>
                  <LastPlayedCard card={player.cards[0]} />
                </div>
              );
            })}
          </div>
          {gameState.roundRecap?.playersWhoWinByValue.length == 1 && (
            <div>
              Le joueur ayant gagné avec la carte ayant la plus grande valeur
              est :{' '}
              <span
                className={gameState.roundRecap.playersWhoWinByValue[0].color}
              >
                {gameState.roundRecap.playersWhoWinByValue[0].playerName}
              </span>
            </div>
          )}
          {gameState.roundRecap?.playersWhoWinByValue.length != undefined &&
            gameState.roundRecap?.playersWhoWinByValue.length >= 2 && (
              <div>
                Les joueurs ayant gagné avec la carte ayant la plus grande
                valeur sont :
                {gameState.roundRecap?.playersWhoWinByValue.map(
                  (player, index) => {
                    if (index == 0) {
                      return (
                        <span
                          key={'player-win-by-value-' + player.id}
                          className={player.color}
                        >
                          {player.playerName}
                        </span>
                      );
                    }

                    if (
                      gameState.roundRecap?.playersWhoWinByValue.length !=
                        undefined &&
                      index ==
                        gameState.roundRecap?.playersWhoWinByValue.length - 1
                    ) {
                      return (
                        <>
                          {', '}
                          <span
                            key={'player-win-by-value-' + player.id}
                            className={player.color}
                          >
                            {player.playerName}
                          </span>
                          .
                        </>
                      );
                    }

                    return (
                      <>
                        {', '}
                        <span
                          key={'player-win-by-value-' + player.id}
                          className={player.color}
                        >
                          {player.playerName}
                        </span>
                      </>
                    );
                  },
                )}
              </div>
            )}
        </div>
        {gameState.roundRecap?.playerWhoWinBySpy != undefined && (
          <div>
            Le seul joueur en lice ayant une{' '}
            <span className="font-bold">Espionne</span> active est :{' '}
            <span className={gameState.roundRecap?.playerWhoWinBySpy.color}>
              {gameState.roundRecap?.playerWhoWinBySpy.playerName}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold underline">Récapitulatif des scores</h3>
          <table>
            <tbody>
              <tr>
                <td className="min-w-12 border-2 border-slate-700 px-3 py-2 text-center">
                  <FontAwesomeIcon icon={faUser} color="#8d9eaa" />
                </td>
                {gameState.roundRecap?.players.map((player) => {
                  return (
                    <td
                      key={'table-score-player-playername-' + player.id}
                      className={
                        'min-w-24 border-2 border-slate-700 p-2 text-center ' +
                        player.color
                      }
                    >
                      {player.playerName}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="min-w-12 border-2 border-slate-700 px-3 py-2">
                  <FontAwesomeIcon
                    icon={faCoins}
                    color="oklch(92.4% 0.12 95.746)"
                  />
                </td>
                {gameState.roundRecap?.players.map((player) => {
                  return (
                    <td
                      key={'table-score-player-playerscore-' + player.id}
                      className="min-w-24 border-2 border-slate-700 p-2 text-center"
                    >
                      {player.score}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold underline">Dernière action de jeu</h3>
          <EventDescriptionDisplay
            eventDescription={gameState.roundRecap?.eventDescription}
          />
        </div>
        {gameState.gameState == GameState.GameFinished &&
          gameState.roundRecap?.playersWhoWinMatch.length == 1 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold underline">Gagnant de la partie</h3>
              <div>
                Le gagnant de la partie est :{' '}
                <span
                  className={gameState.roundRecap.playersWhoWinMatch[0].color}
                >
                  {gameState.roundRecap.playersWhoWinMatch[0].playerName}
                </span>
              </div>
            </div>
          )}
        {gameState.gameState == GameState.GameFinished &&
          gameState.roundRecap?.playersWhoWinMatch.length != undefined &&
          gameState.roundRecap?.playersWhoWinMatch.length >= 2 && (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold underline">Gagnants de la partie</h3>
              <div>
                Les gagnants de la partie sont :{' '}
                {gameState.roundRecap?.playersWhoWinMatch.map(
                  (player, index) => {
                    if (index == 0) {
                      return (
                        <span
                          key={'player-win-' + player.id}
                          className={player.color}
                        >
                          {player.playerName}
                        </span>
                      );
                    }

                    if (
                      gameState.roundRecap?.playersWhoWinByValue.length !=
                        undefined &&
                      index ==
                        gameState.roundRecap?.playersWhoWinByValue.length - 1
                    ) {
                      return (
                        <>
                          {', '}
                          <span
                            key={'player-win-' + player.id}
                            className={player.color}
                          >
                            {player.playerName}
                          </span>
                          .
                        </>
                      );
                    }

                    return (
                      <>
                        {', '}
                        <span
                          key={'player-win-' + player.id}
                          className={player.color}
                        >
                          {player.playerName}
                        </span>
                      </>
                    );
                  },
                )}
              </div>
            </div>
          )}
        {isOwner && gameState.gameState == GameState.GameRoundFinished && (
          <PrimaryButton
            buttonText="Lancer la prochaine manche"
            onClick={launchNextRound}
            disabled={false}
          />
        )}
        {isOwner && gameState.gameState == GameState.GameFinished && (
          <PrimaryButton
            buttonText="Relancer une nouvelle partie"
            onClick={relaunchGame}
            disabled={false}
          />
        )}
        {!isOwner && (
          <p className="text-primary-hover">
            En attente de l&apos;hôte du lobby pour la prochaine manche/partie.
          </p>
        )}
      </div>
    </ModalTemplate>
  );
}
