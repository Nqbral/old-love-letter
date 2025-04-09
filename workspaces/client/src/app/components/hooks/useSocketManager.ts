import { useContext } from 'react';
import { atom } from 'jotai';

import { SocketManagerContext } from '../websocket/SocketManagerProvider';

export default function useSocketManager() {
  const sm = useContext(SocketManagerContext);

  return { sm };
}
