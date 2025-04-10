import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BackCard from '@public/backcard.png';
import Image from 'next/image';

export default function OtherPlayer() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div>OtherPlayer</div>
      <div className="flex flex-row gap-2">
        <div>0</div>
        <FontAwesomeIcon icon={faCoins} color="oklch(92.4% 0.12 95.746)" />
      </div>
      <div className="w-40">
        <Image src={BackCard} alt="player_card" />
      </div>
    </div>
  );
}
