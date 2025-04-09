import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import { LobbyManagerState } from '@components/lobby/LobbyManager';
import { ClientEvents } from '@love-letter/shared/client/ClientEvents';
import REGEX_RULES from 'app/constants';
import { useState } from 'react';
import { useEffect } from 'react';

type Props = {
  setLobbyManagerState: (lobbyManagerState: LobbyManagerState) => void;
};

export default function LobbyCreation({ setLobbyManagerState }: Props) {
  const { sm } = useSocketManager();

  const [nbPlayers, setNbPlayers] = useState(2);
  const [playerName, setPlayerName] = useState('');
  const [validName, setValidName] = useState(false);
  const [errMsgName, setErrMsgName] = useState('');

  const backToIntroduction = () => {
    setNbPlayers(2);
    setPlayerName('');
    setErrMsgName('');
    setValidName(false);
    setLobbyManagerState(LobbyManagerState.LobbyIntroduction);
  };

  useEffect(() => {
    setValidName(REGEX_RULES.ALPHAONLY_REGEX.test(playerName));
  }, [playerName]);

  const onCreateLobby = () => {
    setErrMsgName('');

    if (!validName) {
      setErrMsgName('Veuillez saisir un pseudo valide');
      return;
    }
    sm.emit({
      event: ClientEvents.LobbyCreate,
      data: {
        nbPlayers: nbPlayers,
        playerName: playerName,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-6">
        <label htmlFor="players_number">
          Nombre de joueurs (de 2 à 6 joueurs)
        </label>
        <input
          type="number"
          name="players_number"
          min={2}
          max={6}
          required
          defaultValue={nbPlayers}
          onChange={(event) => setNbPlayers(Number(event.target.value))}
          className="focus:border-primary-hover hover:border-primary-hover w-12 rounded-md border-1 border-neutral-300 text-center transition-colors duration-300 outline-none"
        />
        <p
          className={errMsgName ? 'text-red-600' : 'hidden'}
          aria-live="assertive"
        >
          {errMsgName}
        </p>
        <label htmlFor="player_name">Pseudo</label>
        <input
          type="text"
          name="player_name"
          required
          defaultValue={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          className="focus:border-primary-hover hover:border-primary-hover w-52 border-b-1 border-neutral-300 text-center transition-colors duration-300 outline-none"
        />
        <div className="flex flex-row gap-12">
          <PrimaryButton
            buttonText="Créer le nouveau lobby"
            onClick={onCreateLobby}
            disabled={false}
          />
          <SecondaryButton
            buttonText="Retour"
            onClick={backToIntroduction}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}
