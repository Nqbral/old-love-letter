import type { Metadata } from 'next';
import { Quintessential } from 'next/font/google';

import './globals.css';

export const metadata: Metadata = {
  title: 'Love Letter',
  description: 'Love Letter online game',
};

const quintessential = Quintessential({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quintessential',
  weight: ['400'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${quintessential.className}`}>
      <body>{children}</body>
    </html>
  );
}
