import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayPriestButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playPriest = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Prêtre"
      onClick={playPriest}
      primary={primary}
    />
  );
}
