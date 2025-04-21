import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import { Modal } from '@mui/material';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalPrincess from './PlayModal/PlayModalPrincess';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
};
export default function PlayPrincessButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
}: Props) {
  const [openPlayModalPrincess, setOpenPlayModalPrincess] = useState(false);
  const handleOpenPlayModalPrincess = () => setOpenPlayModalPrincess(true);
  const handleClosePlayModalPrincess = () => setOpenPlayModalPrincess(false);

  const playPrincess = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    handleOpenPlayModalPrincess();
  };

  return (
    <>
      <Modal
        open={openPlayModalPrincess}
        onClose={handleClosePlayModalPrincess}
        aria-labelledby="modal-princess"
        aria-describedby="modal-princess-play"
      >
        <PlayModalPrincess
          handleClose={handleClosePlayModalPrincess}
          gameState={gameState}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer la Princesse"
        onClick={playPrincess}
        primary={primary}
      />
    </>
  );
}
