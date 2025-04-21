import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import ModalTemplate from '@components/modal/ModalTemplate';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';

type Props = {
  handleClose: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function PlayModalPrincess({ handleClose, gameState }: Props) {
  const { sm } = useSocketManager();

  const playPrincess = () => {
    sm.emit({
      event: ClientEvents.GamePlayPrincess,
      data: {
        lobbyId: gameState.lobbyId,
      },
    });

    handleClose();
  };

  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">
          Jouer la princesse
        </h2>
        <p className="text-primary-hover mt-8">
          Jouer la princesse vous fera mourir !
        </p>
        <div className="flex flex-row gap-12">
          <PrimaryButton
            buttonText="Mourir"
            onClick={playPrincess}
            disabled={false}
          />
          <SecondaryButton
            buttonText="Retour"
            onClick={handleClose}
            disabled={false}
          />
        </div>
      </div>
    </ModalTemplate>
  );
}
