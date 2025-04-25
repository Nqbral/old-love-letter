import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import { Modal } from '@mui/material';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalGuard from './PlayModal/PlayModalGuard';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<string, PlayerGame>;
  myPlayer: PlayerGame;
};

export default function PlayGuardButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const [openPlayModalGuard, setOpenPlayModalGuard] = useState(false);
  const handleOpenPlayModalGuard = () => setOpenPlayModalGuard(true);
  const handleClosePlayModalGuard = () => setOpenPlayModalGuard(false);

  const playGuard = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    handleOpenPlayModalGuard();
  };

  return (
    <>
      <Modal
        open={openPlayModalGuard}
        onClose={handleClosePlayModalGuard}
        aria-labelledby="modal-guard"
        aria-describedby="modal-guard-play"
      >
        <PlayModalGuard
          handleClose={handleClosePlayModalGuard}
          gameState={gameState}
          playersParsed={playersParsed}
          myPlayer={myPlayer}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Garde"
        onClick={playGuard}
        primary={primary}
      />
    </>
  );
}
