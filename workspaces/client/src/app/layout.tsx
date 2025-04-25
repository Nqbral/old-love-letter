import App from '@components/app';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Love Letter',
  description: 'Love Letter online game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <App>{children}</App>;
}
