import CustomNotification from '@components/notifications/CustomNotification';
import { Cards } from '@shared/common/Cards';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { toast } from 'react-toastify';

import PlayBaronButton from './PlayCardButtons/PlayBaronButton';
import PlayChancellorButton from './PlayCardButtons/PlayChancellorButton';
import PlayCountessButton from './PlayCardButtons/PlayCountess';
import PlayGuardButton from './PlayCardButtons/PlayGuardButton';
import PlayHandmaidButton from './PlayCardButtons/PlayHandmaidButton';
import PlayKingButton from './PlayCardButtons/PlayKingButton';
import PlayPriestButton from './PlayCardButtons/PlayPriestButton';
import PlayPrinceButton from './PlayCardButtons/PlayPrinceButton';
import PlayPrincessButton from './PlayCardButtons/PlayPrincessButton';
import PlaySpyButton from './PlayCardButtons/PlaySpyButton';

type Props = {
  card: Cards;
  primary: boolean;
  disabled: boolean;
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function PlayCardButton({
  card,
  primary,
  disabled,
  gameState,
}: Props) {
  const showNotYourTurn = () => {
    toast(CustomNotification, {
      data: {
        title: 'Erreur de jeu',
        content: "Ce n'est pas à votre tour de jouer",
      },
      hideProgressBar: true,
      closeButton: false,
      style: {
        width: 245,
      },
    });
  };

  switch (card) {
    case Cards.Spy:
      return (
        <PlaySpyButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Guard:
      return (
        <PlayGuardButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Priest:
      return (
        <PlayPriestButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Baron:
      return (
        <PlayBaronButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Handmaid:
      return (
        <PlayHandmaidButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Prince:
      return (
        <PlayPrinceButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Chancellor:
      return (
        <PlayChancellorButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.King:
      return (
        <PlayKingButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Countess:
      return (
        <PlayCountessButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
    case Cards.Princess:
      return (
        <PlayPrincessButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
          gameState={gameState}
        />
      );
  }
}
