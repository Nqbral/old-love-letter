import { useContext } from 'react';

import { SocketManagerContext } from '../websocket/SocketManagerProvider';

export default function useSocketManager() {
  const sm = useContext(SocketManagerContext);

  return { sm };
}
