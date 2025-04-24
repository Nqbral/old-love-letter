import Deck from '@components/game/gamedisplay/Deck';
import GameInformations from '@components/game/gamedisplay/GameInformations';
import OtherPlayer from '@components/game/gamedisplay/OtherPlayer';
import Player from '@components/game/gamedisplay/Player';
import useSocketManager from '@components/hooks/useSocketManager';
import { Listener } from '@components/websocket/types';
import { reviver } from '@love-letter/shared/common/JsonHelper';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { Modal } from '@mui/material';
import { Cards } from '@shared/common/Cards';
import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';
import { Slide, ToastContainer } from 'react-toastify';

import ModalChancellorPartTwo from './gamedisplay/showmodals/ModalChancellorPartTwo';
import ModalPriestGuessed from './gamedisplay/showmodals/ModalPriestGuessed';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState];
  clientId: string | undefined;
  lobbyName: string;
};

export default function Game({ gameState, clientId, lobbyName }: Props) {
  const [playersTurnOrder, setPlayersTurnOrder] = useState(['']);
  const [playersParsed, setPlayersParsed] = useState(new Map());
  const { sm } = useSocketManager();

  // Priest Modal Show
  const [gamePriestPlayed, setGamePriestPlayed] = useState<
    ServerPayloads[ServerEvents.GamePriestPlayed]
  >({ cardGuessed: Cards.Spy, playerGuessedName: '', playerGuessedColor: '' });

  const [openPriestGuessed, setOpenPriestGuessed] = useState(false);

  const handleOpenPriestGuessed = () => setOpenPriestGuessed(true);

  const handleClosePriestGuessed = () => {
    setOpenPriestGuessed(false);
    setGamePriestPlayed({
      cardGuessed: Cards.Spy,
      playerGuessedName: '',
      playerGuessedColor: '',
    });
  };

  // Chancellor Part Two Modal Show
  const [gameChancellorPlayed, setGameChancellorPlayed] = useState<
    ServerPayloads[ServerEvents.GameChancellorPlayed]
  >({ nbCardsToDiscard: 0, cards: [] });

  const [openChancellorPartTwo, setOpenChancellorPartTwo] = useState(false);

  const handleOpenChancellorPartTwo = () => setOpenChancellorPartTwo(true);

  const handleCloseChancellorPartTwo = () => {
    setOpenChancellorPartTwo(false);
    setGameChancellorPlayed({
      nbCardsToDiscard: 0,
      cards: [],
    });
  };

  useEffect(() => {
    sm.connect();

    const onGamePriestPlayed: Listener<
      ServerPayloads[ServerEvents.GamePriestPlayed]
    > = (data) => {
      setGamePriestPlayed(data);
      handleOpenPriestGuessed();
    };

    const onGameChancellorPlayed: Listener<
      ServerPayloads[ServerEvents.GameChancellorPlayed]
    > = (data) => {
      setGameChancellorPlayed(data);
      handleOpenChancellorPartTwo();
    };

    sm.registerListener(ServerEvents.GamePriestPlayed, onGamePriestPlayed);
    sm.registerListener(
      ServerEvents.GameChancellorPlayed,
      onGameChancellorPlayed,
    );

    return () => {
      sm.removeListener(ServerEvents.GamePriestPlayed, onGamePriestPlayed);
      sm.removeListener(
        ServerEvents.GameChancellorPlayed,
        onGameChancellorPlayed,
      );
    };
  }, []);

  useEffect(() => {
    if (gameState.players == '') {
      return;
    }
    const playersParsed = JSON.parse(gameState.players, reviver);
    setPlayersParsed(playersParsed);

    if (clientId != null && playersTurnOrder[0] == '') {
      const indexMyPlayerTurn = gameState.playersTurnOrder.findIndex(
        (playerTurn) => {
          return playerTurn == clientId;
        },
      );

      if (indexMyPlayerTurn != -1) {
        const lengthPlayersTurnOrder = gameState.playersTurnOrder.length;
        if (indexMyPlayerTurn === 0) {
          setPlayersTurnOrder(
            gameState.playersTurnOrder.slice(1, lengthPlayersTurnOrder),
          );
          return;
        }
        if (indexMyPlayerTurn === lengthPlayersTurnOrder - 1) {
          setPlayersTurnOrder(
            gameState.playersTurnOrder.slice(0, indexMyPlayerTurn),
          );
          return;
        }
        setPlayersTurnOrder(
          gameState.playersTurnOrder
            .slice(indexMyPlayerTurn + 1, lengthPlayersTurnOrder)
            .concat(gameState.playersTurnOrder.slice(0, indexMyPlayerTurn)),
        );
      }
    }
  }, [gameState]);

  if (playersParsed.size == 0) {
    return (
      <Hearts
        height="80"
        width="80"
        color="oklch(87.9% 0.169 91.605)"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-row gap-6">
      <Modal
        open={openPriestGuessed}
        onClose={handleClosePriestGuessed}
        aria-labelledby="modal-priest-guessed"
        aria-describedby="modal-priest-guessed-play"
      >
        <ModalPriestGuessed
          gamePriestPlayed={gamePriestPlayed}
          handleClose={handleClosePriestGuessed}
        />
      </Modal>
      <Modal
        open={openChancellorPartTwo}
        onClose={() => {}}
        aria-labelledby="modal-chancellor-part-two"
        aria-describedby="modal-chancellor-part-two"
      >
        <ModalChancellorPartTwo
          gameChancellorPlayed={gameChancellorPlayed}
          gameState={gameState}
          handleClose={handleCloseChancellorPartTwo}
        />
      </Modal>
      <ToastContainer transition={Slide} />
      <GameInformations
        myPlayer={playersParsed.get(clientId)}
        gameState={gameState}
        playersParsed={playersParsed}
        lobbyName={lobbyName}
      />
      <div className="flex w-full flex-row items-center">
        <Deck gameState={gameState} />
        <div className="flex h-full w-full flex-col items-center justify-around">
          <Player myPlayer={playersParsed.get(clientId)} />
          <div className="flex flex-row gap-32">
            {playersTurnOrder[0] != '' &&
              playersTurnOrder.map((playerTurn) => {
                return (
                  <OtherPlayer
                    key={playerTurn}
                    player={playersParsed.get(playerTurn)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
