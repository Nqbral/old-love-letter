import type { Metadata } from 'next';
import { MedievalSharp, Quintessential } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
  title: 'Love Letter',
  description: 'Love Letter online game',
};

const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medievalsharp',
  weight: ['400'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${medievalsharp.className}`}>
      <body>{children}</body>
    </html>
  );
}
