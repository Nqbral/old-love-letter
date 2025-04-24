import RedButton from '@components/buttons/RedButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import { PlayerGame } from '@love-letter/shared/common/Player';
import { Modal } from '@mui/material';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import EventDescriptionDisplay from './EventDescriptionDisplay';
import ModalHelpCards from './gameinformations/ModalHelpCards';
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
  const [openModalHelpCards, setOpenModalHelpCards] = useState(false);
  const handleOpenModalHelpCards = () => setOpenModalHelpCards(true);
  const handleCloseModalHelpCards = () => setOpenModalHelpCards(false);

  return (
    <>
      <Modal
        open={openModalHelpCards}
        onClose={handleCloseModalHelpCards}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalHelpCards handleClose={handleCloseModalHelpCards} />
      </Modal>

      <div className="flex w-96 flex-col items-center border-r-1 border-slate-700 px-4 py-8">
        <h1 className="text-primary text-4xl">Lobby "test"</h1>
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <h2 className="text-secondary-hover pb-4 text-xl">Actions</h2>
        {myPlayer.cards.length == 0 && <div>Vous n'êtes plus en lice.</div>}
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
        <h2 className="text-secondary-hover pb-4 text-xl">
          Ancien tour de jeu
        </h2>
        <EventDescriptionDisplay
          eventDescription={gameState.eventDescription}
        />
        <hr className="my-12 w-32 border-1 border-slate-700" />
        <SecondaryButton
          buttonText="Aides de jeu"
          onClick={handleOpenModalHelpCards}
          disabled={false}
        />
        <RedButton
          buttonText="Quitter la partie"
          onClick={() => {}}
          disabled={false}
        />
        <p className="text-primary-hover mt-8">
          Veuillez ne pas rafraîchir la page !
        </p>
      </div>
    </>
  );
}
