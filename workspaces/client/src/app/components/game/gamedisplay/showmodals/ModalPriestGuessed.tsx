import SecondaryButton from '@components/buttons/SecondaryButton';
import ModalTemplate from '@components/modal/ModalTemplate';
import { Cards } from '@shared/common/Cards';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

import DisplayCard from '../DisplayCard';

type Props = {
  gamePriestPlayed: ServerPayloads[ServerEvents.GamePriestPlayed];
  handleClose: () => void;
};

export default function ModalPriestGuessed({
  gamePriestPlayed,
  handleClose,
}: Props) {
  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Jouer le Prêtre</h2>
        <p>
          Vous regardez la main de{' '}
          <span className={gamePriestPlayed.playerGuessedColor}>
            {gamePriestPlayed.playerGuessedName}
          </span>{' '}
          qui a la carte
        </p>
        <DisplayCard card={gamePriestPlayed.cardGuessed} />
        <SecondaryButton
          buttonText="Retour"
          onClick={handleClose}
          disabled={false}
        />
      </div>
    </ModalTemplate>
  );
}
