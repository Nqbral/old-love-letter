import PreviousNavBar from '@components/PreviousNavBar';
import GameManager from '@components/game/GameManager';

export default function GamePage() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <PreviousNavBar linkTo="/lobby" />
      <GameManager />
    </div>
  );
}
