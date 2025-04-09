import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import useSocketManager from '../hooks/useSocketManager';

export default function LobbyIntroduction() {
  const router = useRouter();
  const { sm } = useSocketManager();

  const onCreateLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyCreate,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-primary text-4xl">Lobby</h1>
      <div className="flex flex-row gap-12">
        <PrimaryButton
          buttonText="Créer un lobby"
          onClick={onCreateLobby}
          disabled={false}
        />
        <SecondaryButton
          buttonText="Rejoindre un lobby"
          onClick={undefined}
          disabled={false}
        />
      </div>
    </div>
  );
}
