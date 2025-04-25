import Deck from '@components/game/gamedisplay/Deck';
import GameInformations from '@components/game/gamedisplay/GameInformations';
import OtherPlayer from '@components/game/gamedisplay/OtherPlayer';
import Player from '@components/game/gamedisplay/Player';
import useSocketManager from '@components/hooks/useSocketManager';
import BaronNotificationSelf from '@components/notifications/BaronNotificationSelf';
import BaronNotificationTarget from '@components/notifications/BaronNotificationTarget';
import DrawCardNotification from '@components/notifications/DrawCardNotification';
import GuardNotification from '@components/notifications/GuardNotification';
import KingNotificationSelf from '@components/notifications/KingNotificationSelf';
import KingNotificationTarget from '@components/notifications/KingNotificationTarget';
import PriestNotification from '@components/notifications/PriestNotification';
import PrinceNotification from '@components/notifications/PrinceNotification';
import { Listener } from '@components/websocket/types';
import { reviver } from '@love-letter/shared/common/JsonHelper';
import { ServerEvents } from '@love-letter/shared/server/ServerEvents';
import { ServerPayloads } from '@love-letter/shared/server/ServerPayloads';
import { Modal } from '@mui/material';
import { Cards } from '@shared/common/Cards';
import { ResultEvent } from '@shared/common/EventDescription';
import { GameState } from '@shared/common/GameState';
import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';
import { Slide, ToastContainer, toast } from 'react-toastify';

