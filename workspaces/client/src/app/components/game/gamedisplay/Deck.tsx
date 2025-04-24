import SecondaryButton from '@components/buttons/SecondaryButton';
import { Modal } from '@mui/material';
import BackCard from '@public/backcard.png';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import Image from 'next/image';
import { useState } from 'react';

import LastPlayedCard from './deck/LastPlayedCard';
import ModalHelpCards from './gameinformations/ModalHelpCards';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function Deck({ gameState }: Props) {
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
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row gap-6">
          <div className="flex w-24 flex-col items-center gap-4">
            <div>Pioche ({gameState.deck.length})</div>
            <Image src={BackCard} alt="deck" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div>Défausse</div>
            <div className="flex h-full flex-row items-center gap-2">
              {gameState.lastPlayedCard != undefined ? (
                <div>
                  <LastPlayedCard card={gameState.lastPlayedCard} />
                </div>
              ) : (
                <div className="h-full w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
              )}
              {gameState.secondPlayedCard == undefined ? (
                <div className="h-full w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
              ) : (
                <LastPlayedCard card={gameState.secondPlayedCard} />
              )}
            </div>
          </div>
        </div>
        <SecondaryButton
          buttonText="Aides de jeu"
          onClick={handleOpenModalHelpCards}
          disabled={false}
        />
      </div>
    </>
  );
}
