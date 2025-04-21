import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import { Modal } from '@mui/material';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalPrince from './PlayModal/PlayModalPrince';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
  myPlayer: PlayerGame;
};

export default function PlayPrinceButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const [openPlayModalPrince, setOpenPlayModalPrince] = useState(false);
  const handleOpenPlayModalPrince = () => setOpenPlayModalPrince(true);
  const handleClosePlayModalPrince = () => setOpenPlayModalPrince(false);

  const playPrince = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    handleOpenPlayModalPrince();
  };

  return (
    <>
      <Modal
        open={openPlayModalPrince}
        onClose={handleClosePlayModalPrince}
        aria-labelledby="modal-prince"
        aria-describedby="modal-prince-play"
      >
        <PlayModalPrince
          handleClose={handleClosePlayModalPrince}
          gameState={gameState}
          playersParsed={playersParsed}
          myPlayer={myPlayer}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Prince"
        onClick={playPrince}
        primary={primary}
      />
    </>
  );
}
