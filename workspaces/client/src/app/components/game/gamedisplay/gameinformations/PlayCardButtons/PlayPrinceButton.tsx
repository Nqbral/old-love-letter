import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayPrinceButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playPrince = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Prince"
      onClick={playPrince}
      primary={primary}
    />
  );
}
