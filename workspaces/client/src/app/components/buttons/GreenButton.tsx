import { MouseEventHandler } from 'react';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
  disabled: boolean;
};

export default function GreenButton({ buttonText, onClick, disabled }: Props) {
  return (
    <button
      className="button my-1 min-w-48 rounded-md bg-green-600 px-6 py-2 transition-colors hover:bg-green-700"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
}
