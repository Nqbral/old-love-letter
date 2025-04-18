import Deck from '@components/game/gamedisplay/Deck';
import GameInformations from '@components/game/gamedisplay/GameInformations';
import OtherPlayer from '@components/game/gamedisplay/OtherPlayer';
import Player from '@components/game/gamedisplay/Player';
import { reviver } from '@love-letter/shared/common/JsonHelper';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';
import { Slide, ToastContainer } from 'react-toastify';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState];
  clientId: string | undefined;
};

export default function Game({ gameState, clientId }: Props) {
  const [playersTurnOrder, setPlayersTurnOrder] = useState(['']);
  const [playersParsed, setPlayersParsed] = useState(new Map());

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
      <ToastContainer transition={Slide} />
      <GameInformations
        myPlayer={playersParsed.get(clientId)}
        gameState={gameState}
        playersParsed={playersParsed}
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
