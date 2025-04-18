import { MouseEventHandler } from 'react';

import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

type Props = {
  buttonText: string;
  onClick: MouseEventHandler | undefined;
  primary: boolean;
};

export default function PrimaryOrSecondaryButton({
  buttonText,
  onClick,
  primary,
}: Props) {
  if (primary) {
    return (
      <PrimaryButton
        buttonText={buttonText}
        onClick={onClick}
        disabled={false}
      ></PrimaryButton>
    );
  }
  return (
    <SecondaryButton
      buttonText={buttonText}
      onClick={onClick}
      disabled={false}
    ></SecondaryButton>
  );
}
