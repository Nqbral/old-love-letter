'use client';

import PreviousNavBar from '../components/PreviousNavBar';
import GameManager from '../components/game/GameManager';
import { SocketManagerProvider } from '../components/websocket/SocketManagerProvider';

export default function Lobby() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <PreviousNavBar linkTo="/" />
      <SocketManagerProvider>
        <GameManager />
      </SocketManagerProvider>
    </div>
  );
}
