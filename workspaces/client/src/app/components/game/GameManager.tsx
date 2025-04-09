import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useSocketManager from '../hooks/useSocketManager';
import LobbyIntroduction from './LobbyIntroduction';

export default function LobbyManager() {
  const router = useRouter();
  const { sm } = useSocketManager();

  useEffect(() => {
    sm.connect();
  }, []);

  return <LobbyIntroduction />;
}
