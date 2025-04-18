import GreenButton from '@components/buttons/GreenButton';
import RedButton from '@components/buttons/RedButton';
import { PlayerGame } from '@love-letter/shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

import PlayCardButton from './gameinformations/PlayCardButton';

type Props = {
  myPlayer: PlayerGame;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
};

export default function GameInformations({
  myPlayer,
  gameState,
  playersParsed,
}: Props) {
  return (
    <div className="flex w-96 flex-col items-center border-r-1 border-slate-700 px-4 py-8">
      <h1 className="text-primary text-4xl">Lobby "test"</h1>
      <hr className="my-12 w-32 border-1 border-slate-700" />
      <h2 className="text-secondary-hover pb-4 text-xl">Actions</h2>
      {myPlayer.cards.map((card, index) => {
        return (
          <PlayCardButton
            card={card}
            key={card + index}
            primary={index % 2 == 0}
            disabled={gameState.playerTurn != myPlayer.id}
          />
        );
      })}
      <hr className="my-12 w-32 border-1 border-slate-700" />
      <h2 className="text-secondary-hover pb-4 text-xl">Tour de jeu</h2>
      {gameState.playerTurn == myPlayer.id ? (
        <div>C'est à votre tour de jouer</div>
      ) : (
        <div>
          {playersParsed.size == 0 ? (
            <div></div>
          ) : (
            <div>
              C'est au tour de{' '}
              <span className={playersParsed.get(gameState.playerTurn).color}>
                {playersParsed.get(gameState.playerTurn).playerName}
              </span>
            </div>
          )}
        </div>
      )}
      <hr className="my-12 w-32 border-1 border-slate-700" />
      <h2 className="text-secondary-hover pb-4 text-xl">Ancien tour de jeu</h2>
      <p>Aucun joueur n'a joué pour le moment</p>
      <hr className="my-12 w-32 border-1 border-slate-700" />
      <GreenButton
        buttonText="Aides de jeu"
        onClick={() => {}}
        disabled={false}
      />
      <RedButton
        buttonText="Quitter la partie"
        onClick={() => {}}
        disabled={false}
      />
    </div>
  );
}
