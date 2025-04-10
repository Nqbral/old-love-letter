import { MouseEventHandler } from 'react';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
  disabled: boolean;
};

export default function SecondaryButton({
  buttonText,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      className="button border-secondary hover:border-secondary-hover my-1 max-w-64 min-w-48 rounded-md border-2 px-6 py-2 transition-colors"
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </button>
  );
}
