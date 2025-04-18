import PrimaryOrSecondaryButton from '@components/buttons/PrimaryOrSecondaryButton';

type Props = {
  primary: boolean;
  disabled: boolean;
  showNotYourTurn: () => void;
};

export default function PlayKingButton({
  primary,
  disabled,
  showNotYourTurn,
}: Props) {
  const playKing = () => {
    if (disabled) {
      showNotYourTurn();
    }
  };
  return (
    <PrimaryOrSecondaryButton
      buttonText="Jouer le Roi"
      onClick={playKing}
      primary={primary}
    />
  );
}
