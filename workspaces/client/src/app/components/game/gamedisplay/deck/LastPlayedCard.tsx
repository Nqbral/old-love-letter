import { Cards } from '@love-letter/shared/common/Cards';
import Baron from '@public/baron.png';
import Chancellor from '@public/chancellor.png';
import Countess from '@public/countess.png';
import Guard from '@public/guard.png';
import Handmaid from '@public/handmaid.png';
import King from '@public/king.png';
import Priest from '@public/priest.png';
import Prince from '@public/prince.png';
import Princess from '@public/princess.png';
import Spy from '@public/spy.png';
import Image from 'next/image';

type Props = {
  card: Cards;
};

export default function LastPlayedCard({ card }: Props) {
  switch (card) {
    case Cards.Spy:
      return (
        <div className="w-24">
          <Image src={Spy} alt="player_card" />
        </div>
      );
    case Cards.Guard:
      return (
        <div className="w-24">
          <Image src={Guard} alt="player_card" />
        </div>
      );
    case Cards.Priest:
      return (
        <div className="w-24">
          <Image src={Priest} alt="player_card" />
        </div>
      );
    case Cards.Baron:
      return (
        <div className="w-24">
          <Image src={Baron} alt="player_card" />
        </div>
      );
    case Cards.Handmaid:
      return (
        <div className="w-24">
          <Image src={Handmaid} alt="player_card" />
        </div>
      );
    case Cards.Prince:
      return (
        <div className="w-24">
          <Image src={Prince} alt="player_card" />
        </div>
      );
    case Cards.Chancellor:
      return (
        <div className="w-24">
          <Image src={Chancellor} alt="player_card" />
        </div>
      );
    case Cards.King:
      return (
        <div className="w-24">
          <Image src={King} alt="player_card" />
        </div>
      );
    case Cards.Countess:
      return (
        <div className="w-24">
          <Image src={Countess} alt="player_card" />
        </div>
      );
    case Cards.Princess:
      return (
        <div className="w-24">
          <Image src={Princess} alt="player_card" />
        </div>
      );
  }
}
