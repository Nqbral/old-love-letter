import { MouseEventHandler } from 'react';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
  disabled: boolean;
};

export default function RedButton({ buttonText, onClick, disabled }: Props) {
  return (
    <button
      className="button my-1 min-w-48 rounded-md border-2 border-red-600 px-6 py-2 transition-colors hover:border-red-700"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
}
