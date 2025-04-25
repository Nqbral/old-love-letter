import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { REGEX_RULES } from 'app/constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState] | null;
};

export default function GameLobbyJoin({ lobbyState }: Props) {
  const { sm } = useSocketManager();
  const router = useRouter();

  const [playerName, setPlayerName] = useState('');
  const [errMsgName, setErrMsgName] = useState('');

  const onLeaveLobby = () => {
    sm.emit({
      event: ClientEvents.LobbyLeave,
      data: {
        lobbyId: lobbyState?.lobbyId,
      },
    });

    router.push('/lobby');
  };

  const onJoinLobby = () => {
    setErrMsgName('');

    if (!REGEX_RULES.ALPHAONLY_REGEX.test(playerName)) {
      setErrMsgName('Veuillez saisir un pseudo valide (que des lettres).');
      return;
    }

    if (playerName.length > 12) {
      setErrMsgName('Le pseudo ne peut pas dépasser 12 caractères.');
      return;
    }

    sm.emit({
      event: ClientEvents.PlayerRename,
      data: {
        lobbyId: lobbyState?.lobbyId,
        playerName: playerName,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-primary text-4xl">Rejoindre le lobby</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <p>
          Vous êtes en train de rejoindre le lobby nommé{' '}
          <span className="font-bold">{lobbyState?.lobbyName}</span>.
        </p>
        <p className="mb-4">Veuillez saisir votre pseudo</p>
        <input
          type="text"
          name="player_name"
          required
          defaultValue={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          className="focus:border-primary-hover hover:border-primary-hover w-52 border-b-1 border-neutral-300 text-center transition-colors duration-300 outline-none"
          placeholder="Pseudo"
        />
        <p
          className={errMsgName ? 'text-red-600' : 'hidden'}
          aria-live="assertive"
        >
          {errMsgName}
        </p>
        <div className="mt-2 flex flex-row gap-12">
          <PrimaryButton
            buttonText="Rejoindre le lobby"
            onClick={() => onJoinLobby()}
            disabled={false}
          />
          <SecondaryButton
            buttonText="Quitter"
            onClick={onLeaveLobby}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
