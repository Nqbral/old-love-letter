import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import CustomNotification from '@components/notifications/CustomNotification';
import { Modal } from '@mui/material';
import { Cards } from '@shared/common/Cards';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';
import { toast } from 'react-toastify';

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

    if (myPlayer.cards.includes(Cards.Countess)) {
      toast(CustomNotification, {
        data: {
          title: 'Erreur de jeu',
          content:
            'Vous ne pouvez pas jouer le Prince si vous possédez la Comtesse.',
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 245,
        },
      });

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
