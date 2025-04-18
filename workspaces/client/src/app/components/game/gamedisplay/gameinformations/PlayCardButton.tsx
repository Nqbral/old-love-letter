import CustomNotification from '@components/notifications/CustomNotification';
import { Cards } from '@shared/common/Cards';
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
};

export default function PlayCardButton({ card, primary, disabled }: Props) {
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
        />
      );
    case Cards.Guard:
      return (
        <PlayGuardButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Priest:
      return (
        <PlayPriestButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Baron:
      return (
        <PlayBaronButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Handmaid:
      return (
        <PlayHandmaidButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Prince:
      return (
        <PlayPrinceButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Chancellor:
      return (
        <PlayChancellorButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.King:
      return (
        <PlayKingButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Countess:
      return (
        <PlayCountessButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
    case Cards.Princess:
      return (
        <PlayPrincessButton
          primary={primary}
          disabled={disabled}
          showNotYourTurn={showNotYourTurn}
        />
      );
  }
}
