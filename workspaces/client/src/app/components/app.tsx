'use client';

import { SocketManagerProvider } from '@components/websocket/SocketManagerProvider';
import { MedievalSharp } from 'next/font/google';

const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medievalsharp',
  weight: ['400'],
});

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketManagerProvider>
      <SocketManagerProvider>
        <html className={`${medievalsharp.className}`}>
          <body>{children}</body>
        </html>
      </SocketManagerProvider>
    </SocketManagerProvider>
  );
}