import ModalChancellorPartTwo from './gamedisplay/showmodals/ModalChancellorPartTwo';
import ModalPriestGuessed from './gamedisplay/showmodals/ModalPriestGuessed';
import ModalRecapRound from './gamedisplay/showmodals/ModalRecapRound';

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

  // Recap Round Modal Show
  const [recapRoundShow, setRecapRoundShow] = useState(false);

  const handleOpenRecapRound = () => setRecapRoundShow(true);
  const handleCloseRecapRound = () => setRecapRoundShow(false);

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

    const onGameMessageDrawCard: Listener<
      ServerPayloads[ServerEvents.GameMessageDrawCard]
    > = (data) => {
      toast(DrawCardNotification, {
        data: {
          card: data.card,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 220,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageGuardNotGuessed: Listener<
      ServerPayloads[ServerEvents.GameMessageGuardNotGuessed]
    > = (data) => {
      toast(GuardNotification, {
        data: {
          player: data.player,
          card: data.cardGuessed,
          killed: false,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 400,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageGuardKill: Listener<
      ServerPayloads[ServerEvents.GameMessageGuardKill]
    > = (data) => {
      toast(GuardNotification, {
        data: {
          player: data.player,
          card: data.cardGuessed,
          killed: true,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 400,
        },
        autoClose: 7000,
      });
    };

    const onGameMessagePriest: Listener<
      ServerPayloads[ServerEvents.GameMessagePriest]
    > = (data) => {
      toast(PriestNotification, {
        data: {
          player: data.player,
          card: data.card,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 300,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageBaronSelf: Listener<
      ServerPayloads[ServerEvents.GameMessageBaronSelf]
    > = (data) => {
      toast(BaronNotificationSelf, {
        data: {
          playerTargeted: data.playerTargeted,
          cardPlayer: data.cardPlayer,
          cardPlayerTargeted: data.cardPlayerTargeted,
          result: data.result,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: data.result == ResultEvent.DrawBaron ? 250 : 300,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageBaronTarget: Listener<
      ServerPayloads[ServerEvents.GameMessageBaronTarget]
    > = (data) => {
      toast(BaronNotificationTarget, {
        data: {
          player: data.player,
          cardPlayer: data.cardPlayer,
          cardPlayerTargeted: data.cardPlayerTargeted,
          result: data.result,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: data.result == ResultEvent.DrawBaron ? 250 : 300,
        },
        autoClose: 7000,
      });
    };

    const onGameMessagePrince: Listener<
      ServerPayloads[ServerEvents.GameMessagePrince]
    > = (data) => {
      toast(PrinceNotification, {
        data: {
          player: data.player,
          playerTargeted: data.playerTargeted,
          lostCard: data.lostCard,
          drawedCard: data.drawedCard,
          killedPlayer: data.killedPlayer,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 300,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageKingSelf: Listener<
      ServerPayloads[ServerEvents.GameMessageKingSelf]
    > = (data) => {
      toast(KingNotificationSelf, {
        data: {
          playerTargeted: data.playerTargeted,
          cardPlayer: data.cardPlayer,
          cardPlayerTargeted: data.cardPlayerTargeted,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 400,
        },
        autoClose: 7000,
      });
    };

    const onGameMessageKingTarget: Listener<
      ServerPayloads[ServerEvents.GameMessageKingTarget]
    > = (data) => {
      toast(KingNotificationTarget, {
        data: {
          player: data.player,
          cardPlayer: data.cardPlayer,
          cardPlayerTargeted: data.cardPlayerTargeted,
        },
        hideProgressBar: true,
        closeButton: false,
        style: {
          width: 400,
        },
        autoClose: 7000,
      });
    };

    sm.registerListener(ServerEvents.GamePriestPlayed, onGamePriestPlayed);
    sm.registerListener(
      ServerEvents.GameChancellorPlayed,
      onGameChancellorPlayed,
    );
    sm.registerListener(
      ServerEvents.GameMessageDrawCard,
      onGameMessageDrawCard,
    );
    sm.registerListener(
      ServerEvents.GameMessageGuardNotGuessed,
      onGameMessageGuardNotGuessed,
    );
    sm.registerListener(
      ServerEvents.GameMessageGuardKill,
      onGameMessageGuardKill,
    );
    sm.registerListener(ServerEvents.GameMessagePriest, onGameMessagePriest);
    sm.registerListener(
      ServerEvents.GameMessageBaronSelf,
      onGameMessageBaronSelf,
    );
    sm.registerListener(
      ServerEvents.GameMessageBaronTarget,
      onGameMessageBaronTarget,
    );
    sm.registerListener(ServerEvents.GameMessagePrince, onGameMessagePrince);
    sm.registerListener(
      ServerEvents.GameMessageKingSelf,
      onGameMessageKingSelf,
    );
    sm.registerListener(
      ServerEvents.GameMessageKingTarget,
      onGameMessageKingTarget,
    );

    return () => {
      sm.removeListener(ServerEvents.GamePriestPlayed, onGamePriestPlayed);
      sm.removeListener(
        ServerEvents.GameChancellorPlayed,
        onGameChancellorPlayed,
      );
      sm.removeListener(
        ServerEvents.GameMessageDrawCard,
        onGameMessageDrawCard,
      );
      sm.removeListener(
        ServerEvents.GameMessageGuardNotGuessed,
        onGameMessageGuardNotGuessed,
      );
      sm.removeListener(
        ServerEvents.GameMessageGuardKill,
        onGameMessageGuardKill,
      );
      sm.removeListener(ServerEvents.GameMessagePriest, onGameMessagePriest);
      sm.removeListener(
        ServerEvents.GameMessageBaronSelf,
        onGameMessageBaronSelf,
      );
      sm.removeListener(
        ServerEvents.GameMessageBaronTarget,
        onGameMessageBaronTarget,
      );
      sm.removeListener(ServerEvents.GameMessagePrince, onGameMessagePrince);
      sm.removeListener(
        ServerEvents.GameMessageKingSelf,
        onGameMessageKingSelf,
      );
      sm.removeListener(
        ServerEvents.GameMessageKingTarget,
        onGameMessageKingTarget,
      );
    };
  }, []);

  useEffect(() => {
    if (
      [GameState.GameRoundFinished, GameState.GameFinished].includes(
        gameState.gameState,
      )
    ) {
      handleOpenRecapRound();
    }

    if (gameState.gameState == GameState.GameStart) {
      handleCloseRecapRound();
    }

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
      <Modal
        open={recapRoundShow}
        onClose={() => {}}
        aria-labelledby="modal-recap-round"
        aria-describedby="modal-recap-round-show"
      >
        <ModalRecapRound gameState={gameState} />
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
