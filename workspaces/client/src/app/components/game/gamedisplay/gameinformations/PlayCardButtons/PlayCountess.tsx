import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayCountessButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playCountess = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer la Comtesse"
      onClick={playCountess}
      primary={primary}
    />
  );
}
