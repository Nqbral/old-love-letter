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
  playersParsed: Map<string, PlayerGame>;
  myPlayer: PlayerGame;
};

export default function PlayModalPrince({
  handleClose,
  gameState,
  playersParsed,
  myPlayer,
}: Props) {
  const { sm } = useSocketManager();
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [listPlayers, setListPlayers] = useState<PlayerGame[]>([]);

  useEffect(() => {
    const list = Array.from(playersParsed.values()).filter((player) => {
      return player.alive && !player.activeCards.includes(Cards.Handmaid);
    });

    setListPlayers(list);
  }, [playersParsed]);

  const playPrince = () => {
    if (selectedPlayer == '') {
      setErrorMessage('Veuillez sélectionnez un joueur !');
      return;
    }
    sm.emit({
      event: ClientEvents.GamePlayPrince,
      data: {
        lobbyId: gameState.lobbyId,
        playerIdTarget: selectedPlayer,
        noEffect: false,
      },
    });

    backButton();
  };

  const backButton = () => {
    setSelectedPlayer('');
    setErrorMessage('');
    handleClose();
  };

  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">Jouer le Prince</h2>
        <p>Sélectionnez le joueur dont vous voulez défausser la carte</p>
        <ul className="flex w-64 flex-col rounded-lg">
          {listPlayers.map((player, index) => {
            if (player.alive) {
              let classes = player.color + ' py-2 transition-colors';
              const isPlayer = player.id == selectedPlayer;

              classes += isPlayer
                ? ' bg-neutral-900 hover:bg-neutral-700'
                : ' bg-neutral-800 hover:bg-neutral-700';

              if (index == 0) {
                classes += ' rounded-t-lg';
              }

              if (index == listPlayers.length - 1) {
                classes += ' rounded-b-lg';
              }

              return (
                <li
                  key={'select-player-prince-' + player.id}
                  onClick={() => setSelectedPlayer(player.id)}
                  className={classes}
                >
                  {player.id == myPlayer.id ? 'Vous-même' : player.playerName}{' '}
                  {player.id == selectedPlayer && '(Sélectionné)'}
                </li>
              );
            }

            return <div key={'select-player-prince-' + player.id} />;
          })}
        </ul>
        {errorMessage != '' && (
          <p className="text-red-600 italic">{errorMessage}</p>
        )}
        <div className="flex flex-row gap-12">
          <PrimaryButton
            buttonText="Défausser"
            onClick={playPrince}
            disabled={false}
          />
          <SecondaryButton
            buttonText="Retour"
            onClick={backButton}
            disabled={false}
          />
        </div>
      </div>
    </ModalTemplate>
  );
}
