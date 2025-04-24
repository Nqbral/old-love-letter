import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import { Modal } from '@mui/material';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import PlayModalChancellor from './PlayModal/PlayModalChancellor';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function PlayChancellorButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
}: Props) {
  const [openPlayModalChancellor, setOpenPlayModalChancellor] = useState(false);
  const handleOpenPlayModalChancellor = () => setOpenPlayModalChancellor(true);
  const handleClosePlayModalChancellor = () =>
    setOpenPlayModalChancellor(false);
  const { sm } = useSocketManager();

  const playChancellor = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    if (gameState.deck.length == 0) {
      handleOpenPlayModalChancellor();
      return;
    }

    sm.emit({
      event: ClientEvents.GamePlayChancellor,
      data: {
        lobbyId: gameState.lobbyId,
      },
    });
  };

  return (
    <>
      <Modal
        open={openPlayModalChancellor}
        onClose={handleClosePlayModalChancellor}
        aria-labelledby="modal-Chancellor"
        aria-describedby="modal-Chancellor-play"
      >
        <PlayModalChancellor
          handleClose={handleClosePlayModalChancellor}
          gameState={gameState}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Chancelier"
        onClick={playChancellor}
        primary={primary}
      />
    </>
  );
}
