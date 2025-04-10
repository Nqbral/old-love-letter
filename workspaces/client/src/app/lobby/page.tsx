'use client';

import LobbyManager from '@components/lobby/LobbyManager';
import PreviousNavBar from '@components/navbar/PreviousNavBar';

export default function LobbyPage() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <PreviousNavBar linkTo="/" />
      <h1 className="text-primary text-4xl">Lobby</h1>
      <LobbyManager />
    </div>
  );
}
