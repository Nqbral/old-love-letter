import { useRouter } from 'next/navigation';

import useSocketManager from '../hooks/useSocketManager';
import LobbyIntroduction from './LobbyIntroduction';

export default function LobbyManager() {
  const router = useRouter();
  const { sm } = useSocketManager();
  return <LobbyIntroduction />;
}
