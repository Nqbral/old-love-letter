'use client';

import { MedievalSharp } from 'next/font/google';
import { ToastContentProps } from 'react-toastify';

const medievalsharp = MedievalSharp({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-medievalsharp',
  weight: ['400'],
});

type CustomNotificationProps = ToastContentProps<{
  title: string;
  content: string;
}>;

export default function CustomNotification({
  data,
  toastProps,
}: CustomNotificationProps) {
  return (
    <div className={`${medievalsharp.className}`}>
      <div className="flex w-full flex-col items-center gap-4">
        <h3 className="text-primary text-lg">{data.title}</h3>
        <p className="text-center text-sm text-white">{data.content}</p>
      </div>
    </div>
  );
}
