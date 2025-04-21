import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import { Modal } from '@mui/material';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalPriest from './PlayModal/PlayModalPriest';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
  myPlayer: PlayerGame;
};

export default function PlayPriestButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const [openPlayModalPriest, setOpenPlayModalPriest] = useState(false);
  const handleOpenPlayModalPriest = () => setOpenPlayModalPriest(true);
  const handleClosePlayModalPriest = () => setOpenPlayModalPriest(false);

  const playPriest = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    handleOpenPlayModalPriest();
  };

  return (
    <>
      <Modal
        open={openPlayModalPriest}
        onClose={handleClosePlayModalPriest}
        aria-labelledby="modal-priest"
        aria-describedby="modal-priest-play"
      >
        <PlayModalPriest
          handleClose={handleClosePlayModalPriest}
          gameState={gameState}
          playersParsed={playersParsed}
          myPlayer={myPlayer}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Prêtre"
        onClick={playPriest}
        primary={primary}
      />
    </>
  );
}
