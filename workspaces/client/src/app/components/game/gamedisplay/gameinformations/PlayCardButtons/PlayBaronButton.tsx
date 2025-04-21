import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import { Modal } from '@mui/material';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalBaron from './PlayModal/PlayModalBaron';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
  myPlayer: PlayerGame;
};

export default function PlayBaronButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const [openPlayModalBaron, setOpenPlayModalBaron] = useState(false);
  const handleOpenPlayModalBaron = () => setOpenPlayModalBaron(true);
  const handleClosePlayModalBaron = () => setOpenPlayModalBaron(false);

  const playBaron = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    handleOpenPlayModalBaron();
  };

  return (
    <>
      <Modal
        open={openPlayModalBaron}
        onClose={handleClosePlayModalBaron}
        aria-labelledby="modal-baron"
        aria-describedby="modal-baron-play"
      >
        <PlayModalBaron
          handleClose={handleClosePlayModalBaron}
          gameState={gameState}
          playersParsed={playersParsed}
          myPlayer={myPlayer}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Baron"
        onClick={playBaron}
        primary={primary}
      />
    </>
  );
}
