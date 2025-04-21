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
import { Cards } from '@shared/common/Cards';
import Image from 'next/image';

type Props = {
  card: Cards;
};

export default function DisplayCard({ card }: Props) {
  switch (card) {
    case Cards.Spy:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Espionne</p>
          <div className="w-32">
            <Image src={Spy} alt="spy_card" />
          </div>
        </div>
      );
    case Cards.Guard:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Garde</p>
          <div className="w-32">
            <Image src={Guard} alt="guard_card" />
          </div>
        </div>
      );
    case Cards.Priest:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Prêtre</p>
          <div className="w-32">
            <Image src={Priest} alt="priest_card" />
          </div>
        </div>
      );
    case Cards.Baron:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Baron</p>
          <div className="w-32">
            <Image src={Baron} alt="baron_card" />
          </div>
        </div>
      );
    case Cards.Handmaid:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Servante</p>
          <div className="w-32">
            <Image src={Handmaid} alt="handmaid_card" />
          </div>
        </div>
      );
    case Cards.Prince:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Prince</p>
          <div className="w-32">
            <Image src={Prince} alt="prince_card" />
          </div>
        </div>
      );
    case Cards.Chancellor:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Chancelier</p>
          <div className="w-32">
            <Image src={Chancellor} alt="chancellor_card" />
          </div>
        </div>
      );
    case Cards.King:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Roi</p>
          <div className="w-32">
            <Image src={King} alt="king_card" />
          </div>
        </div>
      );
    case Cards.Countess:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Comtesse</p>
          <div className="w-32">
            <Image src={Countess} alt="countess_card" />
          </div>
        </div>
      );
    case Cards.Princess:
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="font-bold">Princesse</p>
          <div className="w-32">
            <Image src={Princess} alt="player_card" />
          </div>
        </div>
      );
  }
}
