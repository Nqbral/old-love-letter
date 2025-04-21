import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';
import CustomNotification from '@components/notifications/CustomNotification';
import { Modal } from '@mui/material';
import { Cards } from '@shared/common/Cards';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';
import { toast } from 'react-toastify';

import PlayModalKing from './PlayModal/PlayModalKing';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
  myPlayer: PlayerGame;
};

export default function PlayKingButton({
  primary,
  disabled,
  showNotYourTurn,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const [openPlayModalKing, setOpenPlayModalKing] = useState(false);
  const handleOpenPlayModalKing = () => setOpenPlayModalKing(true);
  const handleClosePlayModalKing = () => setOpenPlayModalKing(false);

  const playKing = () => {
    if (disabled) {
      showNotYourTurn();
      return;
    }

    if (myPlayer.cards.includes(Cards.Countess)) {
      toast(CustomNotification, {
        data: {
          title: 'Erreur de jeu',
          content:
            'Vous ne pouvez pas jouer le roi si vous possédez la comtesse.',
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 245,
        },
      });

      return;
    }

    handleOpenPlayModalKing();
  };

  return (
    <>
      <Modal
        open={openPlayModalKing}
        onClose={handleClosePlayModalKing}
        aria-labelledby="modal-king"
        aria-describedby="modal-king-play"
      >
        <PlayModalKing
          handleClose={handleClosePlayModalKing}
          gameState={gameState}
          playersParsed={playersParsed}
          myPlayer={myPlayer}
        />
      </Modal>
      <PrimaryOrSecondaryButton
        buttonText="Jouer le Roi"
        onClick={playKing}
        primary={primary}
      />
    </>
  );
}
