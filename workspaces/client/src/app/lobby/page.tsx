'use client';

import PreviousNavBar from '../components/PreviousNavBar';
import LobbyManager from '../components/game/LobbyManager';
import { SocketManagerProvider } from '../components/websocket/SocketManagerProvider';

export default function Lobby() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <PreviousNavBar linkTo="/" />
      <SocketManagerProvider>
        <LobbyManager />
      </SocketManagerProvider>
    </div>
  );
}
