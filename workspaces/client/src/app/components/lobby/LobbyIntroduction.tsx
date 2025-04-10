import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import ModalTemplate from '@components/modal/ModalTemplate';
import { Modal } from '@mui/material';
import { useState } from 'react';

import { LobbyManagerState } from './LobbyManager';

type Props = {
  setLobbyManagerState: (lobbyManagerState: LobbyManagerState) => void;
};

export default function LobbyIntroduction({ setLobbyManagerState }: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const goToCreation = () => {
    setLobbyManagerState(LobbyManagerState.LobbyCreation);
  };

  return (
    <div className="flex flex-row gap-12">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalTemplate>
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-secondary-hover pb-2 text-2xl">
              Rejoindre un lobby
            </h2>
            <p>
              Pour rejoindre un lobby, il suffit de copier/coller le lien donner
              par le créateur du lobby dans le navigateur
            </p>
            <SecondaryButton
              buttonText="Retour"
              onClick={handleClose}
              disabled={false}
            />
          </div>
        </ModalTemplate>
      </Modal>
      <PrimaryButton
        buttonText="Créer un lobby"
        onClick={goToCreation}
        disabled={false}
      />
      <SecondaryButton
        buttonText="Rejoindre un lobby"
        onClick={handleOpen}
        disabled={false}
      />
    </div>
  );
}
