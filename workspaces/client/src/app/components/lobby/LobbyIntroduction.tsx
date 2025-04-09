import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';

import { LobbyManagerState } from './LobbyManager';

type Props = {
  setLobbyManagerState: (lobbyManagerState: LobbyManagerState) => void;
};

export default function LobbyIntroduction({ setLobbyManagerState }: Props) {
  const goToCreation = () => {
    setLobbyManagerState(LobbyManagerState.LobbyCreation);
  };

  return (
    <div className="flex flex-row gap-12">
      <PrimaryButton
        buttonText="Créer un lobby"
        onClick={goToCreation}
        disabled={false}
      />
      <SecondaryButton
        buttonText="Rejoindre un lobby"
        onClick={goToCreation}
        disabled={false}
      />
    </div>
  );
}
