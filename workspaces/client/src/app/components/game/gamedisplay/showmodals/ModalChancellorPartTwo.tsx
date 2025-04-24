import PrimaryButton from '@components/buttons/PrimaryButton';
import useSocketManager from '@components/hooks/useSocketManager';
import ModalTemplate from '@components/modal/ModalTemplate';
import { ClientEvents } from '@shared/client/ClientEvents';
import { Cards } from '@shared/common/Cards';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { useState } from 'react';

import DisplayCard from '../DisplayCard';

type Props = {
  gameChancellorPlayed: ServerPayloads[ServerEvents.GameChancellorPlayed];
  gameState: ServerPayloads[ServerEvents.GameState];
  handleClose: () => void;
};

export default function ModalChancellorPartTwo({
  gameChancellorPlayed,
  gameState,
  handleClose,
}: Props) {
  type SelectionCard = {
    card: Cards;
    selected: boolean;
    orderSelected: number;
  };

  const { sm } = useSocketManager();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [nbSelected, setNbSelected] = useState<number>(0);
  const [selectedIndexCards, setSelectedIndexCards] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<Cards[]>([]);
  const [selectionCards, setSelectionCards] = useState<SelectionCard[]>(
    gameChancellorPlayed.cards.map((card) => {
      let newSelectCard: SelectionCard = {
        card: card,
        selected: false,
        orderSelected: 0,
      };

      return newSelectCard;
    }),
  );

  const selectCard = (indexSelectedCard: number, selectedCard: Cards) => {
    let arrSelectionCards = selectionCards;
    let arrIndexSelectedCards = selectedIndexCards;
    let arrSelectedCards = selectedCards;

    if (selectionCards[indexSelectedCard].selected) {
      setNbSelected(nbSelected - 1);

      arrSelectionCards[indexSelectedCard].selected = false;
      arrIndexSelectedCards.splice(
        arrIndexSelectedCards.indexOf(indexSelectedCard),
        1,
      );
      arrSelectedCards.splice(arrSelectedCards.indexOf(selectedCard), 1);

      if (
        gameChancellorPlayed.nbCardsToDiscard == 2 &&
        arrSelectionCards[indexSelectedCard].orderSelected == 1
      ) {
        let findSecondChoise = arrSelectionCards.findIndex((selectionCard) => {
          return selectionCard.selected;
        });

        if (findSecondChoise != -1) {
          arrSelectionCards[findSecondChoise].orderSelected = 1;
        }
      }

      setSelectionCards(arrSelectionCards);
      setSelectedIndexCards(arrIndexSelectedCards);
      setSelectedCards(arrSelectedCards);

      return;
    }

    if (nbSelected == gameChancellorPlayed.nbCardsToDiscard) {
      return;
    }

    setNbSelected(nbSelected + 1);
    arrSelectionCards[indexSelectedCard].selected = true;
    arrSelectionCards[indexSelectedCard].orderSelected = nbSelected + 1;
    arrIndexSelectedCards.push(indexSelectedCard);
    arrSelectedCards.push(selectedCard);

    setSelectionCards(arrSelectionCards);
    setSelectedIndexCards(arrIndexSelectedCards);
    setSelectedCards(arrSelectedCards);
  };

  const playChancellor = () => {
    if (nbSelected < gameChancellorPlayed.nbCardsToDiscard) {
      setErrorMessage(
        'Vous devez défausser ' +
          gameChancellorPlayed.nbCardsToDiscard +
          ' carte(s) !',
      );
      return;
    }

    sm.emit({
      event: ClientEvents.GamePlayChancellorPartTwo,
      data: {
        lobbyId: gameState.lobbyId,
        indexCardsDiscarded: selectedIndexCards,
        cardsDiscarded: selectedCards,
      },
    });

    handleClose();
  };

  return (
    <ModalTemplate>
      <div className="flex w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-secondary-hover pb-2 text-2xl">
          Jouer le Chancelier
        </h2>
        <p>
          Vous devez défausser {gameChancellorPlayed.nbCardsToDiscard}{' '}
          cartes(s).
        </p>
        {gameChancellorPlayed.nbCardsToDiscard == 2 && (
          <p className="text-primary-hover">
            La première carte défaussée sera en avant-dernière position de la
            pioche alors que la deuxième se trouvera à la fin.
          </p>
        )}
        {gameChancellorPlayed.nbCardsToDiscard == 1 && (
          <p className="text-primary-hover">
            La carte défaussée se trouvera en dernière position de la pioche.
          </p>
        )}
        <div className="flex flex-row items-center gap-12">
          {selectionCards.map((selectionCard, index) => {
            return (
              <div
                key={'discard-chancellor-' + index}
                onClick={() => selectCard(index, selectionCard.card)}
                className="flex flex-col items-center gap-2"
              >
                <DisplayCard card={selectionCard.card} />
                {selectionCard.selected ? (
                  <p className="font-bold text-white">
                    Sélectionnée ({selectionCard.orderSelected})
                  </p>
                ) : (
                  <p className="text-neutral-500">Non sélectionnée</p>
                )}
              </div>
            );
          })}
        </div>
        {errorMessage != '' && <p className="text-red-600">{errorMessage}</p>}
        <PrimaryButton
          buttonText="Défaussez"
          onClick={playChancellor}
          disabled={false}
        />
      </div>
    </ModalTemplate>
  );
}
