import BackCard from '@public/backcard.png';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import Image from 'next/image';

type Props = {
  gameState: ServerPayloads[ServerEvents.GameState];
};

export default function Deck({ gameState }: Props) {
  return (
    <div className="flex flex-row gap-6">
      <div className="flex w-24 flex-col items-center gap-4">
        <div>Pioche ({gameState.deck.length})</div>
        <Image src={BackCard} alt="deck" />
      </div>
      <div className="flex w-24 flex-col items-center gap-4">
        <div>Défausse</div>
        <div className="h-full w-24 rounded-sm border-1 border-dashed border-slate-700"></div>
        {/* <Image src={Handmaid} alt="discard" /> */}
      </div>
    </div>
  );
}
