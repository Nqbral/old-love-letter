import PrimaryButton from '@components/buttons/PrimaryButton';
import SecondaryButton from '@components/buttons/SecondaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import ModalTemplate from '@components/modal/ModalTemplate';
import { ClientEvents } from '@shared/client/ClientEvents';
import { Cards } from '@shared/common/Cards';
import { PlayerGame } from '@shared/common/Player';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useEffect, useState } from 'react';

type Props = {
  handleClose: () => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  playersParsed: Map<any, any>;
  myPlayer: PlayerGame;
};

export default function PlayModalGuard({
  handleClose,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const { sm } = useSocketManager();
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [errorSelectedPlayerMessage, setErrorSelectedPlayerMessage] =
    useState('');
  const [errorSelectedCard, setErrorSelectedCard] = useState('');
  const [listPlayers, setListPlayers] = useState<PlayerGame[]>([]);
  const [noPlayerAvailable, setNoPlayerAvailable] = useState(false);

  useEffect(() => {
    let list = Array.from(playersParsed.values()).filter((player) => {
      return (
        player.id != myPlayer.id &&
        player.alive &&
        !player.activeCards.includes(Cards.Handmaid)
      );
    });

    setNoPlayerAvailable(list.length == 0);
    setListPlayers(list);
  }, [playersParsed]);

  const playGuardNoEffect = () => {
    sm.emit({
      event: ClientEvents.GamePlayGuard,
      data: {
        lobbyId: gameState.lobbyId,
        playerIdTarget: '',
        cardTarget: '',
        noEffect: true,
      },
    });

    backButton();
  };

  const playGuard = () => {
    if (selectedPlayer == '') {
      setErrorSelectedPlayerMessage('Veuillez sélectionnez un joueur !');
      return;
    }

    if (selectedCard == '') {
      setErrorSelectedCard('Veuillez sélectionner une carte !');
      return;
    }

    sm.emit({
      event: ClientEvents.GamePlayGuard,
      data: {
        lobbyId: gameState.lobbyId,
        playerIdTarget: selectedPlayer,
        cardTarget: selectedCard,
        noEffect: false,
      },
    });

    backButton();
  };

  const backButton = () => {
    setSelectedPlayer('');
    setSelectedCard('');
    setErrorSelectedPlayerMessage('');
    setErrorSelectedCard('');
    handleClose();
  };

  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Jouer le Garde</h2>
        {noPlayerAvailable ? (
          <>
            <p className="text-primary-hover">
              Tous les joueurs encore en lice sont protégés par une{' '}
              <span className="font-bold">Servante</span>. Jouer le garde n'aura
              aucun effet.
            </p>
            <div>
              <div className="flex flex-row gap-12">
                <PrimaryButton
                  buttonText="Jouer sans effet"
                  onClick={playGuardNoEffect}
                  disabled={false}
                />
                <SecondaryButton
                  buttonText="Retour"
                  onClick={backButton}
                  disabled={false}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Sélectionnez le joueur dont vous voulez devinez la carte</p>
            <ul className="flex w-64 flex-col rounded-lg">
              {listPlayers.map((player, index) => {
                if (player.alive && player.id != myPlayer.id) {
                  let classes = player.color + ' py-2 transition-colors';

                  player.id == selectedPlayer
                    ? (classes += ' bg-neutral-900 hover:bg-neutral-700')
                    : (classes += ' bg-neutral-800 hover:bg-neutral-700');

                  if (index == 0) {
                    classes += ' rounded-t-lg';
                  }

                  if (index == listPlayers.length - 1) {
                    classes += ' rounded-b-lg';
                  }

                  return (
                    <li
                      key={'select-player-guard-' + player.id}
                      onClick={() => setSelectedPlayer(player.id)}
                      className={classes}
                    >
                      {player.playerName}{' '}
                      {player.id == selectedPlayer && '(Sélectionné)'}
                    </li>
                  );
                }

                return <div key={'select-player-guard-' + player.id} />;
              })}
            </ul>
            {errorSelectedPlayerMessage != '' && (
              <p className="text-red-600 italic">
                {errorSelectedPlayerMessage}
              </p>
            )}
            <p>Sélectionnez la carte</p>
            <ul className="flex w-64 flex-col rounded-lg">
              <li
                className={
                  selectedCard == Cards.Princess
                    ? 'rounded-t-lg bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'rounded-t-lg bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Princess)}
              >
                Princesse
                {selectedCard == Cards.Princess && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Countess
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Countess)}
              >
                Comtesse
                {selectedCard == Cards.Countess && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.King
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.King)}
              >
                Roi
                {selectedCard == Cards.King && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Chancellor
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Chancellor)}
              >
                Chancelier
                {selectedCard == Cards.Chancellor && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Prince
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Prince)}
              >
                Prince
                {selectedCard == Cards.Prince && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Handmaid
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Handmaid)}
              >
                Servante
                {selectedCard == Cards.Handmaid && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Baron
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Baron)}
              >
                Baron
                {selectedCard == Cards.Baron && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Priest
                    ? 'bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Priest)}
              >
                Prêtre
                {selectedCard == Cards.Priest && ' ' + '(Sélectionné)'}
              </li>
              <li
                className={
                  selectedCard == Cards.Spy
                    ? 'rounded-b-lg bg-neutral-900 py-2 transition-colors hover:bg-neutral-700'
                    : 'rounded-b-lg bg-neutral-800 py-2 transition-colors hover:bg-neutral-700'
                }
                onClick={() => setSelectedCard(Cards.Spy)}
              >
                Espionne
                {selectedCard == Cards.Spy && ' ' + '(Sélectionné)'}
              </li>
            </ul>
            {errorSelectedCard != '' && (
              <p className="text-red-600 italic">{errorSelectedCard}</p>
            )}
            <div className="flex flex-row gap-12">
              <PrimaryButton
                buttonText="Devinez"
                onClick={playGuard}
                disabled={false}
              />
              <SecondaryButton
                buttonText="Retour"
                onClick={backButton}
                disabled={false}
              />
            </div>
          </>
        )}
      </div>
    </ModalTemplate>
  );
}
