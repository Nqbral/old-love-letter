import { PlayerGame } from '@love-letter/shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

import EventDescriptionDisplay from './EventDescriptionDisplay';
import PlayCardButton from './gameinformations/PlayCardButton';
import PlayerTurn from './gameinformations/PlayerTurn';

type Props = {
  myPlayer: PlayerGame;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<string, PlayerGame>;
  lobbyName: string;
};

export default function GameInformations({
  myPlayer,
  gameState,
  playersParsed,
  lobbyName,
}: Props) {
  return (
    <>
      <div className="flex w-96 flex-col items-center border-r-1 border-slate-700 px-4 py-8">
        <h1 className="text-primary text-center text-4xl">
          Lobby &quot;{lobbyName}&quot;
        </h1>
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <h2 className="text-secondary-hover pb-4 text-xl">Actions</h2>
        {myPlayer.cards.length == 0 && (
          <div>Vous n&apos;êtes plus en lice.</div>
        )}
        {myPlayer.cards.map((card, index) => {
          return (
            <PlayCardButton
              card={card}
              key={card + index}
              primary={index % 2 == 0}
              disabled={gameState.playerTurn != myPlayer.id}
              gameState={gameState}
              playersParsed={playersParsed}
              myPlayer={myPlayer}
            />
          );
        })}
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <h2 className="text-secondary-hover pb-4 text-xl">Tour de jeu</h2>
        {gameState.playerTurn == myPlayer.id ? (
          <div>C&apos;est à votre tour de jouer.</div>
        ) : (
          <div>
            {playersParsed.size == 0 ? (
              <div></div>
            ) : (
              <PlayerTurn player={playersParsed.get(gameState.playerTurn)} />
            )}
          </div>
        )}
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <h2 className="text-secondary-hover pb-4 text-xl">
          Ancien tour de jeu
        </h2>
        <EventDescriptionDisplay
          eventDescription={gameState.eventDescription}
        />
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <p className="text-primary-hover text-center">
          Veuillez ne pas rafraîchir la page !
        </p>
      </div>
    </>
  );
}
