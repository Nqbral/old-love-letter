import BackCard from '@public/backcard.png';
import Handmaid from '@public/handmaid.png';
import Image from 'next/image';

export default function Deck() {
  return (
    <div className="flex flex-row gap-6">
      <div className="flex w-40 flex-col items-center gap-4">
        <div>Pioche (20)</div>
        <Image src={BackCard} alt="deck" />
      </div>
      <div className="flex w-40 flex-col items-center gap-4">
        <div>Défausse</div>
        <Image src={Handmaid} alt="discard" />
      </div>
    </div>
  );
}
